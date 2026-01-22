# ⚡ Quick Reference Card

## 🔥 Most Common Commands

### Create a Lead
```powershell
.\add-lead-now.ps1
```

### View All Leads
```powershell
Invoke-RestMethod http://localhost:5000/api/v1/leads
```

### View Lead Count
```powershell
$leads = Invoke-RestMethod "http://localhost:5000/api/v1/leads"
Write-Host "Total: $($leads.pagination.total)"
```

### One-Line Lead Creation
```powershell
$lead = '{"source":"SOURCE","originalContent":"MESSAGE","priority":"High"}'
Invoke-RestMethod -Uri http://localhost:5000/api/v1/leads -Method Post -Body $lead -ContentType "application/json"
```

---

## 🌐 URLs

| Service | URL | Login |
|---------|-----|-------|
| Dashboard | http://localhost | - |
| Backend API | http://localhost:5000 | - |
| API Health | http://localhost:5000/health | - |
| Get Leads | http://localhost:5000/api/v1/leads | - |
| n8n | http://localhost:5678 | admin / admin123 |

---

## 🐳 Docker Commands

```powershell
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View status
docker-compose ps

# View logs
docker-compose logs -f

# Restart
docker-compose restart

# Rebuild
docker-compose up -d --build
```

---

## 📊 API Endpoints

### GET /api/v1/leads
Get all leads with pagination

**Query Parameters:**
- `page=1` - Page number
- `limit=50` - Results per page
- `priority=High` - Filter by priority
- `status=New` - Filter by status
- `source=WhatsApp` - Filter by source
- `sortBy=createdAt` - Sort field
- `sortOrder=desc` - Sort direction

**Examples:**
```powershell
# All leads
Invoke-RestMethod "http://localhost:5000/api/v1/leads"

# High priority only
Invoke-RestMethod "http://localhost:5000/api/v1/leads?priority=High"

# New leads only
Invoke-RestMethod "http://localhost:5000/api/v1/leads?status=New"

# Newest first
Invoke-RestMethod "http://localhost:5000/api/v1/leads?sortBy=createdAt&sortOrder=desc"
```

### POST /api/v1/leads
Create a new lead

**Body (JSON):**
```json
{
  "source": "WhatsApp",
  "originalContent": "Customer message here",
  "priority": "High"
}
```

**Example:**
```powershell
$lead = '{"source":"WhatsApp","originalContent":"Customer message","priority":"High"}'
Invoke-RestMethod -Uri http://localhost:5000/api/v1/leads -Method Post -Body $lead -ContentType "application/json"
```

### PATCH /api/leads/:id
Update a lead

**Body (JSON):**
```json
{
  "status": "Contacted"
}
```

**Example:**
```powershell
$update = '{"status":"Contacted"}'
Invoke-RestMethod -Uri "http://localhost:5000/api/leads/LEAD_ID" -Method Patch -Body $update -ContentType "application/json"
```

---

## 🗄️ Database Access

```powershell
# Connect to MongoDB
docker-compose exec mongodb mongosh ai-intelligence-hub

# Inside MongoDB:
db.leads.find().pretty()              # View all leads
db.leads.countDocuments()              # Count leads
db.leads.find({priority: "High"})      # High priority only
db.leads.find({status: "New"})         # New leads only
db.leads.find().sort({createdAt: -1})  # Newest first
exit                                   # Exit MongoDB
```

---

## 📝 Lead Structure

```json
{
  "_id": "696894...",
  "source": "WhatsApp",
  "originalContent": "Original customer message...",
  "aiSummary": "AI-generated summary...",
  "priority": "High",
  "status": "New",
  "createdAt": "2026-01-15T08:30:00.000Z",
  "updatedAt": "2026-01-15T08:30:00.000Z"
}
```

### Fields:
- **source**: Where the lead came from (WhatsApp, Email, etc.)
- **originalContent**: What the customer said
- **aiSummary**: AI-generated intelligent summary
- **priority**: `High`, `Medium`, or `Low`
- **status**: `New` or `Contacted`
- **createdAt**: When the lead was received
- **updatedAt**: Last modified time

---

## 🧪 Testing Commands

### Create Test Lead
```powershell
$test = '{"source":"Test","originalContent":"This is a test","priority":"Medium"}'
Invoke-RestMethod -Uri http://localhost:5000/api/v1/leads -Method Post -Body $test -ContentType "application/json"
```

### Health Check
```powershell
Invoke-RestMethod http://localhost:5000/health
```

### View Prettified Leads
```powershell
$leads = Invoke-RestMethod "http://localhost:5000/api/v1/leads"
foreach ($lead in $leads.data) {
    Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "📱 $($lead.source)" -ForegroundColor Yellow
    Write-Host "⚡ $($lead.priority) | $($lead.status)" -ForegroundColor White
    Write-Host "📝 $($lead.originalContent)" -ForegroundColor Gray
    Write-Host "🤖 $($lead.aiSummary)" -ForegroundColor Green
}
```

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `server/.env` | Backend configuration (API keys, DB URI) |
| `docker-compose.yml` | Service orchestration |
| `server/index.js` | Main backend server |
| `add-lead-now.ps1` | Interactive lead creation script |

---

## 🆘 Troubleshooting

### "Cannot connect"
```powershell
docker-compose ps                      # Check services
docker-compose logs server --tail 50   # View logs
docker-compose restart                 # Restart all
```

### "AI summary not working"
```powershell
# Check Groq API key
docker-compose exec server printenv | Select-String "GROQ"
```

### "Database error"
```powershell
# Check MongoDB
docker-compose logs mongodb --tail 20
```

### Reset Everything
```powershell
docker-compose down
docker-compose up -d --build
```

---

## 📚 Documentation Files

| File | Purpose | When to Read |
|------|---------|-------------|
| `START-HERE.md` | Main guide | **READ FIRST** |
| `ADD-LEADS-GUIDE.md` | How to add leads | Today |
| `SOCIAL-MEDIA-SETUP.md` | Connect platforms | This week |
| `QUICK-REFERENCE.md` | This file | Keep handy |
| `COMPLETE-BEGINNER-GUIDE.md` | Full explanation | Deep dive |
| `VISUAL-GUIDE.md` | Diagrams | Visual learner |
| `HOW-TO-USE.md` | Daily usage | Advanced |

---

## 🎯 Quick Workflows

### Morning Routine
```powershell
# Check new leads
Invoke-RestMethod "http://localhost:5000/api/v1/leads?status=New"

# Check high priority
Invoke-RestMethod "http://localhost:5000/api/v1/leads?priority=High"
```

### Mark Lead as Contacted
```powershell
# Get lead ID
$leads = Invoke-RestMethod "http://localhost:5000/api/v1/leads"
$leadId = $leads.data[0]._id

# Update status
$update = '{"status":"Contacted"}'
Invoke-RestMethod -Uri "http://localhost:5000/api/leads/$leadId" -Method Patch -Body $update -ContentType "application/json"
```

### Daily Stats
```powershell
$leads = Invoke-RestMethod "http://localhost:5000/api/v1/leads"
$total = $leads.pagination.total
$new = ($leads.data | Where-Object {$_.status -eq "New"}).Count
$high = ($leads.data | Where-Object {$_.priority -eq "High"}).Count

Write-Host "📊 Daily Stats:" -ForegroundColor Cyan
Write-Host "   Total: $total" -ForegroundColor White
Write-Host "   New: $new" -ForegroundColor Yellow
Write-Host "   High Priority: $high" -ForegroundColor Red
```

---

## 🔑 Environment Variables

**Location:** `server/.env`

```env
# Required
MONGODB_URI=mongodb://mongodb:27017/ai-intelligence-hub
PORT=5000
GROQ_API_KEY=your-key-here

# Optional
NODE_ENV=development
AI_PROVIDER=groq
GROQ_MODEL=llama-3.1-8b-instant
ENABLE_AI_SUMMARY=true
ENABLE_AI_PRIORITY=false
CORS_ORIGIN=http://localhost:5173,http://localhost:80
```

---

## 📞 Support

**Issues?**
1. Check `START-HERE.md`
2. Check this reference card
3. Check Docker logs
4. Restart services

**Questions about:**
- Adding leads → `ADD-LEADS-GUIDE.md`
- Social media → `SOCIAL-MEDIA-SETUP.md`
- Usage → `HOW-TO-USE.md`

---

**Last Updated:** 2026-01-15  
**Version:** 1.0  
**Status:** ✅ Production Ready
