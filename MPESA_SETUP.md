# M-PESA Integration Setup Guide

## Overview
Complete M-PESA payment integration for Safari Buddy using Safaricom Daraja API (STK Push).

## What's Been Set Up

### Backend Files Created:
1. **`backend/app/services/mpesa.py`** - M-PESA service with:
   - OAuth token generation
   - STK Push (Lipa na M-PESA Online) initiation
   - Payment status query
   - Callback processing

2. **`backend/app/schemas/payment.py`** - Payment schemas for:
   - Payment initiation requests/responses
   - M-PESA callbacks
   - Payment status queries

3. **`backend/app/routes/payments.py`** - Payment API endpoints:
   - `POST /api/payments/initiate` - Initiate M-PESA payment
   - `POST /api/payments/callback` - Handle M-PESA callbacks
   - `POST /api/payments/query` - Query payment status
   - `GET /api/payments/{payment_id}` - Get payment details
   - `GET /api/payments/booking/{booking_id}` - Get all payments for a booking

### Database:
- Payment model already exists in `backend/app/models/payment.py`
- Fields include: M-PESA receipt number, phone number, transaction ID

## Setup Instructions

### 1. Get M-PESA Credentials

#### Sandbox (Testing):
1. Go to https://developer.safaricom.co.ke/
2. Create an account and login
3. Navigate to "My Apps" and create a new app
4. Select "Lipa Na M-Pesa Online" API
5. Copy your credentials:
   - Consumer Key
   - Consumer Secret
   - Passkey (found in test credentials section)

#### Test Credentials:
- **Shortcode**: 174379
- **Test Phone**: 254708374149 (use this for testing)

### 2. Configure Environment Variables

Update your `backend/.env` file:

```env
# M-PESA Configuration
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey_here
MPESA_ENVIRONMENT=sandbox

# Your backend URL (needed for callbacks)
FRONTEND_URL=http://localhost:3000
```

### 3. Install Dependencies

```powershell
# Navigate to backend
cd backend

# Install new dependency
pip install requests==2.32.3

# Or reinstall all dependencies
pip install -r requirements.txt
```

### 4. Update Your Database

The payment model is already created. If you need to apply migrations:

```powershell
# From backend directory
alembic revision --autogenerate -m "Update payment model for mpesa"
alembic upgrade head
```

## API Usage

### Initiate Payment

**Endpoint**: `POST /api/payments/initiate`

**Request**:
```json
{
  "booking_id": 1,
  "phone_number": "254708374149",
  "amount": 1000.00,
  "payment_method": "mpesa"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Payment initiated successfully. Please check your phone for M-PESA prompt.",
  "merchant_request_id": "29115-34620561-1",
  "checkout_request_id": "ws_CO_191220191020363925",
  "response_code": "0",
  "customer_message": "Success. Request accepted for processing"
}
```

### Query Payment Status

**Endpoint**: `POST /api/payments/query`

**Request**:
```json
{
  "checkout_request_id": "ws_CO_191220191020363925"
}
```

**Response**:
```json
{
  "success": true,
  "result_code": 0,
  "result_desc": "The service request is processed successfully.",
  "merchant_request_id": "29115-34620561-1",
  "checkout_request_id": "ws_CO_191220191020363925"
}
```

## Testing Flow

### 1. Test in Sandbox Mode

```python
# Example test using httpx or requests
import requests

# Login first
login_response = requests.post(
    "http://localhost:8000/api/auth/login",
    json={"email": "tourist@example.com", "password": "password"}
)
token = login_response.json()["access_token"]

# Initiate payment
payment_response = requests.post(
    "http://localhost:8000/api/payments/initiate",
    headers={"Authorization": f"Bearer {token}"},
    json={
        "booking_id": 1,
        "phone_number": "254708374149",
        "amount": 100.00,
        "payment_method": "mpesa"
    }
)

print(payment_response.json())
```

### 2. M-PESA Prompt
- User receives STK push on their phone
- They enter their M-PESA PIN
- Payment is processed
- Callback is sent to your server

### 3. Check Payment Status
```python
# Query payment status
query_response = requests.post(
    "http://localhost:8000/api/payments/query",
    headers={"Authorization": f"Bearer {token}"},
    json={
        "checkout_request_id": "ws_CO_191220191020363925"
    }
)

print(query_response.json())
```

## Callback Configuration

### Local Development
For local testing, you'll need to expose your localhost to the internet for callbacks:

**Option 1: ngrok**
```powershell
# Install ngrok from https://ngrok.com/
ngrok http 8000

# Update your callback URL in the code to use ngrok URL
# e.g., https://abc123.ngrok.io/api/payments/callback
```

**Option 2: Use sandbox simulation**
- Safaricom sandbox provides a simulation tool
- You can manually trigger callbacks for testing

### Production
- Deploy your backend to a public URL
- Update callback URL in the payment initiation
- Register your callback URLs with Safaricom

## Frontend Integration Example

Create a payment component in your Next.js frontend:

```typescript
// frontend/src/components/PaymentButton.tsx
'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export function PaymentButton({ bookingId, amount }: { bookingId: number; amount: number }) {
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await api.post('/payments/initiate', {
        booking_id: bookingId,
        phone_number: phoneNumber,
        amount: amount,
        payment_method: 'mpesa'
      });

      if (response.data.success) {
        alert('Payment initiated! Check your phone for M-PESA prompt.');
        // Optionally poll for payment status
        pollPaymentStatus(response.data.checkout_request_id);
      } else {
        alert('Payment failed: ' + response.data.message);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (checkoutRequestId: string) => {
    // Poll every 5 seconds for up to 2 minutes
    let attempts = 0;
    const maxAttempts = 24;

    const interval = setInterval(async () => {
      attempts++;
      
      try {
        const response = await api.post('/payments/query', {
          checkout_request_id: checkoutRequestId
        });

        if (response.data.result_code === 0) {
          clearInterval(interval);
          alert('Payment successful!');
          window.location.reload(); // Refresh to show updated booking status
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          alert('Payment status unknown. Please check your bookings.');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 5000);
  };

  return (
    <div className="space-y-4">
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Phone (254XXXXXXXXX)"
        className="w-full px-4 py-2 border rounded"
      />
      <button
        onClick={handlePayment}
        disabled={loading || !phoneNumber}
        className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay KES ${amount} via M-PESA`}
      </button>
    </div>
  );
}
```

## Production Checklist

Before going live:

- [ ] Apply for Go Live on Safaricom Developer Portal
- [ ] Get production credentials (different from sandbox)
- [ ] Update `MPESA_ENVIRONMENT=production` in .env
- [ ] Update consumer key, secret, shortcode, and passkey
- [ ] Use your actual business shortcode
- [ ] Set up proper callback URLs with SSL (https)
- [ ] Implement proper error handling and logging
- [ ] Test thoroughly with real transactions
- [ ] Set up monitoring for callback failures
- [ ] Implement reconciliation system

## Troubleshooting

### Common Issues:

1. **Invalid Access Token**
   - Check consumer key/secret are correct
   - Ensure no extra spaces in credentials

2. **Invalid Shortcode**
   - Use 174379 for sandbox
   - Use your business shortcode for production

3. **Callback Not Received**
   - Check callback URL is publicly accessible
   - Use ngrok for local testing
   - Check server logs for errors

4. **Payment Fails Immediately**
   - Verify phone number format (254XXXXXXXXX)
   - Check sufficient balance in test account
   - Ensure passkey is correct

5. **Database Errors**
   - Run migrations: `alembic upgrade head`
   - Check database connection

## Support

- Safaricom Developer Portal: https://developer.safaricom.co.ke/
- API Documentation: https://developer.safaricom.co.ke/APIs/MpesaExpressSimulate
- Developer Support: apisupport@safaricom.co.ke

## Security Notes

- Never commit API keys to version control
- Use environment variables for all credentials
- Validate all webhook callbacks
- Implement rate limiting on payment endpoints
- Log all transactions for reconciliation
- Use HTTPS in production
- Validate payment amounts match booking amounts
- Implement idempotency for duplicate requests
