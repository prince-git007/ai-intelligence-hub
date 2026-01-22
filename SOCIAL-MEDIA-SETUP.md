# 📱 Social Media Integration - Complete Setup Guide

## 🎯 Goal: Get ALL Your Messages in ONE Dashboard

---

## 📊 Current Situation

**Your System Status:**
- ✅ Backend API: Running at http://localhost:5000
- ✅ Database: 7 leads stored
- ✅ AI: Groq working perfectly
- ✅ n8n: Ready at http://localhost:5678

**What's Next:** Connect your social media accounts!

---

## 🚀 Quick Start: Create Your First Automated Lead (5 Minutes)

### Step 1: Open n8n

```
URL: http://localhost:5678
Username: admin
Password: admin123
```

### Step 2: Import Ready-Made Workflow

1. Click the **menu icon** (≡) top left
2. Click **"Import from File"**
3. Select `n8n-workflow-examples.json` from your project folder
4. Click **"Import"**

### Step 3: Test the Workflow

1. Click the **"Execute Workflow"** button
2. Watch it create a lead automatically!
3. Check your leads:

```powershell
Invoke-RestMethod http://localhost:5000/api/v1/leads
```

You'll see a new lead! 🎉

---

## 📱 Integration Options (From Easiest to Advanced)

### ⭐ Level 1: Email (EASIEST - Start Here!)

**Time:** 10 minutes  
**Cost:** FREE  
**Difficulty:** ⭐☆☆☆☆

#### Gmail Integration

**Step 1: Get Gmail Credentials**

1. Go to https://console.cloud.google.com
2. Create new project: "AI Lead Hub"
3. Enable **Gmail API**
4. Create credentials → OAuth 2.0 Client
5. Download credentials JSON

**Step 2: Setup in n8n**

1. Open http://localhost:5678
2. Click **"Credentials"** (left sidebar)
3. Click **"+ Add Credential"**
4. Search **"Gmail OAuth2"**
5. Upload your credentials JSON
6. Authorize with your Gmail account

**Step 3: Create Workflow**

```
[Gmail Trigger] → New Email
      ↓
[Function] → Extract subject + body
      ↓
[HTTP Request] → Send to AI Hub
      ↓
Done! ✅
```

**Function Node Code:**

```javascript
// Extract email data
const subject = $input.item.json.subject || 'No Subject';
const body = $input.item.json.textPlain || $input.item.json.snippet || '';
const from = $input.item.json.from || 'Unknown Sender';

// Determine priority based on keywords
let priority = 'Medium';
const urgentKeywords = ['urgent', 'asap', 'emergency', 'immediately'];
const lowPriorityKeywords = ['newsletter', 'unsubscribe', 'notification'];

const combinedText = (subject + ' ' + body).toLowerCase();

if (urgentKeywords.some(keyword => combinedText.includes(keyword))) {
  priority = 'High';
} else if (lowPriorityKeywords.some(keyword => combinedText.includes(keyword))) {
  priority = 'Low';
}

// Return formatted lead
return {
  json: {
    source: `Email - ${from}`,
    originalContent: `Subject: ${subject}\n\nFrom: ${from}\n\n${body}`,
    priority: priority
  }
};
```

**HTTP Request Node:**
- Method: POST
- URL: `http://server:5000/api/v1/leads`
- Send Body: Yes
- Body: `{{ $json }}`
- Header: Content-Type = application/json

**Step 4: Activate**

1. Click **"Active"** toggle
2. Send yourself a test email
3. Wait 30 seconds
4. Check leads: Your email appears as a lead! 📧

---

### ⭐⭐ Level 2: Telegram (EASY)

**Time:** 15 minutes  
**Cost:** FREE  
**Difficulty:** ⭐⭐☆☆☆

#### Why Telegram?
- FREE and unlimited
- No API fees
- Easy to set up
- Great for customer support

#### Setup Steps:

**Step 1: Create Telegram Bot**

1. Open Telegram
2. Search for **@BotFather**
3. Send: `/newbot`
4. Follow instructions
5. Copy your **Bot Token** (looks like: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

**Step 2: Setup in n8n**

1. Add **Telegram Trigger** node
2. Paste your Bot Token
3. Event: **message**

**Step 3: Add Function Node**

```javascript
const message = $input.item.json.message.text;
const username = $input.item.json.message.from.username || 'Unknown';
const firstName = $input.item.json.message.from.first_name || '';

return {
  json: {
    source: `Telegram - @${username}`,
    originalContent: `From: ${firstName} (@${username})\n\n${message}`,
    priority: "Medium"
  }
};
```

**Step 4: Add HTTP Request (same as above)**

**Step 5: Test**

1. Activate workflow
2. Send message to your bot
3. Boom! Appears as lead! 🤖

---

### ⭐⭐⭐ Level 3: WhatsApp Business (MODERATE)

**Time:** 1-2 hours  
**Cost:** ~$0.005 per message (very cheap)  
**Difficulty:** ⭐⭐⭐☆☆

#### Option A: Twilio (Recommended for Beginners)

**Step 1: Sign Up**

1. Go to https://www.twilio.com/whatsapp
2. Create account (Free trial: $15 credit)
3. Verify phone number

**Step 2: Set Up WhatsApp Sandbox**

1. Go to Console → Messaging → Try WhatsApp
2. Join sandbox by sending: `join <your-code>` to the number shown
3. Now you can receive/send test messages!

**Step 3: Get n8n Webhook URL**

1. In n8n, create new workflow
2. Add **Webhook** node
3. Path: `whatsapp-twilio`
4. Copy the webhook URL (like: `http://localhost:5678/webhook/whatsapp-twilio`)

**Step 4: Configure Twilio Webhook**

1. In Twilio Console → Messaging → Settings
2. Webhook URL for incoming messages: `http://YOUR-PUBLIC-IP:5678/webhook/whatsapp-twilio`
   - **Note:** You'll need to expose your server to the internet (see below)
3. Save

**Step 5: n8n Workflow**

```
[Webhook] → Receive WhatsApp message
      ↓
[Function] → Format data
      ↓
[HTTP Request] → Send to AI Hub
```

**Function Code:**

```javascript
const message = $input.item.json.Body;
const from = $input.item.json.From; // Format: whatsapp:+1234567890
const name = $input.item.json.ProfileName || 'Unknown';

// Extract phone number
const phone = from.replace('whatsapp:', '');

return {
  json: {
    source: `WhatsApp - ${name} (${phone})`,
    originalContent: message,
    priority: "High"  // WhatsApp messages usually urgent
  }
};
```

#### Option B: 360Dialog (Production-Ready)

- More reliable for production
- Better pricing for volume
- Official WhatsApp Business API partner
- Setup: https://www.360dialog.com

#### Option C: Meta (Facebook) WhatsApp Business API

- Direct from Meta/Facebook
- Most official but most complex
- Best for large enterprises
- Setup: https://business.whatsapp.com

---

### ⭐⭐⭐⭐ Level 4: Instagram & Facebook (ADVANCED)

**Time:** 2-3 hours  
**Cost:** FREE  
**Difficulty:** ⭐⭐⭐⭐☆

#### Requirements:
- Facebook Page (must be admin)
- Instagram Business account connected to Facebook Page
- Facebook Developer account

#### Setup Steps:

**Step 1: Create Facebook App**

1. Go to https://developers.facebook.com
2. Click **"Create App"**
3. Type: **Business**
4. App name: "AI Lead Hub"
5. Contact email: Your email

**Step 2: Add Products**

1. In app dashboard, click **"Add Product"**
2. Add **Messenger**
3. Add **Instagram** (if you have business account)

**Step 3: Configure Messenger**

1. Go to Messenger → Settings
2. Generate Page Access Token
3. Select your Facebook Page
4. Copy token (save it securely!)

**Step 4: Set Up Webhook in n8n**

1. Create webhook node in n8n
2. Path: `facebook-messenger`
3. Copy webhook URL

**Step 5: Configure Facebook Webhook**

1. In Facebook App → Messenger → Settings
2. Callback URL: `http://YOUR-PUBLIC-IP:5678/webhook/facebook-messenger`
3. Verify Token: Create a random string (e.g., "MySecureToken123")
4. Subscribe to: **messages**, **messaging_postbacks**

**Step 6: n8n Workflow**

```
[Webhook] → Verify & Receive
      ↓
[Function] → Parse Facebook data
      ↓
[HTTP Request] → Send to AI Hub
```

**Function Code:**

```javascript
// Handle webhook verification (first time)
if ($input.item.json['hub.mode'] === 'subscribe') {
  if ($input.item.json['hub.verify_token'] === 'MySecureToken123') {
    return {
      json: {
        challenge: $input.item.json['hub.challenge']
      }
    };
  }
}

// Handle incoming message
const entry = $input.item.json.entry[0];
const messaging = entry.messaging[0];
const message = messaging.message.text;
const senderId = messaging.sender.id;

return {
  json: {
    source: `Facebook Messenger - ${senderId}`,
    originalContent: message,
    priority: "Medium"
  }
};
```

#### Instagram Setup (Same Process)

- Use Instagram Graph API
- Almost identical to Facebook Messenger
- Subscribe to Instagram messages webhook
- Use same n8n workflow structure

---

## 🌐 Exposing Your Server to Internet (For Webhooks)

Most social media platforms need to reach your server. Here are options:

### Option 1: ngrok (Easiest for Testing)

```powershell
# Install ngrok
# Download from: https://ngrok.com/download

# Expose port 5678 (n8n)
ngrok http 5678

# You'll get URL like: https://abc123.ngrok.io
# Use this as your webhook URL!
```

### Option 2: Cloudflare Tunnel (FREE, Permanent)

```powershell
# Install Cloudflare Tunnel
# Follow: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/

cloudflared tunnel create ai-hub
cloudflared tunnel route dns ai-hub yourdomain.com
```

### Option 3: Deploy to Cloud (Production)

- AWS EC2
- DigitalOcean Droplet
- Google Cloud Compute
- Azure VM

See `PRODUCTION-SETUP.md` for details.

---

## 🎯 Recommended Setup Order

### Week 1: Learn & Test
1. ✅ Email integration (Gmail)
2. ✅ Telegram bot
3. ✅ Create 10+ test leads manually

### Week 2: Social Media
1. ✅ WhatsApp (Twilio sandbox)
2. ✅ Expose server with ngrok
3. ✅ Test real messages

### Week 3: Production
1. ✅ Facebook Messenger
2. ✅ Instagram DMs
3. ✅ Deploy to cloud server

### Week 4: Optimize
1. ✅ Fine-tune AI summaries
2. ✅ Add custom priority rules
3. ✅ Train team on dashboard

---

## 📊 Complete Real-World Example

### Scenario: Small E-commerce Business

**Sources:**
- 📧 **Email**: General inquiries (20/day)
- 📱 **WhatsApp**: Customer support (50/day)
- 📸 **Instagram**: Product questions (30/day)
- 📘 **Facebook**: Reviews & questions (15/day)
- 🌐 **Website Form**: Contact requests (10/day)

**Total:** 125 messages/day across 5 platforms

**Before AI Hub:**
- ⏰ Time spent checking: 3 hours/day
- ❌ Missed messages: 10-15/day
- 😫 Stress level: HIGH

**After AI Hub:**
- ⏰ Time spent: 30 minutes/day
- ✅ Missed messages: 0
- 😊 Stress level: LOW
- 🤖 AI tells you what's urgent!

---

## 🧪 Test Your Setup

### Test 1: Email
```powershell
# Send yourself an email
# Wait 30 seconds
# Check leads
Invoke-RestMethod http://localhost:5000/api/v1/leads | 
  Where-Object { $_.data.source -like "*Email*" }
```

### Test 2: Telegram
```
1. Send message to your bot
2. Check leads
```

### Test 3: WhatsApp (if configured)
```
1. Send WhatsApp to your Twilio number
2. Check leads
```

---

## 🆘 Troubleshooting

### Webhook Not Receiving Messages

**Check:**
1. Is n8n workflow **Active**? (toggle must be ON)
2. Is your webhook URL publicly accessible?
3. Test with: `curl http://your-webhook-url`
4. Check n8n execution logs

### Messages Not Appearing in Dashboard

**Check:**
1. n8n workflow execution logs
2. Backend logs: `docker-compose logs server`
3. Test API directly:
```powershell
Invoke-RestMethod http://localhost:5000/api/v1/leads
```

### AI Summary Not Generated

**Check:**
1. Groq API key in `.env`
2. Backend logs for errors
3. Test manually:
```powershell
$test = '{"source":"Test","originalContent":"Hello world","priority":"Medium"}'
Invoke-RestMethod -Uri http://localhost:5000/api/v1/leads -Method Post -Body $test -ContentType "application/json"
```

---

## 📚 Resources

### Documentation:
- n8n: https://docs.n8n.io
- Twilio WhatsApp: https://www.twilio.com/docs/whatsapp
- Facebook Messenger: https://developers.facebook.com/docs/messenger-platform
- Instagram API: https://developers.facebook.com/docs/instagram-api
- Telegram Bot: https://core.telegram.org/bots
- Gmail API: https://developers.google.com/gmail/api

### Video Tutorials:
- n8n WhatsApp: https://www.youtube.com/watch?v=xyz
- Facebook Messenger Bot: https://www.youtube.com/results?search_query=facebook+messenger+bot+tutorial

---

## 🎉 Success!

Once configured, your workflow looks like:

```
Customer sends message on ANY platform
    ↓
n8n catches it (within seconds)
    ↓
AI summarizes it intelligently
    ↓
Appears on your dashboard with priority
    ↓
You respond from appropriate platform
    ↓
Mark as "Contacted"
    ↓
Done! Never miss a customer again! ✅
```

---

**Start with:** Email integration (easiest!)  
**Then add:** Telegram (also easy!)  
**Finally:** WhatsApp, Facebook, Instagram

**Questions?** Check other guides or test with manual leads first!
