# Created automatically by Cursor AI (2024-08-24)
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    postgresql = {
      source  = "cyrilgdn/postgresql"
      version = "~> 1.0"
    }
  }
  
  backend "s3" {
    bucket = "pitch-coach-terraform-state"
    key    = "main/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "pitch-coach"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# VPC and Networking
module "vpc" {
  source = "./modules/vpc"
  
  environment = var.environment
  vpc_cidr    = var.vpc_cidr
}

# RDS PostgreSQL Database
module "database" {
  source = "./modules/database"
  
  environment     = var.environment
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnet_ids
  instance_class  = var.database_instance_class
  allocated_storage = var.database_allocated_storage
}

# ElastiCache Redis
module "redis" {
  source = "./modules/redis"
  
  environment = var.environment
  vpc_id      = module.vpc.vpc_id
  subnet_ids  = module.vpc.private_subnet_ids
  node_type   = var.redis_node_type
  num_cache_nodes = var.redis_num_cache_nodes
}

# S3 for file storage
module "storage" {
  source = "./modules/storage"
  
  environment = var.environment
  bucket_name = var.s3_bucket_name
}

# ECS Cluster for containerized services
module "ecs" {
  source = "./modules/ecs"
  
  environment = var.environment
  vpc_id      = module.vpc.vpc_id
  subnet_ids  = module.vpc.private_subnet_ids
  
  # Service configurations
  gateway_image = var.gateway_image
  orchestrator_image = var.orchestrator_image
  workers_image = var.workers_image
  
  # Scaling configurations
  gateway_desired_count = var.gateway_desired_count
  orchestrator_desired_count = var.orchestrator_desired_count
  workers_desired_count = var.workers_desired_count
}

# Application Load Balancer
module "alb" {
  source = "./modules/alb"
  
  environment = var.environment
  vpc_id      = module.vpc.vpc_id
  subnet_ids  = module.vpc.public_subnet_ids
}

# CloudFront for CDN
module "cloudfront" {
  source = "./modules/cloudfront"
  
  environment = var.environment
  domain_name = var.domain_name
  s3_bucket_id = module.storage.bucket_id
}

# Route53 DNS
module "dns" {
  source = "./modules/dns"
  
  environment = var.environment
  domain_name = var.domain_name
  alb_dns_name = module.alb.dns_name
  cloudfront_domain_name = module.cloudfront.domain_name
}

# Monitoring and Logging
module "monitoring" {
  source = "./modules/monitoring"
  
  environment = var.environment
  vpc_id      = module.vpc.vpc_id
  subnet_ids  = module.vpc.private_subnet_ids
}

# Security Groups
module "security" {
  source = "./modules/security"
  
  environment = var.environment
  vpc_id      = module.vpc.vpc_id
}

# Outputs
output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "database_endpoint" {
  description = "RDS endpoint"
  value       = module.database.endpoint
  sensitive   = true
}

output "redis_endpoint" {
  description = "ElastiCache endpoint"
  value       = module.redis.endpoint
  sensitive   = true
}

output "alb_dns_name" {
  description = "Application Load Balancer DNS name"
  value       = module.alb.dns_name
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = module.cloudfront.domain_name
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = module.ecs.cluster_name
}

output "s3_bucket_name" {
  description = "S3 bucket name"
  value       = module.storage.bucket_name
}
