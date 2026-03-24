output "ec2_public_ip" {
  value = aws_eip.node_app_eip.public_ip
}
