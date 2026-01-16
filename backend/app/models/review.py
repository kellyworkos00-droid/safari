from sqlalchemy import Column, Integer, Float, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Guide or Company
    
    rating = Column(Float, nullable=False)  # 1-5
    comment = Column(Text)
    photos = Column(Text)  # JSON array of photo URLs
    
    helpful_count = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    booking = relationship("Booking", backref="review")
    user = relationship("User", foreign_keys=[user_id], backref="reviews_given")
    target = relationship("User", foreign_keys=[target_id], backref="reviews_received")
