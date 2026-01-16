# Quick Start: M-PESA API Key Setup

## Step 1: Get Your API Keys

1. Visit: https://developer.safaricom.co.ke/
2. Sign up or log in
3. Create a new app
4. Select **"Lipa Na M-Pesa Online"** (STK Push)
5. You'll receive:
   - **Consumer Key**
   - **Consumer Secret** 
   - **Passkey** (in test credentials section)

## Step 2: Configure Your Environment

Copy `backend/.env.example` to `backend/.env`:

```powershell
cp backend\.env.example backend\.env
```

Then edit `backend/.env` and add your credentials:

```env
# M-PESA Configuration
MPESA_CONSUMER_KEY=paste_your_consumer_key_here
MPESA_CONSUMER_SECRET=paste_your_consumer_secret_here
MPESA_SHORTCODE=174379
MPESA_PASSKEY=paste_your_passkey_here
MPESA_ENVIRONMENT=sandbox
```

## Step 3: Test the Integration

### Start the backend:
```powershell
.\start-backend.ps1
```

### Test the API:
Visit: http://localhost:8000/docs

Try the payment endpoints:
- POST `/api/payments/initiate` - Start a payment
- POST `/api/payments/query` - Check payment status
- GET `/api/payments/{id}` - Get payment details

### Test Phone Number:
For sandbox testing, use: **254708374149**

## Files You Have

✅ **Backend:**
- `backend/app/services/mpesa.py` - M-PESA service
- `backend/app/routes/payments.py` - Payment API endpoints
- `backend/app/schemas/payment.py` - Request/response schemas
- `backend/app/models/payment.py` - Database model

✅ **Documentation:**
- `MPESA_SETUP.md` - Complete setup guide
- This file - Quick start

## Next Steps

1. Get your API keys from Safaricom
2. Update `.env` file with your keys
3. Restart the backend
4. Test with the API docs
5. Integrate with your frontend

## Need Help?

- Full documentation: See `MPESA_SETUP.md`
- Safaricom docs: https://developer.safaricom.co.ke/APIs/MpesaExpressSimulate
- Support: apisupport@safaricom.co.ke
