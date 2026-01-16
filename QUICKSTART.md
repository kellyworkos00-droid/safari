# 🚀 Quick Start Guide

## Safari Buddy - Tourism Platform Setup

### ✅ What's Already Done

Your Safari Buddy project is fully scaffolded with:

- ✅ Next.js 14 frontend (TypeScript + Tailwind CSS)
- ✅ FastAPI backend with Python
- ✅ Complete database models (Users, Tours, Bookings, Reviews, Payments)
- ✅ Authentication system (JWT)
- ✅ API endpoints for all core features
- ✅ Beautiful landing page
- ✅ Project documentation

---

## 📋 Next Steps to Get Running

### 1. Setup Neon Database (5 minutes)

1. Go to [neon.tech](https://neon.tech) and create free account
2. Create new project: **Safari Buddy**
3. Copy the connection string (looks like: `postgresql://user:pass@host/dbname`)
4. Create `backend/.env` file:

```env
DATABASE_URL=postgresql://your-connection-string-here
SECRET_KEY=change-this-to-random-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:3000
```

Generate SECRET_KEY with:
```bash
C:/Users/zachn/OneDrive/Desktop/safaribuddy/.venv/Scripts/python.exe -c "import secrets; print(secrets.token_hex(32))"
```

### 2. Create Database Tables (1 minute)

```bash
C:/Users/zachn/OneDrive/Desktop/safaribuddy/.venv/Scripts/python.exe -c "from app.database import engine, Base; from app.models.user import User; from app.models.guide import TourGuide; from app.models.company import Company, CompanyStaff; from app.models.tour import Tour; from app.models.booking import Booking; from app.models.payment import Payment; from app.models.review import Review; Base.metadata.create_all(bind=engine)"
```

Run this from the `backend` directory.

### 3. Setup Frontend Environment (1 minute)

Create `frontend/.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
```

### 4. Install Dependencies (5 minutes)

```bash
# In project root
.\install-dependencies.ps1
```

Or manually:

```bash
# Backend
cd backend
C:/Users/zachn/OneDrive/Desktop/safaribuddy/.venv/Scripts/python.exe -m pip install -r requirements.txt

# Frontend  
cd ../frontend
npm install
```

### 5. Start Development Servers

Open TWO terminals:

**Terminal 1 - Backend:**
```bash
.\start-backend.ps1
```

Or manually:
```bash
cd backend
C:/Users/zachn/OneDrive/Desktop/safaribuddy/.venv/Scripts/python.exe main.py
```

Backend will run at: **http://localhost:8000**  
API Docs at: **http://localhost:8000/docs**

**Terminal 2 - Frontend:**
```bash
.\start-frontend.ps1
```

Or manually:
```bash
cd frontend
npm run dev
```

Frontend will run at: **http://localhost:3000**

---

## 🧪 Test the App

### 1. Visit Landing Page
Open **http://localhost:3000** - You should see the Safari Buddy homepage

### 2. Test Backend API
Open **http://localhost:8000/docs** - Interactive API documentation

### 3. Create Test User
Use the API docs or:

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phone": "254712345678",
    "password": "password123",
    "full_name": "Test User",
    "role": "tourist"
  }'
```

### 4. Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 📁 Project Structure

```
safaribuddy/
├── frontend/          # Next.js app
│   ├── src/
│   │   ├── app/      # Pages (page.tsx = landing)
│   │   ├── components/ # React components
│   │   ├── lib/      # API services
│   │   └── types/    # TypeScript types
│
├── backend/           # FastAPI app
│   ├── app/
│   │   ├── models/   # Database models
│   │   │   ├── user.py
│   │   │   ├── guide.py
│   │   │   ├── company.py
│   │   │   ├── tour.py
│   │   │   ├── booking.py
│   │   │   ├── payment.py
│   │   │   └── review.py
│   │   ├── routes/   # API endpoints
│   │   │   ├── auth.py
│   │   │   ├── tours.py
│   │   │   ├── bookings.py
│   │   │   └── reviews.py
│   │   ├── utils/    # Helper functions
│   │   ├── config.py
│   │   └── database.py
│   └── main.py       # App entry point
│
├── README.md          # Full documentation
└── QUICKSTART.md      # This file
```

---

## 🎯 What to Build Next

### Immediate (This Week)
1. ✅ Setup database ← DO THIS FIRST
2. Create login/register pages in frontend
3. Create tours listing page
4. Test user registration flow

### Short-term (This Month)
1. Add authentication to frontend (NextAuth.js)
2. Create tour details page
3. Add booking flow
4. Build user dashboard
5. Add protected routes

### Medium-term (2-3 Months)
1. M-PESA payment integration
2. Image uploads (Cloudinary)
3. Email notifications
4. Admin dashboard
5. Mobile-responsive design refinement

---

## 🐛 Troubleshooting

### Backend won't start
- Check Python path: `C:/Users/zachn/OneDrive/Desktop/safaribuddy/.venv/Scripts/python.exe --version`
- Verify .env file exists in `backend/` folder
- Check DATABASE_URL is valid

### Frontend won't start
- Run `npm install` in frontend folder
- Check port 3000 is not in use
- Verify node version: `node --version` (should be 18+)

### Database connection error
- Verify Neon connection string is correct
- Check your internet connection
- Ensure DATABASE_URL has no extra spaces

### Import errors
- From backend directory, run the create tables command again
- Make sure all models are imported in the command

---

## 📚 Resources

- **Full Documentation**: See [README.md](README.md)
- **API Docs**: http://localhost:8000/docs (when backend is running)
- **Next.js Docs**: https://nextjs.org/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## 🆘 Need Help?

1. Check [README.md](README.md) for detailed instructions
2. Review API documentation at `/docs`
3. Check terminal output for error messages
4. Verify all environment variables are set

---

## ✅ Success Checklist

- [ ] Neon database created and connected
- [ ] Backend `.env` file configured
- [ ] Frontend `.env.local` file configured
- [ ] Database tables created
- [ ] Dependencies installed (backend + frontend)
- [ ] Backend running at port 8000
- [ ] Frontend running at port 3000
- [ ] Can access landing page
- [ ] Can access API docs
- [ ] Test user registration works

Once all checked, you're ready to start building! 🎉

---

**Made with ❤️ for Kenyan Tourism**
