from sqlalchemy import Column, Integer, String, Text, Float, Date, ForeignKey, Boolean, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class TourCategory(str, enum.Enum):
    WILDLIFE = "wildlife"
    BEACH = "beach"
    MOUNTAIN = "mountain"
    CULTURAL = "cultural"
    ADVENTURE = "adventure"
    WELLNESS = "wellness"
    CITY = "city"
    ROAD_TRIP = "road_trip"


class Tour(Base):
    __tablename__ = "tours"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(SQLEnum(TourCategory), nullable=False)
    
    destination = Column(String, nullable=False)
    duration_days = Column(Integer, nullable=False)
    price_per_person = Column(Float, nullable=False)
    
    start_date = Column(Date)
    end_date = Column(Date)
    
    min_participants = Column(Integer, default=1)
    max_participants = Column(Integer)
    current_participants = Column(Integer, default=0)
    
    includes = Column(Text)  # What's included
    excludes = Column(Text)  # What's not included
    itinerary = Column(Text)  # JSON string
    
    is_group_tour = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    provider = relationship("User", backref="tours")
