# 🎯 How to Run PowerShell Scripts (Simple Guide)

## ⚠️ Common Mistake

**DON'T copy the code block markers!**

When you see this in a guide:
```
```powershell
.\create-test-leads.ps1
```
```

**DON'T copy:** ` ```powershell ` and ` ``` `  
**ONLY copy:** `.\create-test-leads.ps1`

---

## ✅ Correct Way to Run Scripts

### Step 1: Open PowerShell

1. Press **Windows Key**
2. Type: `powershell`
3. Press **Enter**

### Step 2: Go to Project Folder

Copy and paste this (press Enter after):
```
cd D:\ai-intelligence-hub
```

### Step 3: Run the Script

**For creating multiple test leads:**
```
.\create-test-leads.ps1
```

**For adding one lead interactively:**
```
.\add-lead-now.ps1
```

---

## 📝 What You Should See

### When Running `.\create-test-leads.ps1`:

```
╔═══════════════════════════════════════════════════╗
║     CREATE TEST LEADS - NO CODING NEEDED!        ║
╚═══════════════════════════════════════════════════╝

This script will create realistic test leads from different platforms.

How many test leads do you want to create? (1-20)
Number: _
```

**Type a number** (like `5`) and press Enter.

Then you'll see:
```
🚀 Creating 5 test leads...

✅ Lead 1/5 | WhatsApp | High | Hi! I ordered product #12345...
✅ Lead 2/5 | Instagram DM | Medium | Saw your post about...
✅ Lead 3/5 | Email | High | Hello, I'm interested...
✅ Lead 4/5 | Facebook Messenger | Low | Just browsing...
✅ Lead 5/5 | Website Contact Form | Medium | I would like...

╔═══════════════════════════════════════════════════╗
║                   SUMMARY                          ║
╚═══════════════════════════════════════════════════╝

✅ Successfully created: 5 leads

📊 SYSTEM STATUS:
   Total Leads: 12
   New (Uncontacted): 12
   High Priority: 7
```

---

## 🎯 Quick Reference

### Navigate to Project
```
cd D:\ai-intelligence-hub
```

### Create Multiple Test Leads
```
.\create-test-leads.ps1
```

### Add One Lead Interactively
```
.\add-lead-now.ps1
```

### View All Leads
```
Invoke-RestMethod http://localhost:5000/api/v1/leads
```

### Check System Status
```
docker-compose ps
```

### Start System
```
docker-compose up -d
```

### Stop System
```
docker-compose down
```

---

## ❌ Common Errors and Fixes

### Error: "cannot be loaded because running scripts is disabled"

**Fix:**
```
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Press `Y` and Enter when asked.

### Error: "The term '.\create-test-leads.ps1' is not recognized"

**Fix:** You're not in the right folder!
```
cd D:\ai-intelligence-hub
```

Then try again.

### Error: "Cannot find path"

**Fix:** Make sure Docker is running and system is started:
```
docker-compose ps
```

If nothing is running:
```
docker-compose up -d
```

Wait 30 seconds, then try your script again.

---

## 🎓 Understanding the Commands

### `cd D:\ai-intelligence-hub`
- **cd** = "Change Directory"
- Goes to your project folder

### `.\create-test-leads.ps1`
- **.\** = "In current folder"
- **create-test-leads.ps1** = The script name
- Runs the script

### `Invoke-RestMethod`
- Talks to your backend API
- Gets data from the server

### `docker-compose up -d`
- **docker-compose** = Docker tool
- **up** = Start services
- **-d** = Run in background

---

## 🎯 Your First Time (Step by Step)

### 1. Open PowerShell
Press Windows Key → Type "powershell" → Press Enter

### 2. Go to Project
Type this and press Enter:
```
cd D:\ai-intelligence-hub
```

### 3. Make Sure System is Running
Type this and press Enter:
```
docker-compose ps
```

You should see 4 services running.

If not, type this:
```
docker-compose up -d
```

Wait 30 seconds.

### 4. Create Test Leads
Type this and press Enter:
```
.\create-test-leads.ps1
```

When asked how many, type `5` and press Enter.

### 5. View on Dashboard
Open browser → http://localhost  
Wait 10 seconds → Press Ctrl+Shift+R

You should see your 5 new leads! 🎉

---

## 💡 Pro Tips

### Tip 1: Use Tab Completion
Start typing and press **Tab**:
```
.\cre[Tab]  →  .\create-test-leads.ps1
```

### Tip 2: See Command History
Press **Up Arrow** to see previous commands

### Tip 3: Clear Screen
Type `cls` and press Enter to clear the screen

### Tip 4: Copy from PowerShell
Select text → Right-click → Automatically copies!

### Tip 5: Paste into PowerShell
Right-click → Automatically pastes!

---

## ✅ Quick Test (Do This Now!)

Copy these commands **one at a time** (press Enter after each):

```
cd D:\ai-intelligence-hub
```

```
docker-compose ps
```

```
.\create-test-leads.ps1
```

When asked for number, type: `3`

Then open browser: http://localhost

Press: Ctrl+Shift+R

See your 3 new leads! 🎉

---

## 🆘 Still Having Issues?

### Check 1: Are you in the right folder?
```
pwd
```

Should show: `D:\ai-intelligence-hub`

### Check 2: Does the script exist?
```
Test-Path .\create-test-leads.ps1
```

Should show: `True`

### Check 3: Is Docker running?
Look for whale icon in system tray (bottom right)

### Check 4: Is backend working?
```
Invoke-RestMethod http://localhost:5000/health
```

Should show: `status: healthy`

---

## 🎉 Summary

**Remember:**
1. Open PowerShell
2. `cd D:\ai-intelligence-hub`
3. `.\create-test-leads.ps1`
4. Type number
5. See leads on http://localhost

**Don't copy:** ` ```powershell ` or ` ``` `  
**Only copy:** The actual command!

---

**You got this!** 🚀
