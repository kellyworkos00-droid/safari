# Create Database Tables for Safari Buddy
Write-Host "Creating Safari Buddy Database Tables..." -ForegroundColor Yellow

Set-Location backend

$pythonPath = "C:/Users/zachn/OneDrive/Desktop/safaribuddy/.venv/Scripts/python.exe"

Write-Host "`nImporting models and creating tables..." -ForegroundColor Cyan

& $pythonPath -c @"
import sys
sys.path.insert(0, '.')
from app.database import engine, Base
from app.models.user import User
from app.models.guide import TourGuide
from app.models.company import Company, CompanyStaff
from app.models.tour import Tour
from app.models.booking import Booking
from app.models.payment import Payment
from app.models.review import Review

print('Creating all tables...')
Base.metadata.create_all(bind=engine)
print('✓ Tables created successfully!')
"@

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Database tables created successfully!" -ForegroundColor Green
    Write-Host "You can now start the backend server with: .\start-backend.ps1" -ForegroundColor Cyan
} else {
    Write-Host "`n✗ Error creating tables. Check your DATABASE_URL in backend/.env" -ForegroundColor Red
}

Set-Location ..
