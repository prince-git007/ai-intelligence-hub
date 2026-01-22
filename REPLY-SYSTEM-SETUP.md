# 🎯 Reply System - Complete Setup Guide

## 🎉 What's New!

You now have a **professional AI-powered Reply System** for your leads!

### ✨ Features:
- **Reply Button** on each lead card
- **Beautiful Modal** for composing replies
- **AI-Generated Replies** - Click one button to get a professional response
- **n8n Integration** - Automatically triggers workflows to send replies
- **Reply History** - All replies are saved in the database

---

## 🚀 Quick Setup (3 Steps)

### **Step 1: Update Environment Variables**

Add this line to your `server/.env` file:

```bash
# n8n Webhook Configuration
N8N_REPLY_WEBHOOK_URL=http://n8n:5678/webhook/reply-handler
```

### **Step 2: Rebuild the Containers**

```powershell
cd D:\ai-intelligence-hub
docker-compose up -d --build
```

### **Step 3: Create n8n Workflow**

See the detailed n8n setup below ↓

---

## 📋 How It Works

### **User Flow:**

```
1. User clicks "Reply" button on a lead card
   ↓
2. Beautiful modal opens
   ↓
3. User clicks "Generate AI Reply" (optional)
   → AI analyzes the message
   → Suggests a professional response
   ↓
4. User reviews/edits the reply
   ↓
5. User clicks "Send Reply"
   → Reply saved to database
   → Lead status updated to "Contacted"
   → n8n webhook triggered
   ↓
6. n8n receives webhook
   → Sends actual message via WhatsApp/Instagram/Email
   → Customer receives the reply!
```

---

## 🤖 n8n Workflow Setup

### **Create This Workflow in n8n:**

1. **Open n8n:** http://localhost:5678

2. **Create New Workflow:** "Reply Handler"

3. **Add These Nodes:**

#### **Node 1: Webhook Trigger**
```
Name: Reply Webhook
Type: Webhook
Method: POST
Path: reply-handler
Response Mode: Last Node
```

#### **Node 2: Function (Process Data)**
```
Name: Extract Reply Data
Type: Code
Code:
```

```javascript
// Extract data from webhook
const leadId = $input.item.json.leadId;
const source = $input.item.json.source;
const replyText = $input.item.json.replyText;
const originalMessage = $input.item.json.originalMessage;

// Determine which channel to use
let channel = 'email'; // default

if (source.toLowerCase().includes('whatsapp')) {
  channel = 'whatsapp';
} else if (source.toLowerCase().includes('instagram')) {
  channel = 'instagram';
} else if (source.toLowerCase().includes('facebook')) {
  channel = 'facebook';
}

return {
  leadId,
  source,
  replyText,
  originalMessage,
  channel,
  timestamp: new Date().toISOString()
};
```

#### **Node 3: Switch (Route by Channel)**
```
Name: Route by Channel
Type: Switch
Mode: Expression
Routes:
  - Rule 1: {{ $json.channel === 'whatsapp' }} → Send via WhatsApp
  - Rule 2: {{ $json.channel === 'instagram' }} → Send via Instagram
  - Rule 3: {{ $json.channel === 'email' }} → Send via Email
  - Default: Log to console
```

#### **Node 4: Send WhatsApp (if applicable)**
```
Name: Send WhatsApp Message
Type: HTTP Request (or Twilio/WhatsApp Business API)
Method: POST
URL: Your WhatsApp API endpoint
Body: {{ $json.replyText }}
```

#### **Node 5: Send Instagram (if applicable)**
```
Name: Send Instagram DM
Type: HTTP Request (or Instagram Graph API)
Method: POST
URL: Your Instagram API endpoint
Body: {{ $json.replyText }}
```

#### **Node 6: Send Email (if applicable)**
```
Name: Send Email
Type: Send Email
To: Extract from lead source
Subject: Re: Your inquiry
Message: {{ $json.replyText }}
```

4. **Activate the Workflow** (toggle ON)

---

## 🔧 Backend API Endpoints

### **Generate AI Reply**
```
POST /api/v1/leads/:id/generate-reply
```

**Response:**
```json
{
  "success": true,
  "suggestedReply": "AI-generated professional response..."
}
```

### **Send Reply**
```
POST /api/v1/leads/:id/reply

Body:
{
  "replyText": "Your reply message here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reply sent successfully",
  "reply": {
    "replyText": "Your reply...",
    "sentAt": "2026-01-22T10:30:00.000Z",
    "sentBy": "system",
    "status": "sent"
  },
  "lead": {
    "_id": "...",
    "status": "Contacted",
    "replies": [...]
  }
}
```

### **Get Reply History**
```
GET /api/v1/leads/:id/replies
```

**Response:**
```json
{
  "success": true,
  "replies": [
    {
      "replyText": "...",
      "sentAt": "...",
      "sentBy": "system",
      "status": "sent"
    }
  ]
}
```

---

## 🎨 Frontend Components

### **New Files Created:**

1. **`client/src/components/ReplyModal.jsx`**
   - Beautiful modal UI
   - AI reply generation
   - Character counter
   - Copy to clipboard
   - Loading states

2. **Updated `client/src/components/LeadCard.jsx`**
   - Added "Reply" button
   - Added "Mark Contacted" button
   - Modal integration

---

## 🧪 Testing the System

### **Test 1: Open Modal**
```
1. Refresh dashboard
2. Find any lead card
3. Click "Reply" button
4. Modal should open with lead details
```

### **Test 2: Generate AI Reply**
```
1. In modal, click "Generate AI Reply"
2. Wait 2-3 seconds
3. AI-generated reply appears in text area
4. Edit if needed
```

### **Test 3: Send Reply**
```
1. Enter or generate reply text
2. Click "Send Reply"
3. Success toast notification appears
4. Modal closes
5. Lead status updates to "Contacted"
```

### **Test 4: Check Database**
```
1. Lead should have replies array
2. Reply saved with timestamp
3. Status updated to "Contacted"
```

### **Test 5: n8n Webhook**
```
1. Check n8n workflow executions
2. Should see new execution
3. Data should be passed correctly
```

---

## 📊 Database Schema Update

### **Lead Model - New Fields:**

```javascript
replies: [{
  replyText: String,      // The reply message
  sentAt: Date,           // When it was sent
  sentBy: String,         // Who sent it ("system")
  status: String          // "queued", "sent", or "failed"
}]
```

---

## 🎯 n8n Webhook Payload

### **Data Sent to n8n:**

```json
{
  "leadId": "507f1f77bcf86cd799439011",
  "source": "WhatsApp - John Doe (+1234567890)",
  "originalMessage": "Hi! I'm interested in your product...",
  "replyText": "Thank you for your interest! I'd be happy to help...",
  "timestamp": "2026-01-22T10:30:00.000Z",
  "priority": "High",
  "metadata": {
    "createdAt": "2026-01-22T09:00:00.000Z",
    "aiSummary": "Customer inquiry about product..."
  }
}
```

You can use this data in n8n to:
- Extract phone number from source
- Send via appropriate channel
- Log the interaction
- Update CRM systems
- Send notifications

---

## 💡 Advanced Features (Optional)

### **1. User Authentication**
- Add login system
- Track which user sent reply
- Replace "system" with actual username

### **2. Reply Templates**
- Create common reply templates
- Quick insert buttons
- Save favorite replies

### **3. Reply Analytics**
- Track response times
- Measure reply effectiveness
- A/B test different replies

### **4. Multi-language Support**
- Detect customer language
- Generate replies in their language

### **5. Auto-Reply**
- Set up auto-replies for common questions
- Business hours automation
- Instant acknowledgment

---

## 🚨 Troubleshooting

### **Modal Not Opening**
```
- Hard refresh: Ctrl + Shift + R
- Check browser console for errors
- Rebuild client: docker-compose up -d --build client
```

### **AI Reply Not Generating**
```
- Check Groq API key in server/.env
- Check backend logs: docker-compose logs server
- Verify AI_PROVIDER=groq in .env
```

### **Reply Not Sending**
```
- Check if reply saved in database (should work even if n8n fails)
- Check N8N_REPLY_WEBHOOK_URL in server/.env
- Verify n8n workflow is active
- Check n8n logs
```

### **n8n Webhook Not Triggering**
```
- Verify workflow is "Active" (green toggle)
- Check webhook URL matches .env
- Test webhook manually with curl/Postman
- Check n8n is running: docker ps
```

---

## 📖 Example n8n Workflow (Complete)

Here's a simple complete workflow for WhatsApp:

```
[Webhook: reply-handler]
       ↓
[Code: Extract phone from source]
       ↓
[Twilio: Send WhatsApp Message]
       ↓
[HTTP: Update lead status to "Contacted"]
```

---

## ✅ Setup Checklist

- [ ] Added N8N_REPLY_WEBHOOK_URL to server/.env
- [ ] Rebuilt containers (docker-compose up -d --build)
- [ ] Created n8n workflow with webhook trigger
- [ ] Activated n8n workflow
- [ ] Tested modal opening
- [ ] Tested AI reply generation
- [ ] Tested sending reply
- [ ] Verified n8n webhook receives data
- [ ] Tested actual message sending (WhatsApp/etc)

---

## 🎉 Congratulations!

You now have a complete AI-powered reply system!

**Benefits:**
- ✅ Reply to leads directly from dashboard
- ✅ AI suggests professional responses
- ✅ Automatic workflow automation via n8n
- ✅ Complete reply history tracking
- ✅ Beautiful, modern UI

**Next Steps:**
1. Update your server/.env file
2. Rebuild: `docker-compose up -d --build`
3. Create n8n workflow
4. Test the system!
5. Start replying to your leads! 🚀
