import apiClient from './api';

export interface PaymentCreate {
  booking_id: number;
  amount: number;
  phone_number: string;
  payment_method: 'mpesa' | 'card';
}

export interface Payment {
  id: number;
  booking_id: number;
  amount: number;
  payment_status: string;
  payment_method: string;
  transaction_id?: string;
  mpesa_receipt?: string;
  created_at: string;
}

export const paymentService = {
  async initiatePayment(data: PaymentCreate): Promise<any> {
    const response = await apiClient.post('/payments/initiate', data);
    return response.data;
  },

  async verifyPayment(transactionId: string): Promise<Payment> {
    const response = await apiClient.get(`/payments/verify/${transactionId}`);
    return response.data;
  },

  async getPayment(id: number): Promise<Payment> {
    const response = await apiClient.get(`/payments/${id}`);
    return response.data;
  },

  async getPaymentsByBooking(bookingId: number): Promise<Payment[]> {
    const response = await apiClient.get(`/payments/booking/${bookingId}`);
    return response.data;
  }
};
