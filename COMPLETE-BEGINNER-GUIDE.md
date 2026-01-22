# 🎓 Complete Beginner's Guide to AI Intelligence Hub

A step-by-step guide for managing leads and understanding how everything works.

---

## 📊 What is AI Intelligence Hub?

Think of it as a **smart inbox for all your business leads** from anywhere:
- Website contact forms
- WhatsApp messages  
- Facebook messages
- Instagram DMs
- LinkedIn messages
- Email inquiries
- Phone calls (if you log them)

Instead of checking 10 different places, **everything comes to ONE dashboard** with AI-generated summaries!

---

## 🔍 Understanding the Three Parts

### 1. **Backend (Port 5000)** - The Brain 🧠
- Receives leads from anywhere
- Uses AI to summarize each lead
- Stores everything in MongoDB database
- http://localhost:5000

**Important**: When you visit http://localhost:5000, you see "Cannot GET /". **This is NORMAL!** 
It's like knocking on a server room door - there's no lobby, just specific rooms (endpoints):
- ✅ http://localhost:5000/health (Status check)
- ✅ http://localhost:5000/api/v1/leads (Get leads)
- ✅ http://localhost:5000/api/webhook (Receive new leads)

### 2. **Dashboard (Port 80)** - What You See 👀
- Beautiful interface to view leads
- Updates automatically every 5 seconds
- Shows AI summaries and priorities
- http://localhost

### 3. **n8n (Port 5678)** - The Connector 🔗
- Connects external sources to your system
- Automates receiving leads from social media
- http://localhost:5678
- Login: admin / admin123

---

## 📱 How Social Media Integration Works

### The Problem Without This System:
```
WhatsApp message → Check WhatsApp
Facebook message → Check Facebook  
Instagram DM → Check Instagram
Email → Check Gmail
Website form → Check website admin
LinkedIn → Check LinkedIn

Result: Chaos! 😫 Missed leads, slow responses
```

### The Solution With AI Intelligence Hub:
```
WhatsApp message ─┐
Facebook message ─┤
Instagram DM ─────┤
Email ───────────┼─→ n8n ─→ AI Hub ─→ ONE Dashboard ✅
Website form ─────┤         (Summarizes)   (All Leads)
LinkedIn ─────────┘

Result: Everything in one place! 🎉
```

---

## 🎯 How to Manage Your Leads

### Step 1: Open Your Dashboard
```
http://localhost
```

You'll see:
- **Total Leads**: All leads you have
- **New Leads**: Leads you haven't contacted yet
- **Contacted**: Leads you've already responded to
- **High Priority**: Urgent leads

### Step 2: View Lead Details

Each lead card shows:
- **Source**: Where it came from (WhatsApp, Email, etc.)
- **Original Message**: What they said
- **AI Summary**: Quick understanding of what they want
- **Priority**: How urgent it is (Low/Medium/High)
- **Status**: New or Contacted
- **Timestamp**: When you received it

### Step 3: Take Action

Click "Mark as Contacted" when you've responded to a lead.

---

## 🧪 How to Test Everything

### Test 1: Is My System Running?
```powershell
docker-compose ps
```

You should see 4 services running:
- ai-hub-mongodb
- ai-hub-server
- ai-hub-client
- ai-hub-n8n

### Test 2: Create a Test Lead (Manual)
```powershell
# Copy and paste this in PowerShell:
$lead = '{"source":"Test WhatsApp","originalContent":"Hi! I need help with my order #12345. When will it arrive?","priority":"High"}'
Invoke-RestMethod -Uri http://localhost:5000/api/v1/leads -Method Post -ContentType "application/json" -Body $lead
```

**What happens:**
1. API receives the lead
2. Groq AI reads it and generates a summary
3. Saved to MongoDB database
4. Within 5 seconds, appears on your dashboard!

### Test 3: View All Your Leads
```powershell
Invoke-RestMethod http://localhost:5000/api/v1/leads
```

### Test 4: Check If AI is Working
Look at the response from Test 2 - you should see an `aiSummary` field with intelligent text about the customer needing help with order delivery.

---

## 💾 Where is Everything Stored?

### Database: MongoDB

All your leads are stored in **MongoDB** - like a digital filing cabinet.

**View What's Stored:**
```powershell
# Connect to MongoDB
docker-compose exec mongodb mongosh ai-intelligence-hub

# Inside MongoDB, run:
db.leads.find().pretty()

# Count leads:
db.leads.countDocuments()

# Exit:
exit
```

**Your Data Structure:**
```json
{
  "_id": "unique-id-12345",
  "source": "WhatsApp",
  "originalContent": "Hi! I need help...",
  "aiSummary": "Customer inquiry about order delivery...",
  "priority": "High",
  "status": "New",
  "createdAt": "2026-01-15T07:00:00.000Z",
  "updatedAt": "2026-01-15T07:00:00.000Z"
}
```

---

## 📲 Setting Up WhatsApp Integration (Example)

### What You Need:
1. WhatsApp Business API or WhatsApp webhook
2. n8n running (http://localhost:5678)
3. Your AI Hub backend running

### How It Works:

```
Customer sends WhatsApp → WhatsApp Business API → 
Webhook to n8n → n8n formats it → 
Sends to AI Hub → AI summarizes → 
Shows on your dashboard
```

### Setting It Up in n8n:

#### Step 1: Create Workflow in n8n
1. Go to http://localhost:5678
2. Login: admin / admin123
3. Click "+ Add workflow"

#### Step 2: Add Webhook Node
1. Click "+" to add node
2. Search for "Webhook"
3. Select "Webhook" node
4. Set:
   - HTTP Method: **POST**
   - Path: **whatsapp-lead**
5. Save

#### Step 3: Add Format Node
1. Click "+" after webhook
2. Search for "Code" or "Function"
3. Add this code:
```javascript
return {
  json: {
    source: "WhatsApp",
    originalContent: $input.item.json.message || $input.item.json.body,
    priority: "High"
  }
};
```

#### Step 4: Add HTTP Request to Your API
1. Click "+" after format node
2. Search for "HTTP Request"
3. Set:
   - Method: **POST**
   - URL: **http://server:5000/api/v1/leads**
   - Send Body: **Yes**
   - Body: **{{ $json }}**
   - Add Header:
     - Name: **Content-Type**
     - Value: **application/json**

#### Step 5: Activate Workflow
1. Click "Active" toggle at top
2. Copy your webhook URL (looks like: http://localhost:5678/webhook/whatsapp-lead)
3. Give this URL to your WhatsApp Business API provider

---

## 🎯 Real-World Use Cases

### Use Case 1: E-commerce Store
**Sources:**
- WhatsApp: Customer questions
- Instagram DM: Product inquiries  
- Facebook: Order status questions
- Email: Returns/refunds

**Result**: All customer inquiries in one place with AI summaries showing what each customer needs.

### Use Case 2: Real Estate Agency
**Sources:**
- Website form: Property inquiries
- WhatsApp: Viewing requests
- Phone calls (manually log them)
- LinkedIn: Business inquiries

**Result**: Never miss a potential client. AI tells you which are urgent.

### Use Case 3: Service Business (Plumbing, Electrical, etc.)
**Sources:**
- Website: Service requests
- WhatsApp: Emergency calls
- Facebook: Questions
- Google Maps: Customer inquiries

**Result**: See all service requests with AI priority ranking (emergency vs. regular).

---

## 🔌 Connecting Other Social Media

### Facebook Messenger

**n8n Workflow:**
1. Facebook Messenger Trigger
2. Format Data
3. Send to http://server:5000/api/v1/leads

### Instagram

**n8n Workflow:**
1. Instagram Webhook
2. Extract message
3. Send to AI Hub

### Email (Gmail)

**n8n Workflow:**
1. Gmail Trigger (New Email)
2. Extract subject + body
3. Send to AI Hub

### LinkedIn

**n8n Workflow:**
1. LinkedIn Webhook
2. Extract message
3. Send to AI Hub

---

## 📊 Understanding Your Dashboard

### The Statistics Cards

**Total Leads**: 6
- Shows how many leads you have in total

**New Leads**: 6
- Leads you haven't contacted yet
- This is your "to-do" list

**Contacted**: 0
- Leads you've already responded to

**High Priority**: 3
- Urgent leads that need immediate attention

### The Lead Cards

Each card is color-coded:
- 🔥 **Red**: High priority
- ⚡ **Yellow**: Medium priority
- 📝 **Green**: Low priority

---

## ✅ Quick Testing Checklist

- [ ] Can you open http://localhost and see dashboard?
- [ ] Do you see 6 leads on the dashboard?
- [ ] Does each lead have an AI summary?
- [ ] Can you click "Refresh" and see it update?
- [ ] Can you open http://localhost:5678 and see n8n?
- [ ] Can you create a test lead using PowerShell?

If all YES ✅ → **Your system is working perfectly!**

---

## 🆘 Common Questions

### Q: Why does localhost:5000 show "Cannot GET /"?
**A**: This is normal! The backend doesn't have a homepage. Use these URLs instead:
- http://localhost:5000/health
- http://localhost:5000/api/v1/leads

### Q: Where are my leads stored?
**A**: In MongoDB database. They persist even if you restart Docker.

### Q: How does AI know what's urgent?
**A**: You can set priority manually, or enable AI priority detection in the code. The AI reads the message and determines urgency based on keywords like "urgent", "emergency", "ASAP", etc.

### Q: Can I connect my actual WhatsApp?
**A**: Yes! You need WhatsApp Business API (paid) or use WhatsApp Web automation tools (check terms of service). Then connect via n8n.

### Q: Do I need to pay for the AI?
**A**: No! Groq API (what you're using) is FREE with generous limits.

### Q: Can I export my leads?
**A**: Yes! Use this command:
```powershell
Invoke-RestMethod http://localhost:5000/api/v1/leads | ConvertTo-Json > my-leads.json
```

---

## 🎓 Summary

**What You Built:**
- ✅ A smart lead management system
- ✅ AI-powered summarization
- ✅ One dashboard for all sources
- ✅ Automated lead collection
- ✅ Real-time updates

**What You Can Do:**
- ✅ Receive leads from anywhere
- ✅ See AI summaries instantly
- ✅ Prioritize important leads
- ✅ Track contacted vs. new leads
- ✅ Never miss a potential customer

**Next Steps:**
1. Open http://localhost
2. Create test leads
3. Set up n8n workflows
4. Connect your real sources (WhatsApp, Facebook, etc.)
5. Start managing leads efficiently!

---

**🎉 You now have a professional lead management system!**
