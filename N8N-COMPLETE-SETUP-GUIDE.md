# 🔗 n8n Complete Setup Guide - Connect Your Social Media!

**Goal:** Make WhatsApp, Instagram, and Email messages automatically appear in your dashboard!

---

## 🎯 What is n8n? (Simple Explanation)

**n8n** is like a **robot assistant** that:
- Watches your social media accounts 24/7
- When a new message arrives → Catches it immediately
- Formats it nicely
- Sends it to your AI Hub
- AI summarizes it
- Appears on your dashboard!

**Think of it as:** A mail carrier who picks up letters from different mailboxes and delivers them all to your one inbox.

---

## 🚀 Step 1: Access n8n

### Open n8n in Your Browser

**URL:** http://localhost:5678

**Login:**
- Username: `admin`
- Password: `admin123`

You should see the n8n interface with:
- Left sidebar: Workflows, Credentials, etc.
- Center: "Create workflow" button
- Top: Your profile

---

## 📊 Step 2: Understanding n8n Workflows

### What is a Workflow?

A workflow is like a **recipe** with steps:

```
STEP 1: TRIGGER (Listen for new message)
   ↓
STEP 2: FORMAT (Clean up the data)
   ↓
STEP 3: SEND (Send to your AI Hub)
   ↓
DONE! Message appears on dashboard!
```

### Example Workflow:

```
[WhatsApp Trigger] → [Format Data] → [Send to API] → [Done!]
```

---

## 🎨 Step 3: Your First Workflow (Test Mode)

Let's create a simple test workflow to understand how it works.

### 3.1: Create New Workflow

1. **Click** "Add workflow" (or "+" button)
2. **Name it:** "Test Webhook to AI Hub"
3. **Click** "Add first step"

### 3.2: Add Webhook Node (Trigger)

1. Search: **"Webhook"**
2. Click **"Webhook"**
3. Configure:
   - **HTTP Method:** POST
   - **Path:** `test-lead`
   - **Response Mode:** Last Node

4. **Copy the Test URL** - looks like:
   ```
   http://localhost:5678/webhook-test/test-lead
   ```

   **Copy the Production URL** - looks like:
   ```
   http://localhost:5678/webhook/test-lead
   ```

### 3.3: Add Function Node (Format Data)

1. Click **"+"** after Webhook
2. Search: **"Code"**
3. Select **"Code"** node
4. Paste this code:

```javascript
// Extract data from webhook
const message = $input.item.json.message || $input.item.json.body || "No message";
const source = $input.item.json.source || "Unknown Source";
const priority = $input.item.json.priority || "Medium";

// Return formatted data for AI Hub
return {
  source: source,
  originalContent: message,
  priority: priority
};
```

### 3.4: Add HTTP Request Node (Send to API)

1. Click **"+"** after Code node
2. Search: **"HTTP Request"**
3. Configure:
   - **Method:** POST
   - **URL:** `http://server:5000/api/v1/leads`
   - **Send Body:** Yes
   - **Body Content Type:** JSON
   - **Specify Body:** Using JSON
   - **JSON:** `{{ $json }}`

4. **Add Headers:**
   - Click "Add Option" → "Headers"
   - Click "Add Header":
     - **Name:** `Content-Type`
     - **Value:** `application/json`

### 3.5: Test Your Workflow

1. **Click** "Execute Workflow" (top right)
2. **Copy the Test URL** from Webhook node
3. **Open PowerShell** and run:

```powershell
$testData = @{
    source = "n8n Test"
    message = "This is a test message from n8n workflow!"
    priority = "High"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5678/webhook-test/test-lead" -Method Post -Body $testData -ContentType "application/json"
```

4. **Check n8n** - You should see:
   - ✅ Webhook node: Green (received data)
   - ✅ Code node: Green (formatted data)
   - ✅ HTTP Request node: Green (sent to API)

5. **Check Dashboard** - Refresh and see your new lead!

### 3.6: Activate Workflow

1. **Click** "Active" toggle (top right)
2. Now it's **LIVE**! 🟢
3. The Production URL will work 24/7

---

## 📱 Step 4: Connect WhatsApp

### What You Need:

- **WhatsApp Business Account** (free)
- **WhatsApp Business API access** (via Twilio, 360Dialog, or Meta)
- **Cost:** ~$0.005 per message (very cheap!)

### Option A: Twilio (Easiest for Beginners)

#### 4.1: Sign Up for Twilio

1. Go to: https://www.twilio.com/try-twilio
2. Sign up (free trial gives you $15 credit!)
3. Verify your phone number
4. Go to Console

#### 4.2: Set Up WhatsApp Sandbox

1. In Twilio Console → **Messaging** → **Try it out** → **Send a WhatsApp message**
2. You'll see a number like: `+1 415 523 8886`
3. You'll see a code like: `join abc-def`
4. On your phone:
   - Open WhatsApp
   - Send to `+1 415 523 8886`
   - Message: `join abc-def`
5. You'll get confirmation!

#### 4.3: Create n8n Workflow for WhatsApp

1. **Create new workflow:** "WhatsApp to AI Hub"
2. **Add Webhook node:**
   - Path: `whatsapp-incoming`
   - Copy Production URL
3. **Add Code node:**

```javascript
// Extract WhatsApp message data
const message = $input.item.json.Body || $input.item.json.body;
const from = $input.item.json.From || "Unknown";
const name = $input.item.json.ProfileName || "Customer";

// Clean up phone number (remove "whatsapp:" prefix)
const phone = from.replace('whatsapp:', '');

return {
  source: `WhatsApp - ${name} (${phone})`,
  originalContent: message,
  priority: "High"  // WhatsApp messages are usually urgent
};
```

4. **Add HTTP Request node:**
   - Same as before (POST to `http://server:5000/api/v1/leads`)

5. **Activate workflow**

#### 4.4: Configure Twilio Webhook

**Problem:** Twilio needs to reach your n8n, but it's on your local computer!

**Solution:** Expose your server to the internet temporarily.

**Option 1: Using ngrok (Easiest)**

1. **Download ngrok:** https://ngrok.com/download
2. **Install it**
3. **Run in PowerShell:**

```powershell
ngrok http 5678
```

4. You'll see output like:
```
Forwarding https://abc123.ngrok.io -> http://localhost:5678
```

5. **Copy that URL:** `https://abc123.ngrok.io`

6. **In Twilio Console:**
   - Go to: Messaging → Settings → WhatsApp Sandbox Settings
   - **When a message comes in:** 
     - Paste: `https://abc123.ngrok.io/webhook/whatsapp-incoming`
   - **Save**

#### 4.5: Test It!

1. **Send WhatsApp message** to the Twilio number
2. **Message:** "Hello! This is a test from WhatsApp!"
3. **Wait 5 seconds**
4. **Check Dashboard** → **Refresh** → **See your WhatsApp message!** 🎉

---

## 📧 Step 5: Connect Email (Gmail)

### 5.1: Create Gmail Credentials

1. **Go to:** https://console.cloud.google.com
2. **Create New Project:**
   - Name: "AI Lead Hub"
3. **Enable Gmail API:**
   - APIs & Services → Enable APIs → Search "Gmail API" → Enable
4. **Create Credentials:**
   - APIs & Services → Credentials → Create Credentials
   - OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:5678/rest/oauth2-credential/callback`
5. **Download JSON** file

### 5.2: Add Credentials to n8n

1. **In n8n** → Click profile (bottom left) → **Credentials**
2. **Click** "Add Credential"
3. **Search:** "Gmail OAuth2"
4. **Configure:**
   - Upload your credentials JSON
   - Or paste Client ID and Client Secret
5. **Connect** → Authorize with your Gmail account

### 5.3: Create Gmail Workflow

1. **New workflow:** "Gmail to AI Hub"
2. **Add Gmail Trigger node:**
   - Search: "Gmail Trigger"
   - Event: "Message Received"
   - Select your credential
3. **Add Code node:**

```javascript
// Extract email data
const subject = $input.item.json.subject || 'No Subject';
const body = $input.item.json.textPlain || $input.item.json.snippet || '';
const from = $input.item.json.from || 'Unknown Sender';

// Determine priority based on keywords
let priority = 'Medium';
const urgentKeywords = ['urgent', 'asap', 'emergency', 'immediately'];
const lowKeywords = ['newsletter', 'unsubscribe', 'notification'];

const combined = (subject + ' ' + body).toLowerCase();

if (urgentKeywords.some(k => combined.includes(k))) {
  priority = 'High';
} else if (lowKeywords.some(k => combined.includes(k))) {
  priority = 'Low';
}

return {
  source: `Email - ${from}`,
  originalContent: `Subject: ${subject}\n\nFrom: ${from}\n\n${body}`,
  priority: priority
};
```

4. **Add HTTP Request node** (same as before)
5. **Activate workflow**

### 5.4: Test It!

1. **Send yourself an email** with subject: "URGENT: Test email for AI Hub"
2. **Wait 1 minute** (Gmail checks every minute)
3. **Check Dashboard** → **See your email as a lead!** 📧

---

## 📸 Step 6: Connect Instagram

### What You Need:

- **Instagram Business Account**
- **Facebook Page** connected to Instagram
- **Facebook Developer Account**

### 6.1: Create Facebook App

1. **Go to:** https://developers.facebook.com
2. **Create App:**
   - Type: Business
   - Name: "AI Lead Hub Instagram"
3. **Add Instagram Product:**
   - In dashboard → Add Product → Instagram
4. **Add Messenger Product:**
   - Also add Messenger (same process)

### 6.2: Configure Instagram Webhooks

1. **In Facebook App** → Instagram → Settings
2. **Generate Access Token:**
   - Select your Instagram Business Account
   - Copy the token
3. **Add Webhook:**
   - Callback URL: Your ngrok URL + `/webhook/instagram-dm`
   - Example: `https://abc123.ngrok.io/webhook/instagram-dm`
   - Verify Token: Create a random string (e.g., "MySecureToken123")
4. **Subscribe to:** messages, messaging_postbacks

### 6.3: Create Instagram Workflow

1. **New workflow:** "Instagram to AI Hub"
2. **Add Webhook node:**
   - Path: `instagram-dm`
3. **Add Code node:**

```javascript
// Handle webhook verification (first time setup)
if ($input.item.json['hub.mode'] === 'subscribe') {
  if ($input.item.json['hub.verify_token'] === 'MySecureToken123') {
    return {
      challenge: $input.item.json['hub.challenge']
    };
  }
}

// Handle incoming Instagram message
const entry = $input.item.json.entry[0];
const messaging = entry.messaging[0];
const message = messaging.message.text;
const senderId = messaging.sender.id;

return {
  source: `Instagram DM - User ${senderId}`,
  originalContent: message,
  priority: "Medium"
};
```

4. **Add HTTP Request node** (same as before)
5. **Activate workflow**

---

## 🎯 Step 7: Production Setup

### Test Mode vs Production Mode

**Test Mode:**
- URLs look like: `http://localhost:5678/webhook-test/...`
- Only works when you click "Execute Workflow"
- For testing only

**Production Mode:**
- URLs look like: `http://localhost:5678/webhook/...`
- Works 24/7 automatically
- Requires workflow to be "Active" (toggle ON)

### To Go Production:

1. **Activate all workflows** (toggle ON)
2. **Use production webhook URLs** in all external services
3. **Keep n8n running** (via Docker - it's already set up!)
4. **Keep ngrok running** (if using external services)

### For Permanent Production:

Deploy to a cloud server:
- AWS, DigitalOcean, Google Cloud
- Get a real domain name
- Use that domain instead of ngrok
- See: `PRODUCTION-SETUP.md`

---

## 📊 Your Complete Setup Overview

### What You'll Have:

```
WhatsApp Business API (Twilio)
    ↓ (webhook)
n8n Workflow: "WhatsApp to AI Hub"
    ↓ (formats data)
Your AI Hub API (localhost:5000)
    ↓ (AI summarizes)
MongoDB Database
    ↓ (stores)
Dashboard (localhost)
    ↓ (displays)
YOU! (sees all messages in one place!)

Same for Instagram, Email, Facebook, etc.!
```

---

## 🧪 Testing Checklist

### After Setting Up Each Platform:

1. ✅ n8n workflow is "Active" (green toggle)
2. ✅ Send test message on that platform
3. ✅ Check n8n workflow execution (should see green checkmarks)
4. ✅ Check Dashboard (refresh to see new lead)
5. ✅ Lead has AI summary
6. ✅ Lead shows correct source

### If Something Doesn't Work:

1. **Check n8n execution log** (click on workflow execution)
2. **Check backend logs:** `docker-compose logs server`
3. **Test API directly:** 
   ```powershell
   Invoke-RestMethod http://localhost:5000/api/v1/leads
   ```
4. **Check webhook URL** - is ngrok still running?

---

## 💡 Important Notes

### About Webhooks:

**Webhook** = A URL that receives data when something happens

**Example:**
- You give Twilio a webhook URL: `https://abc123.ngrok.io/webhook/whatsapp-incoming`
- When someone sends WhatsApp message → Twilio sends data to that URL
- n8n receives it → Processes it → Sends to your API
- Done!

### About ngrok:

**ngrok** exposes your local server to the internet temporarily.

**Free tier limitations:**
- URL changes every time you restart ngrok
- Need to update webhook URLs in all services when restarted

**Solution for production:**
- Deploy to cloud server (AWS, DigitalOcean)
- Get permanent domain
- Or use ngrok paid plan ($8/month) for stable URL

---

## 🎓 Learning Path

### Week 1: Learn n8n Basics
- ✅ Create test workflow
- ✅ Test with PowerShell
- ✅ Understand nodes and connections

### Week 2: First Integration
- ✅ Set up Email (easiest!)
- ✅ Test with real emails
- ✅ See them appear on dashboard

### Week 3: Social Media
- ✅ Set up WhatsApp (Twilio)
- ✅ Install ngrok
- ✅ Test with real WhatsApp messages

### Week 4: Complete Setup
- ✅ Add Instagram
- ✅ Add Facebook
- ✅ Fine-tune workflows
- ✅ Enjoy automated lead management!

---

## 🆘 Common Issues

### "Webhook not receiving data"
- Check if ngrok is running
- Check if webhook URL is correct in external service
- Check if n8n workflow is Active

### "Data not reaching dashboard"
- Check HTTP Request node configuration
- Check backend logs: `docker-compose logs server`
- Test API directly

### "AI summary not working"
- Check Groq API key in server/.env
- Check backend logs for errors

---

## 📚 Next Steps

1. **Read this guide completely**
2. **Start with Email** (easiest to set up)
3. **Move to WhatsApp** (most useful)
4. **Add Instagram/Facebook** (when ready)
5. **Deploy to production** (when comfortable)

---

## 🎉 Success!

Once set up, you'll have:
- ✅ ALL customer messages in ONE dashboard
- ✅ AI summaries for quick understanding
- ✅ Priority sorting (urgent first!)
- ✅ Never miss a message
- ✅ Save hours every day!

**Let's get started!** Open http://localhost:5678 now! 🚀
