# Safari Buddy - Tourism Platform 🦁

Full-stack tourism platform connecting tourists with tour guides and companies in Kenya.

## 🚀 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **NextAuth.js** (Authentication)
- **Axios** (API calls)

### Backend
- **Python 3.10+**
- **FastAPI** (REST API)
- **SQLAlchemy** (ORM)
- **Pydantic** (Validation)
- **JWT** (Authentication)

### Database
- **Neon PostgreSQL** (Serverless Postgres)

### Payments
- **M-PESA Daraja API** (Mobile payments)

---

## 📁 Project Structure

```
safaribuddy/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   ├── lib/             # API clients & utilities
│   │   └── types/           # TypeScript types
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API endpoints
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   ├── config.py       # Configuration
│   │   └── database.py     # Database setup
│   ├── main.py             # FastAPI app entry
│   └── requirements.txt
│
└── .github/
    └── copilot-instructions.md
```

---

## 🏗️ Setup Instructions

### Prerequisites
- **Node.js 18+** and npm
- **Python 3.10+**
- **PostgreSQL** (Neon account recommended)
- **Git**

### 1. Clone the Repository

```bash
cd safaribuddy
```

### 2. Backend Setup

#### Create Virtual Environment
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
# Database (Get from Neon Dashboard)
DATABASE_URL=postgresql://user:password@host/dbname

# JWT Secret (Generate with: openssl rand -hex 32)
SECRET_KEY=your-secret-key-here

# Frontend URL
FRONTEND_URL=http://localhost:3000

# M-PESA (Get from Daraja Portal)
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
MPESA_ENVIRONMENT=sandbox
```

#### Create Database Tables
```bash
# Create database tables
python -c "from app.database import engine, Base; from app.models import *; Base.metadata.create_all(bind=engine)"
```

#### Run Backend Server
```bash
python main.py
```

Backend API will be available at: **http://localhost:8000**  
API Documentation: **http://localhost:8000/docs**

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

#### Configure Environment Variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

#### Run Frontend Server
```bash
npm run dev
```

Frontend will be available at: **http://localhost:3000**

---

## 👥 User Roles & Features

### 1. **Tourist** (Regular User)
- Browse destinations and tours
- Search and filter tours
- Join group tours
- Book tours and accommodations
- Make M-PESA payments
- Leave reviews and ratings
- Chat with guides
- View booking history

### 2. **Tour Guide** (Individual)
**Registration Requirements:**
- Valid tour guide license
- Government-issued ID
- Professional certifications
- Background check

**Capabilities:**
- Create and manage tour offerings
- Set rates and availability
- Accept/decline bookings
- Receive payments
- View earnings dashboard
- Build reputation through reviews

### 3. **Tour Company**
**Registration Requirements:**
- Business registration certificate
- Tourism license
- Tax compliance (KRA PIN)
- Insurance documents

**Capabilities:**
- All guide features PLUS:
- Manage multiple staff accounts
- Create complex tour packages
- Manage fleet (vehicles, equipment)
- Advanced analytics dashboard
- Company branding

### 4. **Admin**
- Review and approve registrations
- Verify documents
- Monitor platform activity
- Handle disputes
- Manage content

---

## 🗄️ Database Schema

### Core Tables

**users**
- Multi-role authentication
- Roles: tourist, guide, company, admin
- Status: active, pending, suspended

**tour_guides**
- Extended profile for guides
- License information
- Rates and specializations

**companies**
- Company registration details
- Staff management
- License verification

**tours**
- Tour listings
- Categories, destinations, pricing
- Group tour support
- Availability tracking

**bookings**
- Reservation management
- Status tracking
- Payment integration

**payments**
- M-PESA integration
- Transaction records
- Escrow system

**reviews**
- Rating system (1-5 stars)
- Comments and photos
- Provider reputation

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login and get JWT token
GET    /api/auth/me          - Get current user profile
```

### Tours
```
GET    /api/tours            - List all tours (with filters)
POST   /api/tours            - Create new tour (Guide/Company)
GET    /api/tours/:id        - Get tour details
PUT    /api/tours/:id        - Update tour (Provider only)
DELETE /api/tours/:id        - Delete tour (Provider only)
```

### Bookings
```
GET    /api/bookings         - Get user bookings
POST   /api/bookings         - Create new booking
GET    /api/bookings/:id     - Get booking details
POST   /api/bookings/:id/cancel - Cancel booking
```

### Reviews
```
POST   /api/reviews          - Create review
GET    /api/reviews/provider/:id - Get provider reviews
GET    /api/reviews/provider/:id/stats - Get review stats
```

---

## 💳 M-PESA Integration

### Setup Daraja API
1. Register at [Daraja Portal](https://developer.safaricom.co.ke/)
2. Create a new app (Sandbox for testing)
3. Get Consumer Key and Secret
4. Get Lipa Na M-PESA Online credentials
5. Add to backend `.env` file

### Payment Flow
1. User initiates booking
2. Backend generates payment request
3. STK Push sent to user's phone
4. User enters M-PESA PIN
5. Payment confirmation received
6. Booking confirmed
7. Funds held in escrow until trip completion

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel deploy
```

### Backend (Railway/Render)
```bash
cd backend
# Push to GitHub
# Connect to Railway/Render
# Add environment variables
# Deploy
```

### Database (Neon)
1. Create account at [Neon](https://neon.tech)
2. Create new project
3. Copy connection string
4. Update `DATABASE_URL` in backend `.env`

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 📝 Development Workflow

### Branch Strategy
- `main` - Production
- `develop` - Development
- `feature/*` - New features
- `bugfix/*` - Bug fixes

### Commit Convention
```
feat: Add user registration
fix: Resolve payment bug
docs: Update README
style: Format code
refactor: Restructure API
test: Add booking tests
```

---

## 🔐 Security

- JWT authentication with secure tokens
- Password hashing with bcrypt
- SQL injection protection (SQLAlchemy ORM)
- CORS configuration
- Environment variable management
- API rate limiting
- Input validation (Pydantic)
- Escrow payment system

---

## 📊 Features Roadmap

### Phase 1 (MVP) ✅
- [x] User registration (all roles)
- [x] Tour listings
- [x] Basic booking system
- [x] Review system
- [x] Database models
- [x] API endpoints

### Phase 2 (Q1 2026)
- [ ] M-PESA payment integration
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Advanced search filters
- [ ] Real-time chat
- [ ] Image uploads (Cloudinary)

### Phase 3 (Q2 2026)
- [ ] Group tour matching
- [ ] Travel buddy finder
- [ ] Itinerary planner
- [ ] Transport integration (SGR, buses)
- [ ] Accommodation bookings
- [ ] Mobile app (React Native)

### Phase 4 (Q3 2026)
- [ ] Loyalty program
- [ ] Referral system
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Travel insurance
- [ ] API for third parties

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Authors

**Safari Buddy Team**
- Email: support@safaribuddy.co.ke
- Website: https://safaribuddy.co.ke

---

## 🙏 Acknowledgments

- Kenya Tourism Board
- Tour guides and companies who provided feedback
- Open source community
- Neon for serverless PostgreSQL
- Safaricom for M-PESA API

---

## 📞 Support

For support, email support@safaribuddy.co.ke or join our Slack channel.

---

**Made with ❤️ in Kenya 🇰🇪**
