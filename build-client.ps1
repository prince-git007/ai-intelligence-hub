# Build script for React client Docker image (PowerShell)

Write-Host "🔨 Building AI Intelligence Hub Client..." -ForegroundColor Cyan
Write-Host ""

Set-Location client

# Build the Docker image
docker build `
  --build-arg VITE_API_URL=http://server:5000/api `
  -t ai-hub-client:latest .

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "To run the container:" -ForegroundColor Yellow
    Write-Host "  docker run -d -p 80:80 --name ai-hub-client ai-hub-client:latest"
    Write-Host ""
    Write-Host "Or use docker-compose:" -ForegroundColor Yellow
    Write-Host "  docker-compose up -d client"
} else {
    Write-Host ""
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Set-Location ..
