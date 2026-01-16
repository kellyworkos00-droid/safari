from sqlalchemy import Column, Integer, String, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from app.database import Base


class TourGuide(Base):
    __tablename__ = "tour_guides"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    license_number = Column(String, unique=True, nullable=False)
    bio = Column(Text)
    languages_spoken = Column(String)  # Comma-separated
    specializations = Column(String)  # Comma-separated
    hourly_rate = Column(Float)
    experience_years = Column(Integer)
    certifications = Column(Text)  # JSON string
    
    # Relationship
    user = relationship("User", backref="guide_profile")
