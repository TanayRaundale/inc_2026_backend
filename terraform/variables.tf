variable "aws_region" {
  default = "ap-south-1"
}

variable "instance_type" {
  default = "t3.medium"
}

variable "key_name" {
  description = "Existing EC2 key pair name"
  default     = "inc2026"
}

variable "private_key_path" {
  description = "Path to your .pem file inside terraform folder"
  default     = "inc2026.pem"
}

variable "local_env_path" {
  description = "Path to local .env.dev file"
  default     = "/mnt/d/INC2026/Backend/inc_2026_backend/.env.dev"
}

variable "app_name" {
  default = "inc-2026-backend"
}

variable "repo_url" {
  default = "https://github.com/TanayRaundale/inc_2026_backend.git"
}
