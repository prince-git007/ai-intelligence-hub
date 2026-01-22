#!/usr/bin/env pwsh
# Script to create multiple test leads easily

Write-Host "`n╔═══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     CREATE TEST LEADS - NO CODING NEEDED!        ║" -ForegroundColor Yellow
Write-Host "╚═══════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "This script will create realistic test leads from different platforms.`n" -ForegroundColor White

# Ask user how many leads to create
Write-Host "How many test leads do you want to create? (1-20)" -ForegroundColor Yellow
$count = Read-Host "Number"

if ([string]::IsNullOrWhiteSpace($count) -or $count -lt 1) {
    $count = 5
    Write-Host "Using default: 5 leads`n" -ForegroundColor Gray
}

$count = [Math]::Min($count, 20)  # Max 20 at a time

# Sample leads - realistic scenarios
$sampleLeads = @(
    @{
        source = "WhatsApp"
        message = "Hi! I ordered product #12345 three days ago but haven't received any tracking information. Can you help?"
        priority = "High"
    },
    @{
        source = "Instagram DM"
        message = "Saw your post about the new collection! Do you ship to Canada? How long does delivery take?"
        priority = "Medium"
    },
    @{
        source = "Email"
        message = "Hello, I'm interested in your services for my company. We have 50 employees and need a lead management solution. Can we schedule a demo call this week?"
        priority = "High"
    },
    @{
        source = "Facebook Messenger"
        message = "Just browsing your page. Products look nice! Will check back later."
        priority = "Low"
    },
    @{
        source = "Website Contact Form"
        message = "I would like to get more information about pricing. Please contact me at customer@example.com"
        priority = "Medium"
    },
    @{
        source = "WhatsApp"
        message = "URGENT! My order hasn't arrived and I need it today for an important event! Please help immediately!"
        priority = "High"
    },
    @{
        source = "LinkedIn Message"
        message = "Hi, came across your profile. We're looking for a lead intelligence solution for our sales team. Currently processing 500+ leads monthly. Would love to connect."
        priority = "High"
    },
    @{
        source = "Instagram DM"
        message = "Love your products! 😍 Do you have this in blue color?"
        priority = "Medium"
    },
    @{
        source = "Email"
        message = "Thank you for your previous help. Just wanted to say your customer service is excellent!"
        priority = "Low"
    },
    @{
        source = "Facebook Messenger"
        message = "Hi! I saw your ad on Facebook. Can you tell me more about your AI lead system? We get about 100 inquiries daily."
        priority = "High"
    },
    @{
        source = "WhatsApp"
        message = "Hello! Do you offer bulk discounts? I want to order 50 units."
        priority = "Medium"
    },
    @{
        source = "Website Contact Form"
        message = "I'm having trouble with my recent order. The product arrived damaged. Order #67890. Please advise."
        priority = "High"
    },
    @{
        source = "Instagram DM"
        message = "Hey! Can I get a discount code? 😊"
        priority = "Low"
    },
    @{
        source = "Email"
        message = "Subject: Partnership Opportunity - We're a marketing agency looking to partner with innovative tech companies. Interested in discussing?"
        priority = "Medium"
    },
    @{
        source = "Telegram"
        message = "Quick question: Do you accept cryptocurrency payments?"
        priority = "Low"
    },
    @{
        source = "WhatsApp"
        message = "I need to return my order. What's your return policy? I bought it 2 weeks ago."
        priority = "Medium"
    },
    @{
        source = "Facebook Messenger"
        message = "Are you hiring? I'd love to work with your team!"
        priority = "Low"
    },
    @{
        source = "Email"
        message = "URGENT: Our system is down and we need support ASAP! We're a paying customer. Account #ABC123"
        priority = "High"
    },
    @{
        source = "Instagram DM"
        message = "Can you restock the blue shirt in size M? It's been out of stock for weeks!"
        priority = "Medium"
    },
    @{
        source = "Website Contact Form"
        message = "I'm a student working on a project about AI. Can I interview someone from your team?"
        priority = "Low"
    }
)

Write-Host "`n🚀 Creating $count test leads...`n" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Gray

$created = 0
$failed = 0

for ($i = 0; $i -lt $count; $i++) {
    $sample = $sampleLeads[$i % $sampleLeads.Count]
    
    $leadData = @{
        source = $sample.source
        originalContent = $sample.message
        priority = $sample.priority
    } | ConvertTo-Json
    
    try {
        $result = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/leads" `
            -Method Post `
            -Body $leadData `
            -ContentType "application/json" `
            -ErrorAction Stop
        
        $created++
        
        # Show progress
        $priorityColor = switch ($sample.priority) {
            "High" { "Red" }
            "Medium" { "Yellow" }
            "Low" { "Green" }
            default { "White" }
        }
        
        Write-Host "✅ Lead $($i + 1)/$count" -ForegroundColor Green -NoNewline
        Write-Host " | " -NoNewline
        Write-Host "$($sample.source)" -ForegroundColor Cyan -NoNewline
        Write-Host " | " -NoNewline
        Write-Host "$($sample.priority)" -ForegroundColor $priorityColor -NoNewline
        Write-Host " | " -NoNewline
        Write-Host "$($sample.message.Substring(0, [Math]::Min(50, $sample.message.Length)))..." -ForegroundColor Gray
        
        # Small delay to avoid overwhelming the API
        Start-Sleep -Milliseconds 500
        
    } catch {
        $failed++
        Write-Host "❌ Failed to create lead $($i + 1): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

# Get total count
try {
    $allLeads = Invoke-RestMethod "http://localhost:5000/api/v1/leads"
    $total = $allLeads.pagination.total
    $newCount = ($allLeads.data | Where-Object { $_.status -eq "New" }).Count
    $highCount = ($allLeads.data | Where-Object { $_.priority -eq "High" }).Count
    
    Write-Host "`n╔═══════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║                   SUMMARY                          ║" -ForegroundColor Yellow
    Write-Host "╚═══════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host "`n✅ Successfully created: $created leads" -ForegroundColor Green
    if ($failed -gt 0) {
        Write-Host "❌ Failed: $failed leads" -ForegroundColor Red
    }
    Write-Host "`n📊 SYSTEM STATUS:" -ForegroundColor Cyan
    Write-Host "   Total Leads: $total" -ForegroundColor White
    Write-Host "   New (Uncontacted): $newCount" -ForegroundColor Yellow
    Write-Host "   High Priority: $highCount" -ForegroundColor Red
    
    Write-Host "`n🎯 NEXT STEPS:" -ForegroundColor Cyan
    Write-Host "   1. Open dashboard: " -NoNewline -ForegroundColor White
    Write-Host "http://localhost" -ForegroundColor Blue
    Write-Host "   2. Wait 10 seconds, then refresh (Ctrl+Shift+R)" -ForegroundColor White
    Write-Host "   3. You should see all your leads with AI summaries!" -ForegroundColor White
    
    Write-Host "`n💡 TIP:" -ForegroundColor Cyan
    Write-Host "   Run this script again to add more test leads!" -ForegroundColor Gray
    Write-Host "   Or use: " -NoNewline -ForegroundColor Gray
    Write-Host ".\add-lead-now.ps1" -ForegroundColor Blue
    Write-Host "   to add leads one by one interactively.`n" -ForegroundColor Gray
    
} catch {
    Write-Host "`n⚠️  Could not get system status. Is the server running?" -ForegroundColor Yellow
    Write-Host "   Try: docker-compose ps`n" -ForegroundColor Gray
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Gray
