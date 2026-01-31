resource "aws_instance" "node_app" {
  ami                    = "ami-0f5ee92e2d63afc18" # Ubuntu 22.04
  instance_type          = var.instance_type
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.node_sg.id]

  tags = {
    Name = var.app_name
  }

  connection {
    type        = "ssh"
    user        = "ubuntu"
    private_key = file(var.private_key_path)
    host        = self.public_ip
  }

  # -------------------------------
  # 1️. Create app directory FIRST
  # -------------------------------
  provisioner "remote-exec" {
    inline = [
      "echo 'Waiting for cloud-init to finish...'",
      "cloud-init status --wait",
      "sudo mkdir -p /home/ubuntu/app",
      "sudo chown -R ubuntu:ubuntu /home/ubuntu/app"
    ]
  }

  # -------------------------------
  # 2️. Copy .env file AFTER folder exists
  # -------------------------------
  provisioner "file" {
    source      = var.local_env_path
    destination = "/home/ubuntu/app/.env.dev"
  }

  # -------------------------------
  # 3️. Install Node + deploy app
  # -------------------------------
  provisioner "remote-exec" {
    inline = [
      # HARD disable interactive prompts
      "export DEBIAN_FRONTEND=noninteractive",
      "sudo systemctl stop unattended-upgrades || true",
      "sudo systemctl disable unattended-upgrades || true",
      "sudo sed -i 's/^Prompt=.*/Prompt=never/' /etc/update-manager/release-upgrades",

      # Update ONLY
      "sudo apt-get update -y",

      # Node.js 20
      "curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -",
      "sudo apt-get install -y nodejs git build-essential",

      # PM2
      "sudo npm install -g pm2",

      # Safety: remove any old files including hidden dotfiles
      "cd /home/ubuntu/app",
      "sudo rm -rf ./* ./.??*",

      # Clone repo fresh
      "git clone ${var.repo_url} .",

      # Install app dependencies
      "npm install --no-audit --no-fund --progress=false",

      # Run app with PM2
      "pm2 delete ${var.app_name} || true",
      "pm2 start index.js --name ${var.app_name}",
      "pm2 save"
    ]
  }
}
