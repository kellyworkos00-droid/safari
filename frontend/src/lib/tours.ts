import apiClient from './api';
import { Tour, TourFilters } from '@/types/tour';

export const tourService = {
  async getTours(filters?: TourFilters): Promise<Tour[]> {
    const response = await apiClient.get('/tours', { params: filters });
    return response.data;
  },

  async getTour(id: number): Promise<Tour> {
    const response = await apiClient.get(`/tours/${id}`);
    return response.data;
  },

  async createTour(data: Partial<Tour>): Promise<any> {
    const response = await apiClient.post('/tours', data);
    return response.data;
  },

  async updateTour(id: number, data: Partial<Tour>): Promise<any> {
    const response = await apiClient.put(`/tours/${id}`, data);
    return response.data;
  },

  async deleteTour(id: number): Promise<any> {
    const response = await apiClient.delete(`/tours/${id}`);
    return response.data;
  }
};
