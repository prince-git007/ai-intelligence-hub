# Quick Start Script for AI Intelligence Hub
# Run this script to check your setup and get started

Write-Host "`n🚀 AI Intelligence Hub - Quick Start Check`n" -ForegroundColor Cyan

# Check 1: Docker
Write-Host "1. Checking Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "   ✅ Docker installed: $dockerVersion" -ForegroundColor Green
    
    $dockerRunning = docker ps 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Docker is running" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ❌ Docker not found. Please install Docker Desktop." -ForegroundColor Red
    exit 1
}

# Check 2: Environment file
Write-Host "`n2. Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path "server\.env") {
    Write-Host "   ✅ server/.env file exists" -ForegroundColor Green
    
    # Check for API key
    $envContent = Get-Content "server\.env" -Raw
    if ($envContent -match "GROQ_API_KEY=.*" -and $envContent -notmatch "GROQ_API_KEY=your_") {
        Write-Host "   ✅ Groq API key is configured" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Groq API key not configured" -ForegroundColor Yellow
        Write-Host "      Get your free key at: https://console.groq.com/" -ForegroundColor Gray
    }
} else {
    Write-Host "   ❌ server/.env file not found" -ForegroundColor Red
    Write-Host "      Creating template..." -ForegroundColor Yellow
    
    $envTemplate = @"
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ai-intelligence-hub

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:80

# AI Service Configuration
AI_PROVIDER=groq

# Groq API Key - Get from https://console.groq.com/
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=mixtral-8x7b-32768

# AI Features
ENABLE_AI_SUMMARY=true
ENABLE_AI_PRIORITY=false
"@
    
    $envTemplate | Out-File -FilePath "server\.env" -Encoding utf8
    Write-Host "      ✅ Template created at server/.env" -ForegroundColor Green
    Write-Host "      ⚠️  Please edit server/.env and add your Groq API key!" -ForegroundColor Yellow
}

# Check 3: Services status
Write-Host "`n3. Checking running services..." -ForegroundColor Yellow
try {
    $services = docker-compose ps --services 2>&1
    if ($LASTEXITCODE -eq 0) {
        $running = docker-compose ps --format json 2>&1 | ConvertFrom-Json | Where-Object { $_.State -eq "running" }
        if ($running.Count -gt 0) {
            Write-Host "   ✅ Services are running:" -ForegroundColor Green
            $running | ForEach-Object {
                Write-Host "      - $($_.Service) (port $($_.Ports))" -ForegroundColor Gray
            }
        } else {
            Write-Host "   ⚠️  No services running" -ForegroundColor Yellow
            Write-Host "      Start with: docker-compose up -d" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "   ⚠️  Could not check services" -ForegroundColor Yellow
}

# Summary
Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Get Groq API key: https://console.groq.com/" -ForegroundColor White
Write-Host "   2. Add API key to server/.env" -ForegroundColor White
Write-Host "   3. Start services: docker-compose up -d" -ForegroundColor White
Write-Host "   4. Open dashboard: http://localhost" -ForegroundColor White
Write-Host "`n📚 Full guide: See SETUP-GUIDE.md" -ForegroundColor Gray
Write-Host ""
