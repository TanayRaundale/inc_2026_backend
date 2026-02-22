resource "aws_security_group" "node_sg" {
  name = "${var.app_name}-sg"

  # SSH from your IP only — replace with your public IP
  ingress {
    description = "SSH from dev laptop only"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["115.248.146.117/32"]  // YOUR_IP
  }

  # HTTP
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS
ingress {
  description = "HTTPS"
  from_port   = 443
  to_port     = 443
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]  # allow all IPs to connect via HTTPS
}

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  # App port for Node.js
ingress {
  description = "Node.js app port"
  from_port   = 3001
  to_port     = 3001
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]  
}

}
