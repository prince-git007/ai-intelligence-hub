#!/usr/bin/env pwsh
# Quick script to add a lead to your AI Intelligence Hub

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "   ADD LEAD TO AI HUB" -ForegroundColor Yellow
Write-Host "================================`n" -ForegroundColor Cyan

# Get user input
Write-Host "📱 Where is this lead from? (WhatsApp, Email, Instagram, Facebook, etc.)" -ForegroundColor White
$source = Read-Host "Source"

Write-Host "`n📝 What is the customer's message?" -ForegroundColor White
$message = Read-Host "Message"

Write-Host "`n⚡ Priority? (High/Medium/Low)" -ForegroundColor White
$priority = Read-Host "Priority"

# Default to Medium if empty
if ([string]::IsNullOrWhiteSpace($priority)) {
    $priority = "Medium"
}

# Create lead
$lead = @{
    source = $source
    originalContent = $message
    priority = $priority
} | ConvertTo-Json

Write-Host "`n🚀 Creating lead..." -ForegroundColor Cyan

try {
    $result = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/leads" `
        -Method Post `
        -Body $lead `
        -ContentType "application/json"
    
    Write-Host "`n✅ SUCCESS! Lead created!" -ForegroundColor Green
    Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "📊 Lead Details:" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "🆔 ID: $($result.data._id)" -ForegroundColor White
    Write-Host "📱 Source: $($result.data.source)" -ForegroundColor White
    Write-Host "⚡ Priority: $($result.data.priority)" -ForegroundColor White
    Write-Host "🆕 Status: $($result.data.status)" -ForegroundColor White
    Write-Host "`n🤖 AI Summary:" -ForegroundColor Magenta
    Write-Host $result.data.aiSummary -ForegroundColor White
    Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    
    # Get total count
    $allLeads = Invoke-RestMethod "http://localhost:5000/api/v1/leads"
    Write-Host "`n📈 Total Leads in System: $($allLeads.pagination.total)" -ForegroundColor Green
    
    Write-Host "`n🖥️  View on dashboard: http://localhost" -ForegroundColor Cyan
    Write-Host "    (Refresh browser to see it)`n" -ForegroundColor Gray
    
} catch {
    Write-Host "`n❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`nIs the server running? Try:" -ForegroundColor Yellow
    Write-Host "docker-compose ps`n" -ForegroundColor White
}

Write-Host "`n💡 Run this script again to add more leads!" -ForegroundColor Cyan
Write-Host "   Or use: .\add-lead-now.ps1`n" -ForegroundColor Gray
