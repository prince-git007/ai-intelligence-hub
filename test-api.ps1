# Test Script for AI Intelligence Hub API

Write-Host "`n=== AI Intelligence Hub API Tests ===`n" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri http://localhost:5000/health
    Write-Host "   ✅ Health Check: $($health.message)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Health Check Failed: $_" -ForegroundColor Red
}

# Test 2: Create a Test Lead
Write-Host "`n2. Creating Test Lead..." -ForegroundColor Yellow
try {
    $body = @{
        source = "PowerShell Test"
        originalContent = "This is a test lead created via API"
        aiSummary = "Test lead for demonstration"
        priority = "High"
        status = "New"
    } | ConvertTo-Json

    $lead = Invoke-RestMethod -Uri http://localhost:5000/api/webhook `
        -Method Post `
        -ContentType "application/json" `
        -Body $body
    
    Write-Host "   ✅ Lead Created: $($lead.data._id)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Create Lead Failed: $_" -ForegroundColor Red
}

# Test 3: Fetch All Leads
Write-Host "`n3. Fetching All Leads..." -ForegroundColor Yellow
try {
    $leads = Invoke-RestMethod -Uri http://localhost:5000/api/leads
    Write-Host "   ✅ Found $($leads.count) lead(s)" -ForegroundColor Green
    
    if ($leads.count -gt 0) {
        Write-Host "`n   Recent Leads:" -ForegroundColor Cyan
        foreach ($lead in $leads.data | Select-Object -First 3) {
            Write-Host "   - [$($lead.priority)] $($lead.source): $($lead.originalContent.Substring(0, [Math]::Min(50, $lead.originalContent.Length)))..." -ForegroundColor White
        }
    }
} catch {
    Write-Host "   ❌ Fetch Leads Failed: $_" -ForegroundColor Red
}

Write-Host "`n=== Tests Complete ===`n" -ForegroundColor Cyan
Write-Host "Services are running at:" -ForegroundColor Green
Write-Host "  • Backend API: http://localhost:5000" -ForegroundColor White
Write-Host "  • n8n:         http://localhost:5678 (admin/admin123)" -ForegroundColor White
Write-Host "  • MongoDB:     mongodb://localhost:27017" -ForegroundColor White
