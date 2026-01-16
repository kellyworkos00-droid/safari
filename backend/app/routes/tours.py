from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.tour import Tour, TourCategory
from pydantic import BaseModel
from typing import Optional, List
from datetime import date

router = APIRouter()


class TourCreate(BaseModel):
    title: str
    description: str
    category: TourCategory
    destination: str
    duration_days: int
    price_per_person: float
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    min_participants: int = 1
    max_participants: Optional[int] = None
    includes: Optional[str] = None
    excludes: Optional[str] = None
    itinerary: Optional[str] = None
    is_group_tour: bool = False


class TourResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    destination: str
    duration_days: int
    price_per_person: float
    min_participants: int
    max_participants: Optional[int]
    current_participants: int
    is_group_tour: bool
    is_active: bool
    
    class Config:
        from_attributes = True


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_tour(tour_data: TourCreate, db: Session = Depends(get_db)):
    """Create a new tour (Guide/Company only)"""
    
    # TODO: Add authentication to get provider_id
    provider_id = 1  # Placeholder
    
    new_tour = Tour(
        provider_id=provider_id,
        **tour_data.model_dump()
    )
    
    db.add(new_tour)
    db.commit()
    db.refresh(new_tour)
    
    return {
        "message": "Tour created successfully",
        "tour_id": new_tour.id
    }


@router.get("/", response_model=List[TourResponse])
def get_tours(
    skip: int = 0,
    limit: int = 20,
    category: Optional[TourCategory] = None,
    destination: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    db: Session = Depends(get_db)
):
    """Get all tours with filters"""
    
    query = db.query(Tour).filter(Tour.is_active == True)
    
    if category:
        query = query.filter(Tour.category == category)
    
    if destination:
        query = query.filter(Tour.destination.ilike(f"%{destination}%"))
    
    if min_price:
        query = query.filter(Tour.price_per_person >= min_price)
    
    if max_price:
        query = query.filter(Tour.price_per_person <= max_price)
    
    tours = query.offset(skip).limit(limit).all()
    return tours


@router.get("/{tour_id}", response_model=TourResponse)
def get_tour(tour_id: int, db: Session = Depends(get_db)):
    """Get a specific tour by ID"""
    
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour not found"
        )
    
    return tour


@router.put("/{tour_id}")
def update_tour(tour_id: int, tour_data: TourCreate, db: Session = Depends(get_db)):
    """Update a tour (Provider only)"""
    
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour not found"
        )
    
    # TODO: Check if current user is the provider
    
    for key, value in tour_data.model_dump().items():
        setattr(tour, key, value)
    
    db.commit()
    db.refresh(tour)
    
    return {"message": "Tour updated successfully"}


@router.delete("/{tour_id}")
def delete_tour(tour_id: int, db: Session = Depends(get_db)):
    """Soft delete a tour (Provider only)"""
    
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour not found"
        )
    
    # TODO: Check if current user is the provider
    
    tour.is_active = False
    db.commit()
    
    return {"message": "Tour deleted successfully"}
