"""M-PESA Integration Service for Safari Buddy"""
import base64
import requests
from datetime import datetime
from typing import Optional, Dict, Any
from app.config import get_settings

settings = get_settings()


class MPesaService:
    """Service for handling M-PESA payment operations"""
    
    def __init__(self):
        self.consumer_key = settings.MPESA_CONSUMER_KEY
        self.consumer_secret = settings.MPESA_CONSUMER_SECRET
        self.shortcode = settings.MPESA_SHORTCODE
        self.passkey = settings.MPESA_PASSKEY
        self.environment = settings.MPESA_ENVIRONMENT
        
        # Set base URL based on environment
        if self.environment == "production":
            self.base_url = "https://api.safaricom.co.ke"
        else:
            self.base_url = "https://sandbox.safaricom.co.ke"
    
    def get_access_token(self) -> Optional[str]:
        """Generate OAuth access token for M-PESA API"""
        try:
            url = f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials"
            
            # Create basic auth credentials
            credentials = f"{self.consumer_key}:{self.consumer_secret}"
            encoded_credentials = base64.b64encode(credentials.encode()).decode()
            
            headers = {
                "Authorization": f"Basic {encoded_credentials}"
            }
            
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            
            result = response.json()
            return result.get("access_token")
        except Exception as e:
            print(f"Error getting access token: {e}")
            return None
    
    def generate_password(self, timestamp: str) -> str:
        """Generate M-PESA password using base64(Shortcode + Passkey + Timestamp)"""
        data = f"{self.shortcode}{self.passkey}{timestamp}"
        encoded = base64.b64encode(data.encode()).decode()
        return encoded
    
    def stk_push(
        self,
        phone_number: str,
        amount: float,
        account_reference: str,
        transaction_desc: str,
        callback_url: str
    ) -> Dict[str, Any]:
        """
        Initiate STK Push (Lipa na M-PESA Online) payment
        
        Args:
            phone_number: Customer phone number (254XXXXXXXXX format)
            amount: Amount to charge
            account_reference: Account reference (booking ID, invoice number, etc.)
            transaction_desc: Description of the transaction
            callback_url: URL to receive payment confirmation callback
        
        Returns:
            Response from M-PESA API
        """
        access_token = self.get_access_token()
        if not access_token:
            return {"success": False, "message": "Failed to get access token"}
        
        # Generate timestamp (YYYYMMDDHHmmss format)
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        password = self.generate_password(timestamp)
        
        url = f"{self.base_url}/mpesa/stkpush/v1/processrequest"
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        # Ensure phone number is in correct format (254XXXXXXXXX)
        if phone_number.startswith("0"):
            phone_number = f"254{phone_number[1:]}"
        elif phone_number.startswith("+254"):
            phone_number = phone_number[1:]
        elif not phone_number.startswith("254"):
            phone_number = f"254{phone_number}"
        
        payload = {
            "BusinessShortCode": self.shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": int(amount),
            "PartyA": phone_number,
            "PartyB": self.shortcode,
            "PhoneNumber": phone_number,
            "CallBackURL": callback_url,
            "AccountReference": account_reference,
            "TransactionDesc": transaction_desc
        }
        
        try:
            response = requests.post(url, json=payload, headers=headers)
            result = response.json()
            
            return {
                "success": response.status_code == 200,
                "data": result,
                "status_code": response.status_code
            }
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
                "status_code": 500
            }
    
    def stk_push_query(
        self,
        checkout_request_id: str
    ) -> Dict[str, Any]:
        """
        Query the status of an STK Push transaction
        
        Args:
            checkout_request_id: The CheckoutRequestID from the STK Push response
        
        Returns:
            Response from M-PESA API with transaction status
        """
        access_token = self.get_access_token()
        if not access_token:
            return {"success": False, "message": "Failed to get access token"}
        
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        password = self.generate_password(timestamp)
        
        url = f"{self.base_url}/mpesa/stkpushquery/v1/query"
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "BusinessShortCode": self.shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "CheckoutRequestID": checkout_request_id
        }
        
        try:
            response = requests.post(url, json=payload, headers=headers)
            result = response.json()
            
            return {
                "success": response.status_code == 200,
                "data": result,
                "status_code": response.status_code
            }
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
                "status_code": 500
            }
    
    def process_callback(self, callback_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process M-PESA callback data
        
        Args:
            callback_data: Raw callback data from M-PESA
        
        Returns:
            Processed payment information
        """
        try:
            body = callback_data.get("Body", {})
            stk_callback = body.get("stkCallback", {})
            
            result_code = stk_callback.get("ResultCode")
            result_desc = stk_callback.get("ResultDesc")
            merchant_request_id = stk_callback.get("MerchantRequestID")
            checkout_request_id = stk_callback.get("CheckoutRequestID")
            
            payment_info = {
                "merchant_request_id": merchant_request_id,
                "checkout_request_id": checkout_request_id,
                "result_code": result_code,
                "result_desc": result_desc,
                "success": result_code == 0
            }
            
            # Extract callback metadata if payment was successful
            if result_code == 0:
                callback_metadata = stk_callback.get("CallbackMetadata", {})
                items = callback_metadata.get("Item", [])
                
                for item in items:
                    name = item.get("Name")
                    value = item.get("Value")
                    
                    if name == "Amount":
                        payment_info["amount"] = value
                    elif name == "MpesaReceiptNumber":
                        payment_info["mpesa_receipt_number"] = value
                    elif name == "TransactionDate":
                        payment_info["transaction_date"] = str(value)
                    elif name == "PhoneNumber":
                        payment_info["phone_number"] = str(value)
            
            return payment_info
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }


# Create a singleton instance
mpesa_service = MPesaService()
