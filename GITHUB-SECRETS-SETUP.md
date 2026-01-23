# 🔐 GitHub Secrets Setup - Quick Guide

This is a quick reference for setting up GitHub Secrets for AWS EC2 deployment.

---

## 📍 Where to Add Secrets

1. Go to your repository on GitHub: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`
2. Click **Settings** (top right)
3. In left sidebar: **Secrets and variables** → **Actions**
4. Click **"New repository secret"**

---

## 🔑 Required Secrets (3 Total)

### 1️⃣ AWS_SSH_PRIVATE_KEY

**What it is**: Your AWS EC2 SSH private key (the `.pem` file)

**How to get it**:

**Windows PowerShell:**
```powershell
Get-Content "C:\path\to\your\my-aws-key.pem"
```

**Mac/Linux Terminal:**
```bash
cat ~/path/to/your/my-aws-key.pem
```

**What to copy**: The ENTIRE output, including these lines:
```
-----BEGIN RSA PRIVATE KEY-----
(all the content in between)
-----END RSA PRIVATE KEY-----
```

**⚠️ CRITICAL**: Must include the `-----BEGIN` and `-----END` lines!

---

### 2️⃣ AWS_HOST

**What it is**: Your EC2's public IP address or domain name

**How to get it**:
1. Open AWS Console
2. Go to EC2 → Instances
3. Click on your instance
4. Copy the **Public IPv4 address**

**Examples**:
- IP: `52.23.45.67`
- Domain: `myapp.example.com`

**What to enter**: Just the IP or domain (no `http://` or `https://`)

---

### 3️⃣ AWS_USER

**What it is**: The SSH username for your EC2 instance

**Common values**:
- Ubuntu: `ubuntu`
- Amazon Linux: `ec2-user`
- Debian: `admin`
- RedHat: `ec2-user`

**Most common**: `ubuntu` (if you're using Ubuntu Server)

---

## 📝 Step-by-Step: Adding Each Secret

### For AWS_SSH_PRIVATE_KEY:

1. Click **"New repository secret"**
2. **Name**: Type exactly `AWS_SSH_PRIVATE_KEY`
3. **Value**: Paste your entire SSH private key
4. Click **"Add secret"**

### For AWS_HOST:

1. Click **"New repository secret"**
2. **Name**: Type exactly `AWS_HOST`
3. **Value**: Paste your EC2 IP (e.g., `52.23.45.67`)
4. Click **"Add secret"**

### For AWS_USER:

1. Click **"New repository secret"**
2. **Name**: Type exactly `AWS_USER`
3. **Value**: Type `ubuntu` (or your SSH username)
4. Click **"Add secret"**

---

## ✅ Verify Your Secrets

After adding all three, you should see:

```
✓ AWS_SSH_PRIVATE_KEY  •••••••••••  (Updated X minutes ago)
✓ AWS_HOST             •••••••••••  (Updated X minutes ago)
✓ AWS_USER             •••••••••••  (Updated X minutes ago)
```

**Note**: The actual values are hidden for security. You'll only see dots.

---

## 🧪 Test Your Setup

After adding secrets, test the deployment:

1. Make a small change to your code
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test deployment"
   git push origin main
   ```
3. Go to **Actions** tab on GitHub
4. Watch the deployment workflow run

---

## ❌ Common Mistakes

### ❌ SSH Key Without BEGIN/END Lines
**Wrong**:
```
MIIEpAIBAAKCAQEA...
(just the middle part)
```

**Correct**:
```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
...
-----END RSA PRIVATE KEY-----
```

### ❌ Adding http:// to AWS_HOST
**Wrong**: `http://52.23.45.67`  
**Correct**: `52.23.45.67`

### ❌ Wrong Username
**Wrong**: `root` or `admin` (unless that's your actual username)  
**Correct**: `ubuntu` (for Ubuntu servers)

### ❌ Typo in Secret Names
**Wrong**: `AWS_SSH_KEY` or `SSH_PRIVATE_KEY`  
**Correct**: `AWS_SSH_PRIVATE_KEY` (exact spelling matters!)

---

## 🔒 Security Notes

1. **Never commit secrets** to your repository
2. **Never share** your SSH private key
3. **Rotate keys** regularly (create new key pairs)
4. **Use different keys** for different projects
5. **Audit access** regularly in GitHub Settings

---

## 🔄 How to Update a Secret

If you need to change a secret:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click on the secret name (e.g., `AWS_SSH_PRIVATE_KEY`)
3. Click **"Update secret"**
4. Paste the new value
5. Click **"Update secret"**

---

## 🆘 Troubleshooting

### "Permission denied (publickey)"

**Cause**: SSH key is incorrect  
**Solution**:
1. Double-check you copied the ENTIRE key
2. Verify the key includes BEGIN and END lines
3. Make sure there's no extra spaces or newlines

### "Could not resolve hostname"

**Cause**: AWS_HOST is incorrect  
**Solution**:
1. Verify the IP address is correct
2. Don't include `http://` or port numbers
3. Test: `ping YOUR_EC2_IP` from your computer

### "User ubuntu not found"

**Cause**: Wrong SSH username  
**Solution**:
1. Check what username you use to SSH manually
2. Update AWS_USER secret with correct username

---

## 📱 Quick Reference Card

```
┌─────────────────────────────────────────────────┐
│  Secret Name           │  Example Value         │
├────────────────────────┼────────────────────────┤
│  AWS_SSH_PRIVATE_KEY   │  -----BEGIN RSA...     │
│                        │  (entire .pem file)    │
├────────────────────────┼────────────────────────┤
│  AWS_HOST              │  52.23.45.67           │
│                        │  or myapp.example.com  │
├────────────────────────┼────────────────────────┤
│  AWS_USER              │  ubuntu                │
└─────────────────────────────────────────────────┘
```

---

## ✅ Final Checklist

Before pushing your code:

- [ ] Added AWS_SSH_PRIVATE_KEY with entire key (including BEGIN/END)
- [ ] Added AWS_HOST with just the IP or domain (no http://)
- [ ] Added AWS_USER with correct SSH username (usually `ubuntu`)
- [ ] Verified all 3 secrets show in GitHub Settings
- [ ] Updated repository URL in `.github/workflows/deploy.yml`
- [ ] Tested SSH connection manually to EC2

---

## 🎉 You're Ready!

Once all three secrets are added correctly:

```bash
git add .
git commit -m "Add deployment workflow"
git push origin main
```

Then watch the magic happen in the **Actions** tab! 🚀

---

**Need the full guide?** See `AWS-DEPLOYMENT-GUIDE.md` for complete setup instructions.
