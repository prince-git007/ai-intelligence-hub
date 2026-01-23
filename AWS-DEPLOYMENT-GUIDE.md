# 🚀 AWS Deployment with GitHub Actions - Complete Guide

This guide will help you deploy your AI Intelligence Hub to AWS EC2 automatically using GitHub Actions.

---

## 📋 Prerequisites

Before you begin, make sure you have:

1. ✅ An **AWS EC2 Ubuntu Server** running
2. ✅ **SSH access** to your EC2 instance
3. ✅ A **GitHub repository** for your project
4. ✅ Your EC2's **Public IP Address** or **Domain Name**
5. ✅ Your EC2's **SSH Private Key** (`.pem` file)

---

## 🔐 Step 1: Prepare Your SSH Key

### 1.1 Locate Your SSH Private Key

Your AWS SSH key is usually downloaded as a `.pem` file when you create your EC2 instance.

**Example**: `my-aws-key.pem`

### 1.2 View Your Private Key Contents

**On Windows (PowerShell):**
```powershell
Get-Content "C:\path\to\your\my-aws-key.pem"
```

**On Mac/Linux (Terminal):**
```bash
cat ~/path/to/your/my-aws-key.pem
```

### 1.3 Copy the Entire Key

The output should look like this:

```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA... (many lines of random characters)
...
...
-----END RSA PRIVATE KEY-----
```

**⚠️ IMPORTANT**: Copy the **ENTIRE** key including the `-----BEGIN` and `-----END` lines!

---

## 🔑 Step 2: Add Secrets to GitHub

### 2.1 Navigate to Your Repository on GitHub

Go to: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`

### 2.2 Open Settings

1. Click on **Settings** (top right of your repo)
2. In the left sidebar, click **Secrets and variables**
3. Click **Actions**

### 2.3 Add the Following Secrets

Click **"New repository secret"** for each of these:

#### Secret 1: `AWS_SSH_PRIVATE_KEY`
- **Name**: `AWS_SSH_PRIVATE_KEY`
- **Value**: Paste your **entire** SSH private key (including BEGIN and END lines)
- Click **"Add secret"**

#### Secret 2: `AWS_HOST`
- **Name**: `AWS_HOST`
- **Value**: Your EC2's public IP address or domain
  - Example: `52.23.45.67`
  - Or: `myapp.example.com`
- Click **"Add secret"**

#### Secret 3: `AWS_USER`
- **Name**: `AWS_USER`
- **Value**: Your SSH username (usually `ubuntu` for Ubuntu servers)
  - For Ubuntu: `ubuntu`
  - For Amazon Linux: `ec2-user`
  - For Debian: `admin`
- Click **"Add secret"**

### 2.4 Verify Your Secrets

After adding all three secrets, you should see:

```
AWS_SSH_PRIVATE_KEY  •••••••••••
AWS_HOST             •••••••••••
AWS_USER             •••••••••••
```

---

## ⚙️ Step 3: Configure the Workflow

### 3.1 Update Repository URL

Open `.github/workflows/deploy.yml` and find this line:

```yaml
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git ai-intelligence-hub
```

**Replace** `YOUR_USERNAME/YOUR_REPO_NAME` with your actual GitHub username and repository name.

**Example**:
```yaml
git clone https://github.com/johndoe/ai-intelligence-hub.git ai-intelligence-hub
```

### 3.2 Update Branch Name (if needed)

If your default branch is **NOT** `main`, update these lines:

```yaml
# In the workflow file, change 'main' to your branch name
branches:
  - main  # Change to 'master' if needed

# And in the git commands:
git reset --hard origin/main  # Change to 'master' if needed
git pull origin main  # Change to 'master' if needed
```

---

## 🔒 Step 4: Prepare Your AWS EC2 Server

### 4.1 Connect to Your EC2 Instance

**On Windows (PowerShell):**
```powershell
ssh -i "C:\path\to\your\my-aws-key.pem" ubuntu@YOUR_EC2_IP
```

**On Mac/Linux (Terminal):**
```bash
chmod 400 ~/path/to/your/my-aws-key.pem
ssh -i ~/path/to/your/my-aws-key.pem ubuntu@YOUR_EC2_IP
```

### 4.2 Update Server (Optional but Recommended)

```bash
sudo apt-get update
sudo apt-get upgrade -y
```

### 4.3 Configure Security Group (Firewall Rules)

In AWS Console, make sure your Security Group allows:

| Type          | Protocol | Port Range | Source      | Description                    |
|---------------|----------|------------|-------------|--------------------------------|
| SSH           | TCP      | 22         | Your IP     | SSH access                     |
| HTTP          | TCP      | 80         | 0.0.0.0/0   | Frontend access                |
| Custom TCP    | TCP      | 5000       | 0.0.0.0/0   | Backend API (or restrict)      |
| Custom TCP    | TCP      | 5678       | Your IP     | n8n (should be restricted!)    |

**⚠️ Security Note**: For production, restrict ports 5000 and 5678 to specific IPs or use a reverse proxy.

---

## 🚀 Step 5: Deploy Your Application

### 5.1 Commit and Push Your Code

```bash
git add .
git commit -m "Add GitHub Actions deployment workflow"
git push origin main
```

### 5.2 Monitor the Deployment

1. Go to your GitHub repository
2. Click on **Actions** tab
3. You should see a workflow running: **"Deploy to AWS EC2"**
4. Click on it to see real-time logs

### 5.3 Deployment Process

The workflow will:
1. ✅ Checkout your code
2. ✅ Setup SSH connection
3. ✅ Connect to your EC2 server
4. ✅ Install Docker (if not present)
5. ✅ Install Docker Compose (if not present)
6. ✅ Clone/pull your latest code
7. ✅ Create default `.env` file (if needed)
8. ✅ Stop existing containers
9. ✅ Build and start new containers
10. ✅ Show container status and logs

---

## 🎯 Step 6: Configure Your Application

### 6.1 SSH into Your Server

```bash
ssh -i ~/path/to/your/key.pem ubuntu@YOUR_EC2_IP
```

### 6.2 Update Environment Variables

```bash
cd ~/ai-intelligence-hub
nano server/.env
```

**Update these values**:

```bash
# Add your actual Groq API key
GROQ_API_KEY=gsk_YOUR_ACTUAL_API_KEY_HERE

# Update CORS if you have a custom domain
CORS_ORIGIN=http://your-domain.com,http://YOUR_EC2_IP

# Update n8n webhook if configured
N8N_WEBHOOK_URL=http://n8n:5678/webhook/reply-lead
```

Save and exit: `Ctrl + X`, then `Y`, then `Enter`

### 6.3 Restart Containers

```bash
sudo docker-compose restart
```

---

## 🌐 Step 7: Access Your Application

### Frontend (Dashboard)
```
http://YOUR_EC2_IP
```
or
```
http://your-domain.com
```

### Backend API
```
http://YOUR_EC2_IP:5000/health
```

### n8n Automation
```
http://YOUR_EC2_IP:5678
```

---

## 🔍 Troubleshooting

### Issue: "Permission denied (publickey)"

**Solution**: Check that:
1. Your SSH key is correct in GitHub Secrets
2. The key includes BEGIN and END lines
3. Your AWS_USER is correct (usually `ubuntu`)

### Issue: "Connection refused"

**Solution**: Check that:
1. Your EC2 instance is running
2. Security Group allows SSH (port 22) from GitHub's IPs
3. Your EC2's public IP is correct

### Issue: Docker permission denied

**Solution**: On your EC2 server, run:
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Issue: Containers not starting

**Solution**: Check logs on your EC2 server:
```bash
cd ~/ai-intelligence-hub
sudo docker-compose logs
```

---

## 🔄 How to Update Your App

After the initial setup, deploying updates is simple:

1. Make changes to your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
3. GitHub Actions automatically deploys! 🚀

---

## 🛡️ Security Best Practices

### 1. Use Environment Variables for Secrets
- Never commit API keys to GitHub
- Always use GitHub Secrets for sensitive data

### 2. Restrict Security Group Rules
- Only allow SSH from your IP
- Consider using a VPN or bastion host

### 3. Set Up SSL/HTTPS
```bash
# Install Certbot for Let's Encrypt SSL
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 4. Enable Docker Content Trust
```bash
export DOCKER_CONTENT_TRUST=1
```

### 5. Regular Updates
```bash
# On your EC2 server
sudo apt-get update
sudo apt-get upgrade -y
```

---

## 📊 Monitoring Your Application

### Check Container Status
```bash
cd ~/ai-intelligence-hub
sudo docker-compose ps
```

### View Logs
```bash
# All containers
sudo docker-compose logs

# Specific container
sudo docker-compose logs server
sudo docker-compose logs client
sudo docker-compose logs mongodb
sudo docker-compose logs n8n
```

### Follow Logs in Real-Time
```bash
sudo docker-compose logs -f
```

---

## 🎯 Advanced: Manual Deployment Trigger

You can manually trigger deployment from GitHub:

1. Go to **Actions** tab
2. Click **"Deploy to AWS EC2"** workflow
3. Click **"Run workflow"**
4. Select branch and click **"Run workflow"**

---

## 📝 Workflow File Explanation

```yaml
on:
  push:
    branches:
      - main  # Triggers on push to main branch
  workflow_dispatch:  # Allows manual trigger
```

**Triggers**: 
- Automatically on push to `main` branch
- Manually from GitHub Actions UI

```yaml
- name: 🔐 Setup SSH Key
  uses: webfactory/ssh-agent@v0.9.0
  with:
    ssh-private-key: ${{ secrets.AWS_SSH_PRIVATE_KEY }}
```

**Purpose**: Sets up SSH authentication using your private key

```yaml
- name: 📦 Add EC2 to Known Hosts
  run: |
    mkdir -p ~/.ssh
    ssh-keyscan -H ${{ secrets.AWS_HOST }} >> ~/.ssh/known_hosts
```

**Purpose**: Prevents SSH "unknown host" warnings

---

## 🆘 Getting Help

### Check Workflow Logs
1. Go to **Actions** tab on GitHub
2. Click on the failed workflow
3. Click on the failed step to see detailed logs

### Test SSH Connection Manually
```bash
ssh -i ~/path/to/key.pem ubuntu@YOUR_EC2_IP
```

### Check EC2 Server Logs
```bash
ssh -i ~/path/to/key.pem ubuntu@YOUR_EC2_IP
cd ~/ai-intelligence-hub
sudo docker-compose logs
```

---

## ✅ Checklist

Before deploying, make sure:

- [ ] EC2 instance is running
- [ ] Security Group allows ports 22, 80, 5000, 5678
- [ ] SSH private key is added to GitHub Secrets
- [ ] AWS_HOST secret is set correctly
- [ ] AWS_USER secret is set correctly
- [ ] Repository URL is updated in deploy.yml
- [ ] Branch name is correct in deploy.yml
- [ ] Groq API key is ready to be added to server/.env

---

## 🎉 Success!

Once everything is set up:

1. **Push to GitHub** → Automatic deployment! 🚀
2. **Access your app** at http://YOUR_EC2_IP
3. **Monitor in real-time** via GitHub Actions
4. **Scale as needed** by updating your EC2 instance

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

---

**🎨 Your AI Intelligence Hub is now production-ready on AWS!**

**Questions?** Check the troubleshooting section or review the workflow logs in GitHub Actions.
