resource "aws_instance" "node_app" {
  ami                    = "ami-0f5ee92e2d63afc18" # Ubuntu 22.04 official
  instance_type          = var.instance_type
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.node_sg.id]

  # -------------------------------
  # Root volume
  # -------------------------------
  root_block_device {
    volume_type           = "gp3"
    volume_size           = 30
    delete_on_termination = true
  }

  tags = {
    Name = var.app_name
  }

  connection {
    type        = "ssh"
    user        = "ubuntu"
    private_key = file(var.private_key_path)
    host        = self.public_ip
    timeout     = "10m"
  }

  # -------------------------------
  # Single remote-exec provisioner
  # -------------------------------
  provisioner "remote-exec" {
  inline = [
    "echo 'Waiting for cloud-init to finish...'",
    "cloud-init status --wait || echo 'Cloud-init timeout, continuing...'",

    "echo 'Creating app and temp directories...'",
    "mkdir -p /home/ubuntu/app",
    "chown -R ubuntu:ubuntu /home/ubuntu/app",

    "echo 'Cloning repo into app folder...'",
    "cd /home/ubuntu/app",
    "rm -rf ./* ./.??*",
    "git clone ${var.repo_url} .",
    "echo 'Writing .env.dev after cloning repo...'",
    "echo \"${file(var.local_env_path)}\" > /home/ubuntu/app/.env.dev",
    "if [ ! -s /home/ubuntu/app/.env.dev ]; then echo 'ERROR: .env.dev is missing or empty!' && exit 1; fi",
    "echo 'DEBUG: .env.dev written successfully:'",
    "head -n 10 /home/ubuntu/app/.env.dev",


    "echo 'Installing Node.js, git, and PM2...'",
    "curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -",
    "sudo apt-get update -y",
    "sudo apt-get install -y nodejs git",
    "sudo npm install -g pm2",

    "echo 'Installing app dependencies and starting app...'",
    "cd /home/ubuntu/app",
    "npm install --no-audit --no-fund --progress=false",
    "pm2 delete ${var.app_name} || true",
    "pm2 start index.js --name ${var.app_name}",
    "pm2 save"
  ]
}

}

  # 1. Allocate Elastic IP
resource "aws_eip" "node_app_eip" {
  depends_on = [aws_instance.node_app] 
}

# 2. Associate Elastic IP with your EC2
resource "aws_eip_association" "node_app_eip_assoc" {
  instance_id   = aws_instance.node_app.id
  allocation_id = aws_eip.node_app_eip.id
}



