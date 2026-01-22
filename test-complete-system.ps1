# Complete System Test for AI Intelligence Hub
# Tests all components and creates sample leads

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     AI Intelligence Hub - Complete System Test            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if Docker services are running
Write-Host "📋 Test 1: Checking Docker Services..." -ForegroundColor Yellow
try {
    $services = docker-compose ps --format json | ConvertFrom-Json
    $runningServices = $services | Where-Object { $_.State -eq "running" }
    
    if ($runningServices.Count -ge 3) {
        Write-Host "   ✅ All services are running" -ForegroundColor Green
        foreach ($service in $runningServices) {
            Write-Host "      - $($service.Service): $($service.State)" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ⚠️  Some services may not be running" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Error checking services: $_" -ForegroundColor Red
}

# Test 2: Backend Health Check
Write-Host "`n📋 Test 2: Backend Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod http://localhost:5000/health
    if ($health.status -eq "healthy") {
        Write-Host "   ✅ Backend is healthy" -ForegroundColor Green
        Write-Host "      Database: $($health.database)" -ForegroundColor Gray
        Write-Host "      Uptime: $([math]::Round($health.uptime, 2)) seconds" -ForegroundColor Gray
    } else {
        Write-Host "   ❌ Backend is unhealthy" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Cannot connect to backend: $_" -ForegroundColor Red
}

# Test 3: Create Lead #1 (Website Inquiry)
Write-Host "`n📋 Test 3: Creating Lead #1 (Website Inquiry)..." -ForegroundColor Yellow
try {
    $lead1 = @{
        source = "Website Contact Form"
        originalContent = "Hi, I'm interested in your AI-powered lead management system. We're a growing startup with 50 employees and we handle about 200 leads per week. Can we schedule a demo call next week to discuss pricing and features? We're particularly interested in the AI summarization capabilities."
        priority = "High"
    } | ConvertTo-Json

    $result1 = Invoke-RestMethod -Uri http://localhost:5000/api/v1/leads `
        -Method Post `
        -ContentType "application/json" `
        -Body $lead1

    Write-Host "   ✅ Lead created successfully!" -ForegroundColor Green
    Write-Host "      ID: $($result1.data._id)" -ForegroundColor Gray
    Write-Host "      Source: $($result1.data.source)" -ForegroundColor Gray
    Write-Host "      Priority: $($result1.data.priority)" -ForegroundColor Gray
    Write-Host "      AI Summary:" -ForegroundColor Cyan
    Write-Host "      $($result1.data.aiSummary)" -ForegroundColor White
} catch {
    Write-Host "   ❌ Failed to create lead: $_" -ForegroundColor Red
}

# Test 4: Create Lead #2 (LinkedIn Message)
Write-Host "`n📋 Test 4: Creating Lead #2 (LinkedIn Message)..." -ForegroundColor Yellow
try {
    $lead2 = @{
        source = "LinkedIn Message"
        originalContent = "Hello! Came across your profile. We're looking for a lead intelligence solution for our sales team. Currently processing 500+ leads monthly. Would love to connect and learn more about your platform."
        priority = "Medium"
    } | ConvertTo-Json

    $result2 = Invoke-RestMethod -Uri http://localhost:5000/api/v1/leads `
        -Method Post `
        -ContentType "application/json" `
        -Body $lead2

    Write-Host "   ✅ Lead created successfully!" -ForegroundColor Green
    Write-Host "      ID: $($result2.data._id)" -ForegroundColor Gray
    Write-Host "      AI Summary:" -ForegroundColor Cyan
    Write-Host "      $($result2.data.aiSummary)" -ForegroundColor White
} catch {
    Write-Host "   ❌ Failed to create lead: $_" -ForegroundColor Red
}

# Test 5: Create Lead #3 (Email Inquiry)
Write-Host "`n📋 Test 5: Creating Lead #3 (Email Inquiry)..." -ForegroundColor Yellow
try {
    $lead3 = @{
        source = "Email"
        originalContent = "Looking for pricing information on your enterprise plan. Need to handle high volume of leads with automated qualification."
        priority = "Medium"
    } | ConvertTo-Json

    $result3 = Invoke-RestMethod -Uri http://localhost:5000/api/v1/leads `
        -Method Post `
        -ContentType "application/json" `
        -Body $lead3

    Write-Host "   ✅ Lead created successfully!" -ForegroundColor Green
    Write-Host "      ID: $($result3.data._id)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Failed to create lead: $_" -ForegroundColor Red
}

# Test 6: Fetch All Leads
Write-Host "`n📋 Test 6: Fetching All Leads..." -ForegroundColor Yellow
try {
    $allLeads = Invoke-RestMethod http://localhost:5000/api/v1/leads
    Write-Host "   ✅ Found $($allLeads.data.Count) total leads" -ForegroundColor Green
    Write-Host "      High Priority: $(($allLeads.data | Where-Object { $_.priority -eq 'High' }).Count)" -ForegroundColor Gray
    Write-Host "      Medium Priority: $(($allLeads.data | Where-Object { $_.priority -eq 'Medium' }).Count)" -ForegroundColor Gray
    Write-Host "      New Status: $(($allLeads.data | Where-Object { $_.status -eq 'New' }).Count)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Failed to fetch leads: $_" -ForegroundColor Red
}

# Test 7: Test Filtering
Write-Host "`n📋 Test 7: Testing API Filters..." -ForegroundColor Yellow
try {
    $highPriority = Invoke-RestMethod "http://localhost:5000/api/v1/leads?priority=High"
    Write-Host "   ✅ High priority filter works: $($highPriority.data.Count) leads" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Filter test failed: $_" -ForegroundColor Red
}

# Test 8: Check Frontend
Write-Host "`n📋 Test 8: Checking Frontend..." -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri http://localhost -UseBasicParsing -TimeoutSec 5
    if ($frontend.StatusCode -eq 200) {
        Write-Host "   ✅ Frontend is accessible at http://localhost" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  Frontend check: $_" -ForegroundColor Yellow
}

# Test 9: Check n8n
Write-Host "`n📋 Test 9: Checking n8n..." -ForegroundColor Yellow
try {
    $n8n = Invoke-WebRequest -Uri http://localhost:5678 -UseBasicParsing -TimeoutSec 5
    if ($n8n.StatusCode -eq 200) {
        Write-Host "   ✅ n8n is accessible at http://localhost:5678" -ForegroundColor Green
        Write-Host "      Login: admin / admin123" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ⚠️  n8n check: $_" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    Test Summary                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Your AI Intelligence Hub is working!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Access Points:" -ForegroundColor Cyan
Write-Host "   • Dashboard:  http://localhost" -ForegroundColor White
Write-Host "   • Backend:    http://localhost:5000" -ForegroundColor White
Write-Host "   • n8n:        http://localhost:5678" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Open http://localhost to see your dashboard" -ForegroundColor White
Write-Host "   2. Check the leads you just created" -ForegroundColor White
Write-Host "   3. Set up n8n workflows at http://localhost:5678" -ForegroundColor White
Write-Host ""
