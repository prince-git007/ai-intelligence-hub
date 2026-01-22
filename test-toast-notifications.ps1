# Test Toast Notifications Script
# This will add leads one by one to trigger beautiful toast notifications!

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Toast Notification Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will add leads every 10 seconds." -ForegroundColor Yellow
Write-Host "Keep your dashboard open at http://localhost" -ForegroundColor Yellow
Write-Host "You'll see beautiful toast notifications appear!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop at any time." -ForegroundColor Gray
Write-Host ""
Start-Sleep -Seconds 3

$testLeads = @(
    @{
        source = "WhatsApp - Sarah Johnson"
        originalContent = "Hi! I'm interested in your premium package. Can you send me more details?"
        priority = "High"
    },
    @{
        source = "Instagram DM - @techstartup"
        originalContent = "Love your product! Would like to discuss partnership opportunities."
        priority = "High"
    },
    @{
        source = "Email - john.doe@company.com"
        originalContent = "We need a demo for our team of 50 people. What's the pricing?"
        priority = "Medium"
    },
    @{
        source = "WhatsApp - Michael Chen"
        originalContent = "Quick question about the refund policy. Can I get my money back if not satisfied?"
        priority = "Low"
    },
    @{
        source = "Facebook Messenger - Lisa Anderson"
        originalContent = "URGENT: My account is locked and I can't access my dashboard. Please help ASAP!"
        priority = "High"
    }
)

$count = 1
foreach ($lead in $testLeads) {
    Write-Host "[$count/5] Adding new lead..." -ForegroundColor Cyan
    Write-Host "  Source: $($lead.source)" -ForegroundColor White
    Write-Host "  Priority: $($lead.priority)" -ForegroundColor Yellow
    
    try {
        $json = $lead | ConvertTo-Json -Compress
        $response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/leads" -Method Post -Body $json -ContentType "application/json"
        
        Write-Host "  ✅ Lead added successfully!" -ForegroundColor Green
        Write-Host "  🔔 Watch your dashboard for the toast notification!" -ForegroundColor Magenta
    }
    catch {
        Write-Host "  ❌ Error: $_" -ForegroundColor Red
    }
    
    Write-Host ""
    
    if ($count -lt $testLeads.Count) {
        Write-Host "⏳ Waiting 10 seconds before next lead..." -ForegroundColor Gray
        Write-Host "(This gives you time to see the toast notification)" -ForegroundColor Gray
        Write-Host ""
        Start-Sleep -Seconds 10
    }
    
    $count++
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Test Complete! 🎉" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "All 5 leads have been added!" -ForegroundColor White
Write-Host "You should have seen 5 beautiful toast notifications!" -ForegroundColor White
Write-Host ""
Write-Host "Check your dashboard: http://localhost" -ForegroundColor Cyan
Write-Host ""
