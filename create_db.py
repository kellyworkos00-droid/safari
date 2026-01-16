"""Create database tables"""
import sys
sys.path.insert(0, 'backend')

# Import Base first from database module
from app.database import Base
from sqlalchemy import create_engine

# Import all models to register them with Base
from app.models.user import User
from app.models.guide import TourGuide
from app.models.company import Company, CompanyStaff
from app.models.tour import Tour
from app.models.booking import Booking
from app.models.payment import Payment
from app.models.review import Review

DATABASE_URL = "postgresql://neondb_owner:npg_b0CLp2DgXlYK@ep-crimson-mud-ah9ummx5-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

print("\n" + "="*60)
print("Creating database tables...")
print("="*60 + "\n")

# Create engine
engine = create_engine(DATABASE_URL)

try:
    Base.metadata.create_all(bind=engine)
    print("\n" + "="*60)
    print("SUCCESS: Database tables created!")
    print("="*60)
    print("\nTables created:")
    print("  - users")
    print("  - tour_guides")
    print("  - companies")
    print("  - company_staff")
    print("  - tours")
    print("  - bookings")
    print("  - payments")
    print("  - reviews")
except Exception as e:
    print(f"\nERROR creating tables: {e}")
