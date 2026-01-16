'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { bookingService } from '@/lib/bookings';
import { paymentService } from '@/lib/payments';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  
  const [paymentData, setPaymentData] = useState({
    phone_number: '',
    payment_method: 'mpesa'
  });

  useEffect(() => {
    fetchBookingDetails();
  }, [params.id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getBooking(Number(params.id));
      setBooking(data);
    } catch (error) {
      console.error('Failed to fetch booking:', error);
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleMpesaPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    
    setError('');
    setLoading(true);
    setStep('processing');

    try {
      const response = await paymentService.initiatePayment({
        booking_id: Number(params.id),
        phone_number: paymentData.phone_number,
        amount: booking.total_amount,
        payment_method: 'mpesa'
      });

      // Simulate STK push waiting time
      setTimeout(() => {
        setStep('success');
      }, 3000);
      
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Payment failed. Please try again.');
      setStep('details');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking not found</h2>
          <Link href="/tours" className="text-green-600 hover:text-green-700">
            Back to tours
          </Link>
        </div>
      </div>
    );
  }

  const totalAmount = booking.total_amount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-green-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Safari Buddy
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {step === 'details' && (
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Complete Payment</h1>
              <p className="text-gray-600">Secure payment with M-PESA</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Amount Display */}
            <div className="mb-8 p-6 bg-gray-50 rounded-2xl text-center">
              <div className="text-sm text-gray-600 mb-1">Amount to Pay</div>
              <div className="text-5xl font-extrabold text-green-600">KSh {(totalAmount * 130).toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-1">(${totalAmount} USD)</div>
            </div>

            {/* M-PESA Payment Form */}
            <form onSubmit={handleMpesaPayment} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <div className="flex items-center gap-4 p-4 border-2 border-green-600 rounded-xl bg-green-50">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">M-PESA</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">M-PESA</div>
                    <div className="text-sm text-gray-600">Lipa na M-PESA</div>
                  </div>
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                  M-PESA Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={paymentData.phone_number}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  placeholder="0712345678"
                />
                <p className="mt-1 text-sm text-gray-500">Enter your Safaricom M-PESA number (10 digits)</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">How it works:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Enter your M-PESA phone number</li>
                      <li>Click "Pay with M-PESA"</li>
                      <li>You'll receive an STK push on your phone</li>
                      <li>Enter your M-PESA PIN to complete payment</li>
                    </ol>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Pay with M-PESA'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Secured by 256-bit SSL encryption</p>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your phone</h2>
            <p className="text-gray-600 mb-6">
              We've sent an M-PESA prompt to {paymentData.phone_number}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <p className="mt-4 text-sm text-gray-500">Waiting for payment confirmation...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-8">Your booking has been confirmed</p>
            
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <div className="text-sm text-gray-600 mb-1">Transaction ID</div>
              <div className="text-lg font-mono font-bold text-gray-900">MPESA-{Date.now()}</div>
            </div>

            <div className="space-y-3">
              <Link
                href="/dashboard/tourist"
                className="block w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
              >
                View My Bookings
              </Link>
              <Link
                href="/tours"
                className="block w-full py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-green-600 hover:text-green-600 transition"
              >
                Browse More Tours
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
