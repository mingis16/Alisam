# Reference architecture for scaling Standard Guest House to 1,000,000+
# active users. This is illustrative infrastructure-as-code — review sizing,
# CIDR ranges, and IAM policies with your cloud team before applying.
#
#                        ┌─────────────────────┐
#   Users ─────────────▶ │ Cloudflare (CDN/WAF) │  edge cache + DDoS + WAF + rate limiting
#                        └──────────┬───────────┘
#                                   │ origin pull (TLS only)
#                        ┌──────────▼───────────┐
#                        │  AWS ALB (multi-AZ)   │
#                        └──────────┬───────────┘
#                                   │
#                 ┌─────────────────┼─────────────────┐
#                 ▼                 ▼                 ▼
#         ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
#         │ ECS Fargate    │ │ ECS Fargate    │ │ ECS Fargate    │   Next.js standalone
#         │ task (AZ-a)    │ │ task (AZ-b)    │ │ task (AZ-c)    │   containers, auto-scaled
#         └───────┬───────┘ └───────┬───────┘ └───────┬───────┘   on CPU/req count
#                 └─────────────────┼─────────────────┘
#                                   ▼
#                 ┌─────────────────────────────────┐
#                 │   ElastiCache Redis (cluster mode) │  availability cache + locks + rate limits
#                 └─────────────────────────────────┘
#                                   ▼
#                 ┌─────────────────────────────────┐
#                 │ Aurora PostgreSQL — 1 writer +    │  read replicas absorb availability/
#                 │ N read replicas (RDS Proxy pooled)│  listing reads; writer only for bookings
#                 └─────────────────────────────────┘

terraform {
  required_version = ">= 1.7.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ---------------------------------------------------------------------------
# Networking
# ---------------------------------------------------------------------------
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "${var.project_name}-vpc"
  cidr = "10.20.0.0/16"

  azs             = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
  private_subnets = ["10.20.1.0/24", "10.20.2.0/24", "10.20.3.0/24"]
  public_subnets  = ["10.20.101.0/24", "10.20.102.0/24", "10.20.103.0/24"]
  database_subnets = ["10.20.201.0/24", "10.20.202.0/24", "10.20.203.0/24"]

  enable_nat_gateway   = true
  single_nat_gateway   = false # one NAT per AZ for HA at scale
  enable_dns_hostnames = true
}

# ---------------------------------------------------------------------------
# Database: Aurora PostgreSQL, 1 writer + N read replicas
# ---------------------------------------------------------------------------
resource "aws_rds_cluster" "primary" {
  cluster_identifier      = "${var.project_name}-aurora"
  engine                  = "aurora-postgresql"
  engine_mode             = "provisioned"
  engine_version          = "16.4"
  database_name           = "standard_guest_house"
  master_username         = var.db_master_username
  master_password         = var.db_master_password
  db_subnet_group_name    = module.vpc.database_subnet_group_name
  vpc_security_group_ids  = [aws_security_group.db.id]
  backup_retention_period = 14
  storage_encrypted       = true
  deletion_protection     = true

  serverlessv2_scaling_configuration {
    min_capacity = 0.5
    max_capacity = 16
  }
}

# Writer instance
resource "aws_rds_cluster_instance" "writer" {
  identifier         = "${var.project_name}-writer"
  cluster_identifier = aws_rds_cluster.primary.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.primary.engine
  engine_version     = aws_rds_cluster.primary.engine_version
}

# Read replicas — scale this count with sustained read QPS
resource "aws_rds_cluster_instance" "replicas" {
  count              = var.read_replica_count
  identifier         = "${var.project_name}-replica-${count.index}"
  cluster_identifier = aws_rds_cluster.primary.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.primary.engine
  engine_version     = aws_rds_cluster.primary.engine_version
}

# Connection pooling in front of Aurora — protects the writer from
# connection storms during traffic spikes.
resource "aws_db_proxy" "pooler" {
  name                   = "${var.project_name}-proxy"
  engine_family          = "POSTGRESQL"
  role_arn               = aws_iam_role.rds_proxy.arn
  vpc_subnet_ids         = module.vpc.database_subnets
  require_tls            = true

  auth {
    auth_scheme = "SECRETS"
    secret_arn  = aws_secretsmanager_secret.db_credentials.arn
  }
}

# ---------------------------------------------------------------------------
# Cache: ElastiCache Redis (cluster mode enabled) for availability caching,
# distributed booking locks, and API rate limiting.
# ---------------------------------------------------------------------------
resource "aws_elasticache_replication_group" "redis" {
  replication_group_id       = "${var.project_name}-redis"
  description                = "Availability cache, booking locks, rate limiting"
  engine                     = "redis"
  engine_version             = "7.1"
  node_type                  = var.redis_node_type
  num_node_groups            = 2
  replicas_per_node_group    = 1
  automatic_failover_enabled = true
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  subnet_group_name          = aws_elasticache_subnet_group.redis.name
  security_group_ids         = [aws_security_group.redis.id]
}

resource "aws_elasticache_subnet_group" "redis" {
  name       = "${var.project_name}-redis-subnets"
  subnet_ids = module.vpc.private_subnets
}

# ---------------------------------------------------------------------------
# Compute: ECS Fargate service behind an ALB, auto-scaled on request count
# and CPU. Container image is the Dockerfile at the repo root.
# ---------------------------------------------------------------------------
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"
}

resource "aws_appautoscaling_target" "app" {
  max_capacity       = var.max_task_count
  min_capacity       = var.min_task_count
  resource_id        = "service/${aws_ecs_cluster.main.name}/${var.project_name}-service"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "scale_on_request_count" {
  name               = "${var.project_name}-scale-on-alb-requests"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.app.resource_id
  scalable_dimension = aws_appautoscaling_target.app.scalable_dimension
  service_namespace  = aws_appautoscaling_target.app.service_namespace

  target_tracking_scaling_policy_configuration {
    target_value = 1000 # requests per target per minute before scaling out
    predefined_metric_specification {
      predefined_metric_type = "ALBRequestCountPerTarget"
      resource_label         = "${aws_lb.main.arn_suffix}/${aws_lb_target_group.app.arn_suffix}"
    }
    scale_in_cooldown  = 120
    scale_out_cooldown = 30
  }
}

# ---------------------------------------------------------------------------
# CDN + WAF: CloudFront in front of the ALB (used if not fronting with
# Cloudflare directly), plus an AWS WAFv2 WebACL with rate-based rules.
# ---------------------------------------------------------------------------
resource "aws_wafv2_web_acl" "main" {
  name        = "${var.project_name}-waf"
  scope       = "CLOUDFRONT"
  description = "Rate limiting + managed rule sets for booking endpoints"

  default_action {
    allow {}
  }

  rule {
    name     = "RateLimitBookingEndpoints"
    priority = 1
    action {
      block {}
    }
    statement {
      rate_based_statement {
        limit              = 300 # requests per 5-minute window per IP
        aggregate_key_type = "IP"
        scope_down_statement {
          byte_match_statement {
            search_string = "/api/booking"
            field_to_match { uri_path {} }
            text_transformation {
              priority = 0
              type     = "NONE"
            }
            positional_constraint = "STARTS_WITH"
          }
        }
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RateLimitBookingEndpoints"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "AWSManagedCommonRuleSet"
    priority = 2
    override_action {
      none {}
    }
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "CommonRuleSet"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${var.project_name}-waf"
    sampled_requests_enabled   = true
  }
}
