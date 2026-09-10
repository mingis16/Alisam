output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.cdn.domain_name
}

output "alb_dns_name" {
  value = aws_lb.main.dns_name
}

output "aurora_writer_endpoint" {
  value     = aws_rds_cluster.primary.endpoint
  sensitive = true
}

output "aurora_reader_endpoint" {
  value     = aws_rds_cluster.primary.reader_endpoint
  sensitive = true
}

output "redis_primary_endpoint" {
  value     = aws_elasticache_replication_group.redis.primary_endpoint_address
  sensitive = true
}
