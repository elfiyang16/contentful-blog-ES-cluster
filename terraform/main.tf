
terraform {
  backend "remote" {
    organization = "elfi-my-zone"

    workspaces {
      name = "Contenful-Dynamodb-ES"
    }
  }

  required_version = ">= 0.13.0"
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_region" "current" {}

data "aws_caller_identity" "current" {}

data "aws_availability_zones" "available" {
  state = "available"
}

module "ContentfulTable" {
  source = "./dynamoDb"
}

module "StreamLambda" {
  source = "./lambda"

  aws_region = var.aws_region
  stream_arn = module.ContentfulTable.streamArn
  domain_arn = module.EsDomain.domain_arn
  es_host = module.EsDomain.domain_host
  access_key_id = var.access_key_id
  secret_access_key=var.secret_access_key
}


module "ElasticSearch" {
  source = "./elasticsearch"
  writer_role_arn = module.StreamLambda[0].lambda_role_arn
}