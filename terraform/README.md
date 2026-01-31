````markdown
# Terraform EC2 Node.js Deployment

This project provisions an **EC2 instance** on AWS and deploys a **Node.js application** using PM2.

---

## Prerequisites

- Terraform installed ([Install Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli))
- AWS CLI configured: `aws configure`
- AWS Key Pair for SSH
- Node.js project repository (GitHub)

---

## Setup

1. **Clone repo & go to folder**

```bash
git clone <your-terraform-repo-url>
cd <terraform-folder>
```
````

````

2. **Set AWS environment variables**

```bash
export AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY"
export AWS_SECRET_ACCESS_KEY="YOUR_SECRET_KEY"
export AWS_REGION="us-east-1"
```

3. **Update `variables.tf`**

| Variable           | Description                                  |
| ------------------ | -------------------------------------------- |
| `key_name`         | AWS key pair name                            |
| `private_key_path` | Path to your `.pem` file                     |
| `instance_type`    | EC2 instance type (`t3.micro` for Free Tier) |
| `app_name`         | Name of Node.js app                          |
| `repo_url`         | GitHub repo URL                              |
| `local_env_path`   | Path to `.env` file                          |

---

## Deploy

```bash
terraform init      # Initialize Terraform
terraform plan      # Preview changes
terraform apply     # Apply changes (type 'yes' to confirm)
```

**Outputs:**

- `ec2_public_ip` → Use to SSH:

```bash
ssh -i ~/.ssh/my-keypair.pem ubuntu@<ec2_public_ip>
```

---

## Debug / Logs

- Cloud-init / Terraform remote-exec logs:

```bash
sudo tail -f /var/log/cloud-init-output.log
```

- Check Node app status:

```bash
pm2 list
pm2 logs
```

- If EC2 is low on memory (t3.micro), enable swap:

```bash
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
sudo sh -c 'echo "/swapfile none swap sw 0 0" >> /etc/fstab'
```

---

## Notes / Tips

- Free Tier supports only `t3.micro` or `t2.micro`.
- Swap is recommended for npm install on low-memory instances.
- Destroy resources when done:

```bash
terraform destroy
```

````
