# Install all dependencies for Safari Buddy
Write-Host "Installing Safari Buddy Dependencies..." -ForegroundColor Yellow

# Backend
Write-Host "`nInstalling Backend (Python) Dependencies..." -ForegroundColor Green
Set-Location backend
..\..venv\Scripts\python.exe -m pip install -r requirements.txt

# Frontend
Write-Host "`nInstalling Frontend (Node.js) Dependencies..." -ForegroundColor Cyan
Set-Location ../frontend
npm install

Set-Location ..
Write-Host "`nAll dependencies installed successfully!" -ForegroundColor Green
Write-Host "Run './start-backend.ps1' and './start-frontend.ps1' in separate terminals to start the app."
