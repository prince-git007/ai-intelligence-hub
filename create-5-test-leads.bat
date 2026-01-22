@echo off
echo.
echo ========================================
echo   Creating 5 Test Leads
echo ========================================
echo.

powershell -Command "$lead1 = '{\"source\":\"WhatsApp Test\",\"originalContent\":\"Hi! I need help with my order. It hasn not arrived yet!\",\"priority\":\"High\"}'; Invoke-RestMethod -Uri http://localhost:5000/api/v1/leads -Method Post -Body $lead1 -ContentType 'application/json' | Out-Null; Write-Host 'Lead 1/5 created' -ForegroundColor Green"

powershell -Command "$lead2 = '{\"source\":\"Instagram DM\",\"originalContent\":\"Do you ship to Canada? I love your products!\",\"priority\":\"Medium\"}'; Invoke-RestMethod -Uri http://localhost:5000/api/v1/leads -Method Post -Body $lead2 -ContentType 'application/json' | Out-Null; Write-Host 'Lead 2/5 created' -ForegroundColor Green"

powershell -Command "$lead3 = '{\"source\":\"Email\",\"originalContent\":\"I am interested in your services. Can we schedule a demo?\",\"priority\":\"High\"}'; Invoke-RestMethod -Uri http://localhost:5000/api/v1/leads -Method Post -Body $lead3 -ContentType 'application/json' | Out-Null; Write-Host 'Lead 3/5 created' -ForegroundColor Green"

powershell -Command "$lead4 = '{\"source\":\"Facebook\",\"originalContent\":\"Just browsing. Nice page!\",\"priority\":\"Low\"}'; Invoke-RestMethod -Uri http://localhost:5000/api/v1/leads -Method Post -Body $lead4 -ContentType 'application/json' | Out-Null; Write-Host 'Lead 4/5 created' -ForegroundColor Green"

powershell -Command "$lead5 = '{\"source\":\"Website Form\",\"originalContent\":\"Please send me pricing information for 50 users.\",\"priority\":\"Medium\"}'; Invoke-RestMethod -Uri http://localhost:5000/api/v1/leads -Method Post -Body $lead5 -ContentType 'application/json' | Out-Null; Write-Host 'Lead 5/5 created' -ForegroundColor Green"

echo.
echo ========================================
echo   Done! 5 leads created
echo ========================================
echo.
echo Open your browser: http://localhost
echo Press: Ctrl + Shift + R to refresh
echo.
pause
