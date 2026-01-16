"""Payment routes for M-PESA integration"""
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Request
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.payment import Payment, PaymentStatus, PaymentMethod
from app.models.booking import Booking
from app.schemas.payment import (
    InitiatePaymentRequest,
    InitiatePaymentResponse,
    PaymentCallbackRequest,
    PaymentStatusResponse,
    QueryPaymentRequest,
    QueryPaymentResponse,
    PaymentListResponse
)
from app.services.mpesa import mpesa_service
from app.utils.auth import get_current_user
from app.models.user import User
from app.config import get_settings
import json
from datetime import datetime

router = APIRouter(prefix="/payments", tags=["payments"])
settings = get_settings()


@router.post("/initiate", response_model=InitiatePaymentResponse)
async def initiate_payment(
    payment_request: InitiatePaymentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Initiate M-PESA STK Push payment
    """
    # Verify booking exists and belongs to user
    booking = db.query(Booking).filter(Booking.id == payment_request.booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Check if user owns the booking
    if booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to make payment for this booking"
        )
    
    # Create payment record
    payment = Payment(
        booking_id=booking.id,
        amount=payment_request.amount,
        payment_method=PaymentMethod.MPESA,
        payment_status=PaymentStatus.PENDING,
        phone_number=payment_request.phone_number
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    
    # Generate callback URL
    callback_url = f"{settings.FRONTEND_URL}/api/payments/callback"
    
    # Initiate STK Push
    result = mpesa_service.stk_push(
        phone_number=payment_request.phone_number,
        amount=payment_request.amount,
        account_reference=f"BOOKING-{booking.id}",
        transaction_desc=f"Payment for Safari Buddy booking #{booking.id}",
        callback_url=callback_url
    )
    
    if result.get("success"):
        data = result.get("data", {})
        
        # Store M-PESA reference
        payment.mpesa_reference = data.get("CheckoutRequestID")
        payment.transaction_id = data.get("MerchantRequestID")
        db.commit()
        
        return InitiatePaymentResponse(
            success=True,
            message="Payment initiated successfully. Please check your phone for M-PESA prompt.",
            merchant_request_id=data.get("MerchantRequestID"),
            checkout_request_id=data.get("CheckoutRequestID"),
            response_code=data.get("ResponseCode"),
            response_description=data.get("ResponseDescription"),
            customer_message=data.get("CustomerMessage")
        )
    else:
        # Update payment status to failed
        payment.payment_status = PaymentStatus.FAILED
        payment.payment_details = json.dumps(result)
        db.commit()
        
        return InitiatePaymentResponse(
            success=False,
            message=result.get("message", "Payment initiation failed")
        )


@router.post("/callback")
async def payment_callback(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Handle M-PESA payment callback
    This endpoint is called by Safaricom when payment is completed
    """
    try:
        callback_data = await request.json()
        
        # Process callback
        payment_info = mpesa_service.process_callback(callback_data)
        
        # Find payment by checkout request ID
        checkout_request_id = payment_info.get("checkout_request_id")
        payment = db.query(Payment).filter(
            Payment.mpesa_reference == checkout_request_id
        ).first()
        
        if not payment:
            return {
                "ResultCode": 1,
                "ResultDesc": "Payment record not found"
            }
        
        # Update payment status
        if payment_info.get("success"):
            payment.payment_status = PaymentStatus.COMPLETED
            payment.mpesa_receipt_number = payment_info.get("mpesa_receipt_number")
            payment.payment_details = json.dumps(payment_info)
            
            # Update booking status to confirmed
            booking = db.query(Booking).filter(Booking.id == payment.booking_id).first()
            if booking:
                booking.status = "confirmed"
        else:
            payment.payment_status = PaymentStatus.FAILED
            payment.payment_details = json.dumps(payment_info)
        
        db.commit()
        
        return {
            "ResultCode": 0,
            "ResultDesc": "Success"
        }
    
    except Exception as e:
        print(f"Error processing callback: {e}")
        return {
            "ResultCode": 1,
            "ResultDesc": f"Error: {str(e)}"
        }


@router.post("/query", response_model=QueryPaymentResponse)
async def query_payment_status(
    query_request: QueryPaymentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Query the status of an M-PESA payment
    """
    # Find payment by checkout request ID
    payment = db.query(Payment).filter(
        Payment.mpesa_reference == query_request.checkout_request_id
    ).first()
    
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    # Verify user owns the booking
    booking = db.query(Booking).filter(Booking.id == payment.booking_id).first()
    if booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to query this payment"
        )
    
    # Query M-PESA
    result = mpesa_service.stk_push_query(query_request.checkout_request_id)
    
    if result.get("success"):
        data = result.get("data", {})
        
        # Update payment status if completed
        result_code = data.get("ResultCode")
        if result_code == "0":
            payment.payment_status = PaymentStatus.COMPLETED
            db.commit()
        
        return QueryPaymentResponse(
            success=True,
            result_code=data.get("ResultCode"),
            result_desc=data.get("ResultDesc"),
            merchant_request_id=data.get("MerchantRequestID"),
            checkout_request_id=data.get("CheckoutRequestID")
        )
    else:
        return QueryPaymentResponse(
            success=False
        )


@router.get("/{payment_id}", response_model=PaymentStatusResponse)
async def get_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get payment details by ID
    """
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    # Verify user owns the booking
    booking = db.query(Booking).filter(Booking.id == payment.booking_id).first()
    if booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this payment"
        )
    
    return PaymentStatusResponse(
        payment_id=payment.id,
        booking_id=payment.booking_id,
        amount=payment.amount,
        payment_method=payment.payment_method.value,
        payment_status=payment.payment_status.value,
        mpesa_receipt_number=payment.mpesa_receipt_number,
        transaction_id=payment.transaction_id,
        phone_number=payment.phone_number,
        created_at=payment.created_at,
        updated_at=payment.updated_at
    )


@router.get("/booking/{booking_id}", response_model=PaymentListResponse)
async def get_booking_payments(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all payments for a booking
    """
    # Verify booking exists and belongs to user
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    if booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view these payments"
        )
    
    # Get all payments for booking
    payments = db.query(Payment).filter(Payment.booking_id == booking_id).all()
    
    payment_responses = [
        PaymentStatusResponse(
            payment_id=p.id,
            booking_id=p.booking_id,
            amount=p.amount,
            payment_method=p.payment_method.value,
            payment_status=p.payment_status.value,
            mpesa_receipt_number=p.mpesa_receipt_number,
            transaction_id=p.transaction_id,
            phone_number=p.phone_number,
            created_at=p.created_at,
            updated_at=p.updated_at
        )
        for p in payments
    ]
    
    return PaymentListResponse(
        payments=payment_responses,
        total=len(payment_responses),
        page=1,
        page_size=len(payment_responses)
    )
