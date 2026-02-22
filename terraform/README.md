```markdown
# Terraform EC2 Node.js Deployment with EBS

This project provisions an **EC2 instance with a gp3 EBS root volume** on AWS and deploys a **Node.js application** using PM2.

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
````

2. **Set AWS environment variables**

   ```bash
   export AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY"
   export AWS_SECRET_ACCESS_KEY="YOUR_SECRET_KEY"
   export AWS_REGION="ap-south-1"
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

* `ec2_public_ip` → Use to SSH:

```bash
ssh -i ~/.ssh/my-keypair.pem ubuntu@<ec2_public_ip>
```

---

## EC2 & EBS Notes

* Root volume is **30 GB gp3 EBS** by default.
* EBS volume initialization happens automatically during provisioning.
* Root volume will be **deleted on termination** by default.
* Additional EBS volumes can be attached if required in Terraform.

---

## Debug / Logs

* Cloud-init / Terraform remote-exec logs:

```bash
sudo tail -f /var/log/cloud-init-output.log
```

* Check Node.js app status:

```bash
pm2 list
pm2 logs
```

---

## Notes / Tips

* Free Tier supports only `t3.micro` or `t2.micro`.
* Destroy resources when done:

```bash
terraform destroy
```


```markdown
--- 

## Nginx Configuration

This project also uses **Nginx as a reverse proxy** to route traffic to the Node.js app.  

### Files to include in your Terraform repo

```

nginx/
├── nginx.conf              # Global Nginx config
└── api.pictinc.org         # Site-specific config for api.pictinc.org



- `nginx.conf` → contains global `events` and `http` blocks.
- `api.pictinc.org` → contains your server blocks for HTTP → HTTPS redirect, proxying `/api` to Node.js, and `/health`.

### Steps to deploy Nginx after SSHing

1. **Copy files to the server**

```bash
scp -i ~/.ssh/my-keypair.pem -r nginx/ ubuntu@<ec2_public_ip>:/home/ubuntu/
````

2. **Move files to proper Nginx directories**

```bash
sudo cp /home/ubuntu/nginx/nginx.conf /etc/nginx/nginx.conf
sudo cp /home/ubuntu/nginx/api.pictinc.org /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/api.pictinc.org /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default   # remove default if it exists
```

3. **Test and reload Nginx**

```bash
sudo nginx -t       # test config
sudo systemctl restart nginx
sudo systemctl status nginx
```

4. **Verify**

```bash
curl -I https://api.pictinc.org/health
```

> ✅ If everything is correct, you should see HTTP 200 with `healthy`.

> For CI/CD, allow SSH temporarily and store the following in **GitHub Secrets**: `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY`.



