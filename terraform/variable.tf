
variable "aws_region" {
  type = string
  description = "Used AWS Region"
  default = "eu-central-1"
}

variable "aws_profile" {
  type = string
  description = "Used AWS Profile for accessing services"
  default = "elfi"
}
variable "access_key_id" {
  type = string
  description = "Access Key"
}

variable "secret_access_key" {
  type = string
  description = "Secret Access Key"
}
