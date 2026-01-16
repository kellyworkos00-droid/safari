"""Payment schemas for request/response validation"""
from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime
from enum import Enum


class PaymentMethodEnum(str, Enum):
    MPESA = "mpesa"
    CARD = "card"
    BANK_TRANSFER = "bank_transfer"
    CASH = "cash"


class PaymentStatusEnum(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"


class InitiatePaymentRequest(BaseModel):
    """Request to initiate a payment"""
    booking_id: int
    phone_number: str = Field(..., description="Phone number in format 254XXXXXXXXX or 07XXXXXXXX")
    amount: float = Field(..., gt=0, description="Amount to pay")
    payment_method: PaymentMethodEnum = PaymentMethodEnum.MPESA
    
    @validator('phone_number')
    def validate_phone_number(cls, v):
        # Remove spaces and special characters
        v = v.replace(" ", "").replace("-", "").replace("+", "")
        
        # Check if it's a valid Kenyan number
        if v.startswith("254"):
            if len(v) != 12:
                raise ValueError("Phone number must be 12 digits when starting with 254")
        elif v.startswith("0"):
            if len(v) != 10:
                raise ValueError("Phone number must be 10 digits when starting with 0")
        else:
            raise ValueError("Phone number must start with 254 or 0")
        
        return v


class InitiatePaymentResponse(BaseModel):
    """Response from payment initiation"""
    success: bool
    message: str
    merchant_request_id: Optional[str] = None
    checkout_request_id: Optional[str] = None
    response_code: Optional[str] = None
    response_description: Optional[str] = None
    customer_message: Optional[str] = None


class PaymentCallbackRequest(BaseModel):
    """M-PESA callback request structure"""
    Body: dict


class PaymentStatusResponse(BaseModel):
    """Payment status response"""
    payment_id: int
    booking_id: int
    amount: float
    payment_method: str
    payment_status: str
    mpesa_receipt_number: Optional[str] = None
    transaction_id: Optional[str] = None
    phone_number: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None


class QueryPaymentRequest(BaseModel):
    """Request to query payment status"""
    checkout_request_id: str = Field(..., description="The CheckoutRequestID from STK Push")


class QueryPaymentResponse(BaseModel):
    """Response from payment status query"""
    success: bool
    result_code: Optional[int] = None
    result_desc: Optional[str] = None
    merchant_request_id: Optional[str] = None
    checkout_request_id: Optional[str] = None


class PaymentCreate(BaseModel):
    """Schema for creating a new payment record"""
    booking_id: int
    amount: float
    payment_method: PaymentMethodEnum
    phone_number: Optional[str] = None
    transaction_id: Optional[str] = None
    mpesa_reference: Optional[str] = None


class PaymentUpdate(BaseModel):
    """Schema for updating a payment record"""
    payment_status: Optional[PaymentStatusEnum] = None
    mpesa_receipt_number: Optional[str] = None
    transaction_id: Optional[str] = None
    payment_details: Optional[str] = None


class PaymentListResponse(BaseModel):
    """Response for listing payments"""
    payments: list[PaymentStatusResponse]
    total: int
    page: int
    page_size: int
