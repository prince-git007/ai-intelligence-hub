# 🎯 Complete Guide: How to Add Leads

## 📍 3 Ways to Add Leads to Your System

---

## ✅ Method 1: Manual via PowerShell (Easiest for Testing)

### Step 1: Open PowerShell

Press `Windows + X` → Select "PowerShell" or "Terminal"

### Step 2: Copy & Paste This Command

```powershell
# Simple lead example
$lead = @{
    source = "WhatsApp"
    originalContent = "Hi! I'm interested in your product. Can you send me pricing details? We need it urgently for a project starting next week."
    priority = "High"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/v1/leads" -Method Post -Body $lead -ContentType "application/json"
```

### Step 3: What Happens

1. ⏱️ API receives your lead
2. 🤖 Groq AI analyzes it (2-3 seconds)
3. ✨ AI generates intelligent summary
4. 💾 Saves to MongoDB database
5. 📊 Appears on dashboard within 5 seconds

### Expected Response:

```json
{
  "success": true,
  "data": {
    "_id": "696894...",
    "source": "WhatsApp",
    "originalContent": "Hi! I'm interested in...",
    "aiSummary": "Prospect expressing interest in product pricing. Indicates urgency with project deadline next week. High priority - potential sale opportunity.",
    "priority": "High",
    "status": "New",
    "createdAt": "2026-01-15T08:30:00.000Z"
  }
}
```

### More Examples:

#### Email Lead
```powershell
$lead = @{
    source = "Email"
    originalContent = "Hello, I found your website through Google. I run a marketing agency and we're looking for a lead management solution. Currently using spreadsheets which is becoming unmanageable. Would appreciate if you could send me more information."
    priority = "Medium"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/v1/leads" -Method Post -Body $lead -ContentType "application/json"
```

#### Instagram DM Lead
```powershell
$lead = @{
    source = "Instagram DM"
    originalContent = "Saw your post about AI automation! This is exactly what we need. We get 50+ customer inquiries daily on different platforms and it's chaos. Can we talk?"
    priority = "High"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/v1/leads" -Method Post -Body $lead -ContentType "application/json"
```

#### Facebook Message Lead
```powershell
$lead = @{
    source = "Facebook Messenger"
    originalContent = "Hi there! Just browsing your Facebook page. Looks interesting. Will check back later."
    priority = "Low"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/v1/leads" -Method Post -Body $lead -ContentType "application/json"
```

---

## 🔗 Method 2: Using n8n (For Automation)

### What is n8n?

n8n is your **automation tool** that connects everything. Think of it as a smart mail carrier that:
- Checks WhatsApp, Facebook, Instagram, Email
- Picks up new messages
- Formats them
- Delivers to your AI Hub

### Step-by-Step Setup:

#### Step 1: Open n8n

```
URL: http://localhost:5678
Username: admin
Password: admin123
```

#### Step 2: Create Your First Workflow

1. **Click "+ Add workflow"** (top right)
2. **Click the "+" button** to add your first node

#### Step 3: Add Manual Trigger (For Testing)

1. Search for **"Manual Trigger"**
2. Click it to add
3. This lets you test manually before connecting real sources

#### Step 4: Add HTTP Request Node

1. Click **"+"** after the Manual Trigger
2. Search for **"HTTP Request"**
3. Select it
4. Configure:
   - **Method**: POST
   - **URL**: `http://server:5000/api/v1/leads`
   - **Send Body**: Yes
   - **Body Content Type**: JSON
   - **Specify Body**: Using Fields
   - Click **"Add Field"** 3 times and add:
     - `source` = `WhatsApp` (or whatever source)
     - `originalContent` = `{{ $json.message }}`
     - `priority` = `High`

#### Step 5: Add Headers

In HTTP Request node:
1. Scroll to **"Headers"**
2. Click **"Add Header"**
3. Name: `Content-Type`
4. Value: `application/json`

#### Step 6: Test It

1. Click **"Test workflow"** button at bottom
2. Click **"Execute node"** on Manual Trigger
3. You should see success! ✅

#### Step 7: View Complete Workflow Example

I've created a complete example for you. Let me show you:

### 📱 WhatsApp Integration (Real-World Example)

```
[WhatsApp Webhook] 
        ↓
[Format Data - Extract message, sender, timestamp]
        ↓
[HTTP Request - Send to AI Hub]
        ↓
[Done! Lead appears on dashboard]
```

#### Detailed n8n Configuration:

**Node 1: Webhook**
- Path: `whatsapp-incoming`
- Method: POST
- Response Mode: Last Node

**Node 2: Function (Format Data)**
```javascript
// Extract data from WhatsApp webhook
const message = $input.item.json.message || $input.item.json.body;
const sender = $input.item.json.from || "Unknown";
const timestamp = $input.item.json.timestamp || new Date().toISOString();

return {
  json: {
    source: "WhatsApp - " + sender,
    originalContent: message,
    priority: "High"  // You can add logic here to determine priority
  }
};
```

**Node 3: HTTP Request**
- Method: POST
- URL: `http://server:5000/api/v1/leads`
- Body: `{{ $json }}`
- Headers:
  - Content-Type: application/json

#### Activate Workflow:

1. Click **"Active"** toggle (top right)
2. Now it's live! 🟢
3. Copy your webhook URL: `http://localhost:5678/webhook/whatsapp-incoming`

#### Connect WhatsApp Business API:

To actually connect WhatsApp:
1. Sign up for **WhatsApp Business API** (through Meta/Facebook)
   - Or use services like **Twilio**, **MessageBird**, **360Dialog**
2. In their dashboard, set webhook URL to: `http://YOUR-SERVER-IP:5678/webhook/whatsapp-incoming`
3. Now every WhatsApp message → Automatically becomes a lead in your dashboard!

---

## 🌐 Method 3: Website Integration (Webhook/Form)

### If You Have a Website Contact Form:

#### Option A: Direct API Call (Add to Your Website)

Add this to your website form submission:

```javascript
// When form is submitted
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        source: "Website Contact Form",
        originalContent: `Name: ${document.getElementById('name').value}\nEmail: ${document.getElementById('email').value}\nMessage: ${document.getElementById('message').value}`,
        priority: "Medium"
    };
    
    try {
        const response = await fetch('http://your-server.com:5000/api/v1/leads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            alert('Thank you! We will contact you soon.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
```

#### Option B: Through n8n Webhook

1. Create n8n workflow with Webhook trigger
2. Add your form handling logic
3. Send to AI Hub
4. More flexible and secure

---

## 📱 Social Media Integration Details

### 1. WhatsApp Business Integration

#### What You Need:
- WhatsApp Business account
- WhatsApp Business API access (paid, starts ~$0.005 per message)
- OR WhatsApp Business Platform (free tier available)

#### Providers:
1. **Twilio** (https://www.twilio.com/whatsapp)
   - Easy setup
   - Pay per message
   
2. **360Dialog** (https://www.360dialog.com)
   - Specializes in WhatsApp
   - Good for small businesses
   
3. **MessageBird** (https://www.messagebird.com)
   - Multiple channels
   - Good pricing

#### Setup Steps:
1. Sign up with provider
2. Get webhook URL from n8n
3. Configure webhook in provider dashboard
4. Test: Send WhatsApp message → See it in your dashboard!

### 2. Facebook Messenger Integration

#### What You Need:
- Facebook Page
- Facebook Developer Account (free)
- Messenger API access

#### Setup Steps:
1. Go to https://developers.facebook.com
2. Create App → Select "Business"
3. Add **Messenger** product
4. Set webhook URL to n8n webhook
5. Subscribe to page events

#### n8n Setup:
- Use **Facebook Messenger Trigger** node
- Or **Webhook** node for custom setup
- Format data and send to AI Hub

### 3. Instagram Direct Messages

#### What You Need:
- Instagram Business account
- Facebook Page connected to Instagram
- Facebook Developer access

#### Setup Steps:
1. Same as Facebook (Instagram uses Facebook Graph API)
2. Add **Instagram** product in Facebook App
3. Subscribe to messages
4. Use n8n to catch and forward to AI Hub

### 4. Email Integration (Gmail)

#### What You Need:
- Gmail account
- Gmail API credentials

#### n8n Setup:
1. Add **Gmail Trigger** node
2. Configure:
   - Event: New Email
   - Label: INBOX (or specific label)
3. Add **Function** node to extract subject + body
4. Send to AI Hub

#### Example Function:
```javascript
const subject = $input.item.json.subject;
const body = $input.item.json.textPlain || $input.item.json.snippet;
const sender = $input.item.json.from;

return {
  json: {
    source: "Email - " + sender,
    originalContent: `Subject: ${subject}\n\n${body}`,
    priority: subject.toLowerCase().includes('urgent') ? 'High' : 'Medium'
  }
};
```

### 5. LinkedIn Messages

#### What You Need:
- LinkedIn account
- LinkedIn API access (requires application approval)

#### Alternative (Easier):
- Use **Zapier** or **Make** to connect LinkedIn → n8n
- Or manually forward important LinkedIn messages

### 6. Telegram Integration

#### What You Need:
- Telegram Bot Token (free, get from @BotFather)

#### n8n Setup:
1. Create bot with @BotFather on Telegram
2. Get token
3. Add **Telegram Trigger** node in n8n
4. Connect to AI Hub

Very easy! Takes 5 minutes.

---

## 🎯 Complete Real-World Example

### Scenario: Small E-commerce Store

**You want to receive leads from:**
- ✅ WhatsApp (customer questions)
- ✅ Instagram DM (product inquiries)
- ✅ Facebook Messenger (support requests)
- ✅ Email (general inquiries)
- ✅ Website contact form

### Setup Plan:

#### Week 1: Manual Testing
```powershell
# Add test leads manually
$lead = @{
    source = "WhatsApp"
    originalContent = "Hi! Do you ship to Canada?"
    priority = "Medium"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/v1/leads" -Method Post -Body $lead -ContentType "application/json"
```

#### Week 2: Website Form Integration
- Add API call to website form
- Test: Submit form → See lead on dashboard

#### Week 3: Email Integration
- Set up Gmail trigger in n8n
- Test: Send email to yourself → See lead on dashboard

#### Week 4: Social Media
- Connect WhatsApp Business API
- Connect Instagram (via Facebook)
- Connect Facebook Messenger

#### Result:
**ALL customer messages in ONE dashboard with AI summaries!**

---

## 🔍 How to Verify Leads Are Coming In

### Check Dashboard:
```
http://localhost
```
- Should see lead cards appearing
- Check "Total Leads" counter increasing

### Check via API:
```powershell
# Get all leads
Invoke-RestMethod http://localhost:5000/api/v1/leads

# Count leads
$leads = Invoke-RestMethod http://localhost:5000/api/v1/leads
Write-Host "Total leads: $($leads.pagination.total)"
```

### Check Database:
```powershell
# Connect to MongoDB
docker-compose exec mongodb mongosh ai-intelligence-hub

# In MongoDB shell:
db.leads.countDocuments()
db.leads.find().sort({createdAt: -1}).limit(5).pretty()
```

---

## 🎓 Summary

### You Can Add Leads Through:

1. **Manual (PowerShell)** ← Start here!
   - Best for testing
   - Instant results
   - Learn how it works

2. **n8n Automation** ← Most powerful!
   - Connect ANY source
   - Automatic processing
   - Production-ready

3. **Website Form** ← For your website
   - Direct integration
   - Customer-facing
   - Professional

### Social Media → Your Dashboard:

```
WhatsApp Message (Customer: "Help!") 
    ↓
n8n catches it
    ↓
Formats to: {source: "WhatsApp", originalContent: "Help!", priority: "High"}
    ↓
Sends to http://server:5000/api/v1/leads
    ↓
Backend processes with AI
    ↓
Saves to MongoDB
    ↓
Appears on your dashboard within 5 seconds!
    ↓
You see it and respond immediately! ✅
```

---

## 🚀 Next Steps

1. **Right Now**: Create 3 test leads using PowerShell
2. **Today**: Set up your first n8n workflow
3. **This Week**: Connect one real source (Email is easiest)
4. **Next Week**: Add social media integrations

**Start with this command:**

```powershell
# Create your first lead RIGHT NOW!
$lead = @{
    source = "My First Manual Lead"
    originalContent = "This is a test! I'm learning how to add leads to my AI Intelligence Hub. This system is going to save me so much time!"
    priority = "High"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/v1/leads" -Method Post -Body $lead -ContentType "application/json"
```

**Then check:** http://localhost:5000/api/v1/leads

You should see your lead with an AI-generated summary! 🎉

---

**Questions?** Check `COMPLETE-BEGINNER-GUIDE.md` or `HOW-TO-USE.md`
