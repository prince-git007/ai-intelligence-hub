# ⚡ AWS Deployment - Quick Start Checklist

Get your AI Intelligence Hub deployed to AWS in **15 minutes**!

---

## ✅ Pre-Deployment Checklist

### Before You Begin

- [ ] **AWS EC2 Instance** running Ubuntu
- [ ] **SSH Key** (`.pem` file) downloaded
- [ ] **GitHub Account** with repository
- [ ] **EC2 Public IP** address noted
- [ ] **Security Group** configured (ports 22, 80, 5000, 5678)

---

## 🚀 Deployment Steps (15 Minutes)

### Step 1: Update Repository URL (2 min)

1. Open `.github/workflows/deploy.yml`
2. Find line with `git clone`
3. Replace `YOUR_USERNAME/YOUR_REPO_NAME` with your actual repo
4. Save file

**Example**:
```yaml
git clone https://github.com/johndoe/ai-intelligence-hub.git
```

---

### Step 2: Add GitHub Secrets (5 min)

Go to: **GitHub Repository → Settings → Secrets and variables → Actions**

#### Add 3 Secrets:

**1. AWS_SSH_PRIVATE_KEY**
```bash
# On Windows:
Get-Content "C:\path\to\your\key.pem"

# On Mac/Linux:
cat ~/path/to/your/key.pem
```
Copy the ENTIRE output (including BEGIN and END lines)

**2. AWS_HOST**
```
Your EC2 IP: e.g., 52.23.45.67
```

**3. AWS_USER**
```
ubuntu
```

**Quick Verification**:
You should see 3 secrets with `•••••••••••` values

---

### Step 3: Test SSH Connection (2 min)

Test manually before deploying:

```bash
# Windows PowerShell:
ssh -i "C:\path\to\key.pem" ubuntu@YOUR_EC2_IP

# Mac/Linux:
chmod 400 ~/path/to/key.pem
ssh -i ~/path/to/key.pem ubuntu@YOUR_EC2_IP
```

**Should see**: `ubuntu@ip-xxx-xxx-xxx-xxx:~$`

Type `exit` to disconnect

---

### Step 4: Commit & Push (1 min)

```bash
git add .
git commit -m "Add AWS deployment workflow"
git push origin main
```

---

### Step 5: Monitor Deployment (5 min)

1. Go to **GitHub → Actions tab**
2. Click on running workflow: **"Deploy to AWS EC2"**
3. Watch real-time logs
4. Wait for green checkmark ✅

**Timeline**:
- First deployment: ~5-10 minutes (Docker installation)
- Subsequent: ~2-3 minutes

---

### Step 6: Configure API Keys (2 min)

After first deployment, update your API keys:

```bash
# SSH to EC2
ssh -i key.pem ubuntu@YOUR_EC2_IP

# Edit .env
cd ~/ai-intelligence-hub
nano server/.env

# Update this line:
GROQ_API_KEY=gsk_YOUR_ACTUAL_KEY_HERE

# Save: Ctrl+X, Y, Enter

# Restart
sudo docker-compose restart
```

---

### Step 7: Access Your App (1 min)

**Frontend**: `http://YOUR_EC2_IP`  
**Backend**: `http://YOUR_EC2_IP:5000/health`  
**n8n**: `http://YOUR_EC2_IP:5678`

---

## 🎯 Quick Verification

### ✅ Is Everything Working?

Run these checks:

**1. GitHub Actions**
```
✓ Green checkmark on latest workflow
```

**2. Frontend**
```bash
# Open in browser:
http://YOUR_EC2_IP

# Should see: Dark mode dashboard
```

**3. Backend**
```bash
# Test API:
curl http://YOUR_EC2_IP:5000/health

# Should return:
{"status":"ok","message":"AI Intelligence Hub API is running"...}
```

**4. Docker Containers**
```bash
# SSH to EC2
ssh -i key.pem ubuntu@YOUR_EC2_IP

# Check status
cd ~/ai-intelligence-hub
sudo docker-compose ps

# Should show 4 containers running:
✓ ai-hub-mongodb
✓ ai-hub-server
✓ ai-hub-client
✓ ai-hub-n8n
```

---

## 🔄 Daily Workflow (After Setup)

### Making Updates:

```bash
# 1. Make changes locally
# 2. Test locally: docker-compose up -d
# 3. Commit and push
git add .
git commit -m "Your update"
git push origin main

# 4. Auto-deploys! Watch in Actions tab
```

That's it! No manual SSH needed anymore! 🎉

---

## 🐛 Troubleshooting

### Issue: Deployment fails at "Setup SSH Key"

**Solution**:
- Check AWS_SSH_PRIVATE_KEY includes BEGIN/END lines
- Verify no extra spaces or newlines

### Issue: "Permission denied (publickey)"

**Solution**:
- Double-check SSH key is correct
- Verify AWS_USER is `ubuntu`
- Test SSH manually first

### Issue: Containers not starting

**Solution**:
```bash
# SSH to EC2
ssh -i key.pem ubuntu@YOUR_EC2_IP

# Check logs
cd ~/ai-intelligence-hub
sudo docker-compose logs

# Restart
sudo docker-compose down
sudo docker-compose up -d --build
```

### Issue: Can't access frontend

**Solution**:
- Check Security Group allows port 80
- Verify EC2 is running: AWS Console → EC2 → Instances
- Check container: `sudo docker-compose ps`

---

## 📚 Reference Documents

| Document | Purpose |
|----------|---------|
| `GITHUB-SECRETS-SETUP.md` | Detailed secrets guide |
| `AWS-DEPLOYMENT-GUIDE.md` | Complete deployment guide |
| `DEPLOYMENT-FLOW.md` | Visual deployment flow |
| `.github/workflows/deploy.yml` | Actual workflow file |

---

## 🎓 Understanding the Flow

```
1. You push code → GitHub
2. GitHub Actions triggers
3. Connects to EC2 via SSH
4. Installs Docker (first time only)
5. Pulls latest code
6. Builds & starts containers
7. ✅ App is live!
```

**Time**: 2-3 minutes per deployment (after first time)

---

## 🔐 Security Checklist

- [ ] SSH key stored in GitHub Secrets (not in code)
- [ ] `.gitignore` includes `.env` files
- [ ] EC2 Security Group restricts SSH to your IP
- [ ] n8n port (5678) restricted to admin IP
- [ ] API keys in `.env`, not in code
- [ ] Regular security updates: `sudo apt-get update && sudo apt-get upgrade`

---

## 🎯 Production Optimization (Optional)

### Add SSL/HTTPS:

```bash
# SSH to EC2
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Add Custom Domain:

1. Point your domain to EC2 IP
2. Update Security Group
3. Configure Nginx
4. Add SSL certificate

### Enable Monitoring:

```bash
# Install monitoring tools
sudo docker stats

# Or use AWS CloudWatch
```

---

## ✨ Success!

Once complete, you have:

✅ Fully automated CI/CD pipeline  
✅ Push-to-deploy workflow  
✅ Docker containerized app  
✅ Production-ready infrastructure  
✅ Real-time deployment monitoring  

---

## 🆘 Get Help

### 1. Check Workflow Logs
GitHub → Actions → Click on workflow → View logs

### 2. Check Server Logs
```bash
ssh -i key.pem ubuntu@YOUR_EC2_IP
cd ~/ai-intelligence-hub
sudo docker-compose logs
```

### 3. Test Components

**Test Backend**:
```bash
curl http://YOUR_EC2_IP:5000/health
```

**Test MongoDB**:
```bash
sudo docker-compose exec mongodb mongosh
# Then: show dbs
```

**Test Frontend**:
Open `http://YOUR_EC2_IP` in browser

---

## 📞 Support Resources

- GitHub Actions Docs: https://docs.github.com/en/actions
- Docker Docs: https://docs.docker.com
- AWS EC2 Docs: https://docs.aws.amazon.com/ec2/

---

## 🎉 You're Live!

Your AI Intelligence Hub is now:

🚀 **Deployed** on AWS  
⚡ **Automated** with GitHub Actions  
🔒 **Secured** with proper secrets  
📊 **Monitored** in real-time  
🔄 **Updated** automatically on push  

**Happy Deploying!** 🎊

---

**Time Invested**: ~15 minutes  
**Time Saved**: Hours of manual deployment  
**Result**: Professional CI/CD pipeline! 🏆
