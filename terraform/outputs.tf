output "ec2_public_ip" {
  value = aws_instance.node_app.public_ip
}
