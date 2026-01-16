from sqlalchemy import Column, Integer, String, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    company_name = Column(String, nullable=False)
    business_registration_number = Column(String, unique=True, nullable=False)
    license_number = Column(String, unique=True, nullable=False)
    description = Column(Text)
    office_locations = Column(String)  # Comma-separated
    company_size = Column(Integer)
    bank_account_details = Column(Text)  # JSON string, encrypted
    
    # Relationship
    user = relationship("User", backref="company_profile")


class StaffRole(str, enum.Enum):
    ADMIN = "admin"
    OPERATOR = "operator"
    GUIDE = "guide"


class CompanyStaff(Base):
    __tablename__ = "company_staff"

    id = Column(Integer, primary_key=True, index=True)
    staff_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    role = Column(SQLEnum(StaffRole), nullable=False, default=StaffRole.OPERATOR)
    
    # Relationships
    staff_user = relationship("User", foreign_keys=[staff_user_id])
    company = relationship("Company", backref="staff")
