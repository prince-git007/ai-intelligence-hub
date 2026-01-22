# 🚀 How to Use AI Intelligence Hub

A practical guide to using your lead management system.

---

## ✅ Step 1: Start Everything

```powershell
cd D:\ai-intelligence-hub
docker-compose up -d
```

Wait 30 seconds for everything to start, then check:

```powershell
docker-compose ps
```

You should see **4 services running** ✅

---

## 🌐 Step 2: Open Your Dashboard

**In your browser, visit:**
```
http://localhost
```

You should see:
- ✅ AI Intelligence Hub header
- ✅ Green "Live" indicator
- ✅ Statistics cards (Total, New, Contacted, High Priority)
- ✅ Your existing 6 leads with AI summaries

**⚠️ If you see "Could not connect to API":**
- Wait another 10 seconds and click "Refresh"
- Or check if the backend is healthy: http://localhost:5000/health

---

## 🧪 Step 3: Test Creating a Lead

### Method 1: Using PowerShell (Easiest)

**Create a Test Lead:**
```powershell
$testLead = @{
    source = "WhatsApp Test"
    originalContent = "Hi! I'm interested in your AI lead system. We handle 500 leads per month and need help with automation. Can you provide pricing information?"
    priority = "High"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/v1/leads" -Method Post -Body $testLead -ContentType "application/json"
```

**What happens:**
1. ⏱️ Groq AI processes your message (takes 2-3 seconds)
2. 💾 Lead is saved to MongoDB
3. ✨ **Within 5 seconds**, refresh your dashboard → **New lead appears!**

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "source": "WhatsApp Test",
    "originalContent": "Hi! I'm interested in...",
    "aiSummary": "Prospect interested in AI lead automation...",
    "priority": "High",
    "status": "New",
    "createdAt": "2026-01-15T..."
  }
}
```

### Method 2: Using n8n (For Real Automation)

**Setup:**
1. Go to http://localhost:5678
2. Login: `admin` / `admin123`
3. Click "+ Add workflow"
4. Click "Add node" (+)
5. Search "Webhook" → Add it
6. Click "Add node" again
7. Search "HTTP Request" → Add it
8. Configure HTTP Request:
   - Method: **POST**
   - URL: **http://server:5000/api/v1/leads**
   - Add header: `Content-Type: application/json`
   - Body:
   ```json
   {
     "source": "{{ $node.Webhook.json.source }}",
     "originalContent": "{{ $node.Webhook.json.message }}",
     "priority": "High"
   }
   ```
9. Click "Execute Workflow"
10. Click "Activate" (toggle at top)

**Test It:**
```powershell
$webhookData = @{
    source = "n8n Test"
    message = "This is a lead coming from n8n automation!"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5678/webhook-test/your-webhook-path" -Method Post -Body $webhookData -ContentType "application/json"
```

---

## 👀 Step 4: View Your Leads

### On Dashboard (Visual)
- Go to http://localhost
- You'll see all leads as cards
- Each card shows:
  - Source (WhatsApp, Email, etc.)
  - Priority level (High/Medium/Low)
  - Status (New/Contacted)
  - Original message
  - AI-generated summary
  - Timestamp

### Via API (Programmatic)

**Get All Leads:**
```powershell
Invoke-RestMethod http://localhost:5000/api/v1/leads | ConvertTo-Json -Depth 5
```

**Filter by Status:**
```powershell
# Only new leads
Invoke-RestMethod "http://localhost:5000/api/v1/leads?status=New"

# Only contacted leads
Invoke-RestMethod "http://localhost:5000/api/v1/leads?status=Contacted"
```

**Filter by Priority:**
```powershell
# Only high priority
Invoke-RestMethod "http://localhost:5000/api/v1/leads?priority=High"
```

**Sort by Date:**
```powershell
# Newest first
Invoke-RestMethod "http://localhost:5000/api/v1/leads?sortBy=createdAt&sortOrder=desc"
```

**Pagination:**
```powershell
# First 10 leads
Invoke-RestMethod "http://localhost:5000/api/v1/leads?page=1&limit=10"

# Next 10 leads
Invoke-RestMethod "http://localhost:5000/api/v1/leads?page=2&limit=10"
```

---

## ✏️ Step 5: Update a Lead

### Mark as Contacted

**Get the Lead ID first:**
```powershell
$leads = Invoke-RestMethod http://localhost:5000/api/v1/leads
$leadId = $leads.data[0]._id
Write-Host "Lead ID: $leadId"
```

**Update Status:**
```powershell
$update = @{
    status = "Contacted"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/leads/$leadId" -Method Patch -Body $update -ContentType "application/json"
```

**Or on the Dashboard:**
- Find the lead card
- Click "Mark as Contacted" button
- Status changes from 🆕 New → ✅ Contacted

---

## 📊 Step 6: Understand the Data

### What Each Field Means

```json
{
  "_id": "69689...",           // Unique identifier
  "source": "WhatsApp",        // Where the lead came from
  "originalContent": "Hi...",  // What the customer said
  "aiSummary": "Customer...",  // AI's understanding
  "priority": "High",          // Low/Medium/High
  "status": "New",             // New/Contacted
  "createdAt": "2026-01-15...",// When received
  "updatedAt": "2026-01-15..." // Last modified
}
```

### Priority Levels Explained

- **High**: 🔥 Urgent, needs immediate attention
  - Keywords: "urgent", "emergency", "ASAP", "immediately"
  - Sales ready: "want to buy", "ready to purchase"
  - Problems: "not working", "broken", "issue"

- **Medium**: ⚡ Important but not urgent
  - Information requests
  - Schedule calls/demos
  - General inquiries

- **Low**: 📝 Can wait
  - Newsletter signups
  - General browsing
  - Future interest

---

## 🎯 Step 7: Real-World Usage Scenarios

### Scenario 1: E-commerce Customer Support

**Morning Routine:**
1. Open http://localhost
2. Filter by "High Priority" → Urgent customer issues
3. Handle those first
4. Mark as "Contacted" when done
5. Move to Medium priority leads

**n8n Setup:**
- WhatsApp Business API → n8n → AI Hub
- Instagram DM webhook → n8n → AI Hub
- Email monitoring → n8n → AI Hub

### Scenario 2: Sales Team

**Lead Qualification:**
1. New lead arrives from LinkedIn
2. AI summarizes: "Interested in enterprise plan, 500 leads/month"
3. Salesperson sees: High priority
4. Calls prospect immediately
5. Marks as "Contacted"

**n8n Setup:**
- Website form → n8n → AI Hub
- LinkedIn webhook → n8n → AI Hub
- Cold email responses → n8n → AI Hub

### Scenario 3: Service Business

**Emergency Requests:**
1. Customer WhatsApp: "Water leak emergency!"
2. AI detects urgency → High priority
3. Notification appears on dashboard
4. Dispatch technician
5. Mark as contacted

**n8n Setup:**
- WhatsApp → n8n → AI Hub
- Phone system (if supported) → n8n → AI Hub
- Google Maps reviews → n8n → AI Hub

---

## 🔌 Step 8: Connect Real Sources

### WhatsApp Business

**Requirements:**
- WhatsApp Business API account (Meta/Facebook)
- OR third-party provider (Twilio, MessageBird, etc.)

**n8n Workflow:**
1. WhatsApp Trigger → When new message
2. Format data → Extract message, phone number
3. HTTP Request → POST to your AI Hub
4. Done!

### Instagram Direct Messages

**Requirements:**
- Instagram Business account
- Facebook Graph API access

**n8n Workflow:**
1. Instagram Trigger → New DM
2. Extract message content
3. HTTP Request → POST to AI Hub

### Facebook Messenger

**Requirements:**
- Facebook Page
- Facebook Messenger API access

**n8n Workflow:**
1. Facebook Messenger Trigger
2. Extract message
3. Send to AI Hub

### Email (Gmail)

**Requirements:**
- Gmail account
- Gmail API credentials

**n8n Workflow:**
1. Gmail Trigger → New email
2. Extract subject + body
3. Format as lead
4. Send to AI Hub

---

## 📱 Step 9: Mobile Access

Your dashboard works on mobile too!

**On your local network:**
1. Find your computer's IP address:
```powershell
ipconfig | Select-String "IPv4"
```

2. Open on phone: `http://YOUR-IP-ADDRESS`
   - Example: `http://192.168.1.100`

**For internet access (Advanced):**
- Deploy to cloud (AWS, DigitalOcean, etc.)
- Use ngrok for testing
- Or set up port forwarding on your router

---

## 🛠️ Step 10: Maintenance & Monitoring

### Check System Health

```powershell
# Are services running?
docker-compose ps

# Check backend health
Invoke-RestMethod http://localhost:5000/health

# View logs
docker-compose logs -f server
docker-compose logs -f client
```

### Backup Your Data

```powershell
# Export all leads to JSON
Invoke-RestMethod http://localhost:5000/api/v1/leads | ConvertTo-Json -Depth 5 > leads-backup.json

# Import leads (if needed)
$backup = Get-Content leads-backup.json | ConvertFrom-Json
foreach ($lead in $backup.data) {
    $leadData = @{
        source = $lead.source
        originalContent = $lead.originalContent
        priority = $lead.priority
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri "http://localhost:5000/api/v1/leads" -Method Post -Body $leadData -ContentType "application/json"
}
```

### Clean Old Leads

```powershell
# Get all lead IDs
$leads = Invoke-RestMethod http://localhost:5000/api/v1/leads
$oldLeadId = $leads.data[0]._id

# Delete a lead
Invoke-RestMethod -Uri "http://localhost:5000/api/leads/$oldLeadId" -Method Delete
```

---

## 🔍 Troubleshooting

### Dashboard Shows "Could not connect to API"

**Solution:**
```powershell
# 1. Check if backend is running
docker-compose ps

# 2. Check backend health
Invoke-RestMethod http://localhost:5000/health

# 3. Restart services
docker-compose restart server client

# 4. Wait 10 seconds, refresh browser
```

### AI Summary Not Appearing

**Solution:**
```powershell
# Check if Groq API key is set
docker-compose exec server printenv | Select-String "GROQ"

# Should show:
# GROQ_API_KEY=gsk_...

# If missing, check server/.env file
Get-Content server\.env | Select-String "GROQ"
```

### Leads Not Showing on Dashboard

**Solution:**
```powershell
# 1. Check if leads exist in database
Invoke-RestMethod http://localhost:5000/api/v1/leads

# 2. Clear browser cache
# Press Ctrl+Shift+R to hard refresh

# 3. Check browser console for errors
# Press F12, look at Console tab
```

---

## 📚 Quick Reference Commands

### Start/Stop
```powershell
docker-compose up -d          # Start all services
docker-compose down           # Stop all services
docker-compose restart        # Restart all services
```

### View Logs
```powershell
docker-compose logs -f        # All logs
docker-compose logs server    # Backend logs only
docker-compose logs client    # Frontend logs only
```

### Create Lead
```powershell
$lead = '{"source":"Test","originalContent":"Hello!","priority":"High"}'
Invoke-RestMethod -Uri http://localhost:5000/api/v1/leads -Method Post -Body $lead -ContentType "application/json"
```

### Get Leads
```powershell
Invoke-RestMethod http://localhost:5000/api/v1/leads
```

### Update Lead
```powershell
$update = '{"status":"Contacted"}'
Invoke-RestMethod -Uri "http://localhost:5000/api/leads/LEAD_ID" -Method Patch -Body $update -ContentType "application/json"
```

---

## 🎓 Next Steps

1. ✅ **Practice creating test leads**
2. ✅ **Set up n8n workflows**
3. ✅ **Connect your first real source** (WhatsApp, Email, etc.)
4. ✅ **Monitor and respond to leads**
5. ✅ **Optimize your workflow**

---

## 📖 Additional Resources

- `COMPLETE-BEGINNER-GUIDE.md` - Detailed explanation
- `VISUAL-GUIDE.md` - Visual diagrams
- `SETUP-GUIDE.md` - Initial setup
- `PRODUCTION-SETUP.md` - Deploy to production

---

**🎉 You're ready to manage leads like a pro!**

**Questions?**
- Check the guides above
- Review n8n documentation: https://docs.n8n.io
- Review MongoDB docs: https://docs.mongodb.com
- Review Groq AI docs: https://console.groq.com/docs
