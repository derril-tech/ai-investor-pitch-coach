# Created automatically by Cursor AI (2024-08-24)

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

# Database variables
variable "database_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "database_allocated_storage" {
  description = "RDS allocated storage in GB"
  type        = number
  default     = 20
}

# Redis variables
variable "redis_node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = "cache.t3.micro"
}

variable "redis_num_cache_nodes" {
  description = "Number of cache nodes"
  type        = number
  default     = 1
}

# S3 variables
variable "s3_bucket_name" {
  description = "S3 bucket name for file storage"
  type        = string
  default     = "pitch-coach-storage"
}

# ECS variables
variable "gateway_image" {
  description = "Gateway service Docker image"
  type        = string
  default     = "pitch-coach/gateway:latest"
}

variable "orchestrator_image" {
  description = "Orchestrator service Docker image"
  type        = string
  default     = "pitch-coach/orchestrator:latest"
}

variable "workers_image" {
  description = "Workers service Docker image"
  type        = string
  default     = "pitch-coach/workers:latest"
}

variable "gateway_desired_count" {
  description = "Desired number of gateway service instances"
  type        = number
  default     = 2
}

variable "orchestrator_desired_count" {
  description = "Desired number of orchestrator service instances"
  type        = number
  default     = 1
}

variable "workers_desired_count" {
  description = "Desired number of workers service instances"
  type        = number
  default     = 2
}

# Domain variables
variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "pitch-coach.example.com"
}

# Monitoring variables
variable "enable_monitoring" {
  description = "Enable CloudWatch monitoring"
  type        = bool
  default     = true
}

variable "enable_logging" {
  description = "Enable CloudWatch logging"
  type        = bool
  default     = true
}

# Security variables
variable "enable_waf" {
  description = "Enable AWS WAF"
  type        = bool
  default     = true
}

variable "enable_ssl" {
  description = "Enable SSL/TLS"
  type        = bool
  default     = true
}

# Scaling variables
variable "min_capacity" {
  description = "Minimum capacity for auto scaling"
  type        = number
  default     = 1
}

variable "max_capacity" {
  description = "Maximum capacity for auto scaling"
  type        = number
  default     = 10
}

# Backup variables
variable "enable_backups" {
  description = "Enable automated backups"
  type        = bool
  default     = true
}

variable "backup_retention_period" {
  description = "Backup retention period in days"
  type        = number
  default     = 7
}

# Tags
variable "tags" {
  description = "Additional tags for resources"
  type        = map(string)
  default = {
    Project     = "pitch-coach"
    ManagedBy   = "terraform"
    Owner       = "devops"
  }
}
