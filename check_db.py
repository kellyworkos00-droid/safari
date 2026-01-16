"""Check database connection and tables"""
from sqlalchemy import create_engine, inspect

DATABASE_URL = "postgresql://neondb_owner:npg_b0CLp2DgXlYK@ep-crimson-mud-ah9ummx5-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

try:
    engine = create_engine(DATABASE_URL)
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    print("✓ Connected to Neon database!")
    print(f"\nFound {len(tables)} tables:")
    for table in tables:
        print(f"  - {table}")
    
    if not tables:
        print("  (no tables created yet)")
        
except Exception as e:
    print(f"✗ Error: {e}")
