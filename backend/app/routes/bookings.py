from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.booking import Booking, BookingStatus, PaymentStatus
from pydantic import BaseModel
from typing import List, Optional
import uuid

router = APIRouter()


class BookingCreate(BaseModel):
    tour_id: int
    number_of_people: int
    special_requests: Optional[str] = None


class BookingResponse(BaseModel):
    id: int
    tour_id: int
    number_of_people: int
    total_amount: float
    booking_status: str
    payment_status: str
    booking_reference: str
    
    class Config:
        from_attributes = True


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_booking(booking_data: BookingCreate, db: Session = Depends(get_db)):
    """Create a new booking"""
    
    # TODO: Get current user from auth
    user_id = 1  # Placeholder
    
    # Get tour
    from app.models.tour import Tour
    tour = db.query(Tour).filter(Tour.id == booking_data.tour_id).first()
    
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour not found"
        )
    
    if not tour.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This tour is no longer available"
        )
    
    # Check availability
    if tour.max_participants:
        if tour.current_participants + booking_data.number_of_people > tour.max_participants:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Not enough spots available"
            )
    
    # Calculate total amount
    total_amount = tour.price_per_person * booking_data.number_of_people
    
    # Generate booking reference
    booking_reference = f"SB-{uuid.uuid4().hex[:8].upper()}"
    
    # Create booking
    new_booking = Booking(
        user_id=user_id,
        tour_id=booking_data.tour_id,
        number_of_people=booking_data.number_of_people,
        total_amount=total_amount,
        booking_reference=booking_reference,
        special_requests=booking_data.special_requests,
        booking_status=BookingStatus.PENDING,
        payment_status=PaymentStatus.PENDING
    )
    
    db.add(new_booking)
    
    # Update tour participants count
    tour.current_participants += booking_data.number_of_people
    
    db.commit()
    db.refresh(new_booking)
    
    return {
        "message": "Booking created successfully",
        "booking_id": new_booking.id,
        "booking_reference": new_booking.booking_reference,
        "total_amount": new_booking.total_amount
    }


@router.get("/", response_model=List[BookingResponse])
def get_user_bookings(db: Session = Depends(get_db)):
    """Get all bookings for current user"""
    
    # TODO: Get current user from auth
    user_id = 1  # Placeholder
    
    bookings = db.query(Booking).filter(Booking.user_id == user_id).all()
    return bookings


@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    """Get a specific booking"""
    
    # TODO: Get current user and check ownership
    
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    return booking


@router.post("/{booking_id}/cancel")
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    """Cancel a booking"""
    
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    if booking.booking_status == BookingStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel completed booking"
        )
    
    # Update booking status
    booking.booking_status = BookingStatus.CANCELLED
    
    # Update tour participants count
    from app.models.tour import Tour
    tour = db.query(Tour).filter(Tour.id == booking.tour_id).first()
    if tour:
        tour.current_participants -= booking.number_of_people
    
    db.commit()
    
    return {"message": "Booking cancelled successfully"}
