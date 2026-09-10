variable "aws_region" {
  type    = string
  default = "eu-west-1" # closest AWS region to Freetown, Sierra Leone
}

variable "project_name" {
  type    = string
  default = "standard-guest-house"
}

variable "container_image" {
  description = "Full image URI, e.g. ghcr.io/org/standard-guest-house:sha"
  type        = string
}

variable "db_master_username" {
  type      = string
  sensitive = true
}

variable "db_master_password" {
  type      = string
  sensitive = true
}

variable "read_replica_count" {
  type    = number
  default = 2
}

variable "redis_node_type" {
  type    = string
  default = "cache.r7g.large"
}

variable "min_task_count" {
  type    = number
  default = 3 # spread across 3 AZs at minimum
}

variable "max_task_count" {
  type    = number
  default = 60
}

variable "task_cpu" {
  type    = number
  default = 512
}

variable "task_memory" {
  type    = number
  default = 1024
}

variable "acm_certificate_arn" {
  description = "ACM certificate for standardguesthousefreetown.com (must be issued in us-east-1 for CloudFront)"
  type        = string
}
