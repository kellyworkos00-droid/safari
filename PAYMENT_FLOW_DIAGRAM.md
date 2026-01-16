# M-PESA Payment Flow Diagram

## Complete Payment Flow

```
┌─────────────┐
│   Tourist   │
│  (Frontend) │
└──────┬──────┘
       │
       │ 1. Click "Pay with M-PESA"
       │    (booking_id, phone, amount)
       ▼
┌──────────────────────┐
│   Safari Buddy API   │
│ /api/payments/initiate│
└──────┬───────────────┘
       │
       │ 2. Create payment record
       │    (status: PENDING)
       ▼
┌──────────────────┐
│    Database      │
│  Payment Table   │
└──────────────────┘
       │
       │ 3. Call M-PESA API
       ▼
┌──────────────────────────┐
│  Safaricom Daraja API    │
│  STK Push Request        │
│  (OAuth + Request)       │
└──────┬───────────────────┘
       │
       │ 4. Send STK Push
       ▼
┌──────────────────┐
│  Tourist Phone   │
│  M-PESA Prompt   │
│  "Enter PIN"     │
└──────┬───────────┘
       │
       │ 5. User enters PIN
       │
       ▼
┌──────────────────────────┐
│  Safaricom Processing    │
│  - Validate PIN          │
│  - Check balance         │
│  - Process payment       │
└──────┬───────────────────┘
       │
       │ 6. Payment Complete
       │    Send Callback
       ▼
┌──────────────────────────┐
│   Safari Buddy API       │
│ /api/payments/callback   │
└──────┬───────────────────┘
       │
       │ 7. Update payment
       │    - status: COMPLETED
       │    - receipt_number
       ▼
┌──────────────────┐
│    Database      │
│  Payment Table   │
│  Booking (confirmed)
└──────┬───────────┘
       │
       │ 8. Notify user
       ▼
┌─────────────┐
│   Tourist   │
│ "Payment    │
│  Successful"│
└─────────────┘
```

## API Call Sequence

```
Frontend                API                   M-PESA              Database
   │                     │                      │                    │
   │──POST /initiate────▶│                      │                    │
   │                     │                      │                    │
   │                     │──Create Payment─────▶│                    │
   │                     │◀────Payment ID───────│                    │
   │                     │                      │                    │
   │                     │──OAuth Token────────▶│                    │
   │                     │◀────Token────────────│                    │
   │                     │                      │                    │
   │                     │──STK Push Request───▶│                    │
   │                     │◀────Request Sent─────│                    │
   │                     │                      │                    │
   │◀────Response────────│                      │                    │
   │ (CheckoutRequestID) │                      │                    │
   │                     │                      │                    │
   │                     │                   [User enters PIN]       │
   │                     │                      │                    │
   │                     │◀──Payment Callback───│                    │
   │                     │                      │                    │
   │                     │──Update Payment──────────────────────────▶│
   │                     │                      │                    │
   │                     │──200 OK─────────────▶│                    │
   │                     │                      │                    │
   │──GET /payments/{id}─▶│                      │                    │
   │◀────Payment Status───│                      │                    │
   │                     │                      │                    │
```

## Component Interaction

```
┌─────────────────────────────────────────────────────────────┐
│                     Safari Buddy Backend                    │
│                                                             │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  Payments   │───▶│ M-PESA       │───▶│  Safaricom   │  │
│  │  Routes     │    │ Service      │    │  Daraja API  │  │
│  └─────┬───────┘    └──────┬───────┘    └──────────────┘  │
│        │                   │                               │
│        │                   │                               │
│        ▼                   ▼                               │
│  ┌─────────────────────────────┐                          │
│  │     Payment Model           │                          │
│  │  - booking_id               │                          │
│  │  - amount                   │                          │
│  │  - status                   │                          │
│  │  - mpesa_receipt_number     │                          │
│  │  - phone_number             │                          │
│  └─────────────┬───────────────┘                          │
│                │                                           │
└────────────────┼───────────────────────────────────────────┘
                 │
                 ▼
         ┌──────────────┐
         │  PostgreSQL  │
         │   Database   │
         └──────────────┘
```

## Request/Response Flow Detail

### 1. Initiate Payment Request
```json
{
  "booking_id": 1,
  "phone_number": "254708374149",
  "amount": 1000.00,
  "payment_method": "mpesa"
}
```

### 2. STK Push to M-PESA
```json
{
  "BusinessShortCode": "174379",
  "Password": "MTc0Mzc5YmZ...",
  "Timestamp": "20260116123456",
  "TransactionType": "CustomerPayBillOnline",
  "Amount": 1000,
  "PartyA": "254708374149",
  "PartyB": "174379",
  "PhoneNumber": "254708374149",
  "CallBackURL": "https://yourdomain.com/api/payments/callback",
  "AccountReference": "BOOKING-1",
  "TransactionDesc": "Payment for Safari Buddy booking #1"
}
```

### 3. M-PESA Response
```json
{
  "MerchantRequestID": "29115-34620561-1",
  "CheckoutRequestID": "ws_CO_191220191020363925",
  "ResponseCode": "0",
  "ResponseDescription": "Success. Request accepted for processing",
  "CustomerMessage": "Success. Request accepted for processing"
}
```

### 4. M-PESA Callback (After user pays)
```json
{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "29115-34620561-1",
      "CheckoutRequestID": "ws_CO_191220191020363925",
      "ResultCode": 0,
      "ResultDesc": "The service request is processed successfully.",
      "CallbackMetadata": {
        "Item": [
          { "Name": "Amount", "Value": 1000 },
          { "Name": "MpesaReceiptNumber", "Value": "NLJ7RT61SV" },
          { "Name": "TransactionDate", "Value": 20260116123456 },
          { "Name": "PhoneNumber", "Value": 254708374149 }
        ]
      }
    }
  }
}
```

### 5. Database Update
```
Payment Record:
- payment_status: COMPLETED
- mpesa_receipt_number: NLJ7RT61SV
- transaction_id: ws_CO_191220191020363925

Booking Record:
- status: confirmed
```

## Error Handling Flow

```
Payment Initiation
       │
       ├─── Success ────▶ STK Push Sent ────▶ User Pays ────▶ Success
       │                                          │
       │                                          ├─── User Cancels
       │                                          │        │
       │                                          │        ▼
       │                                          │   Status: FAILED
       │                                          │
       │                                          └─── Insufficient Balance
       │                                                   │
       │                                                   ▼
       │                                              Status: FAILED
       │
       └─── API Error ────▶ Log Error ────▶ Return Error
                                │
                                ▼
                          Status: FAILED
```

## Status States

```
PENDING ──────▶ COMPLETED
   │
   │
   └──────────▶ FAILED
```

## File Organization

```
backend/app/
│
├── services/
│   └── mpesa.py          ← Core M-PESA logic
│       ├── get_access_token()
│       ├── generate_password()
│       ├── stk_push()
│       ├── stk_push_query()
│       └── process_callback()
│
├── routes/
│   └── payments.py       ← API endpoints
│       ├── POST /initiate
│       ├── POST /callback
│       ├── POST /query
│       ├── GET /{id}
│       └── GET /booking/{id}
│
├── schemas/
│   └── payment.py        ← Data validation
│       ├── InitiatePaymentRequest
│       ├── InitiatePaymentResponse
│       ├── PaymentCallbackRequest
│       ├── QueryPaymentRequest
│       └── PaymentStatusResponse
│
└── models/
    └── payment.py        ← Database model
        └── Payment
            ├── id
            ├── booking_id
            ├── amount
            ├── payment_method
            ├── payment_status
            ├── mpesa_reference
            ├── mpesa_receipt_number
            └── phone_number
```
