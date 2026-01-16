export enum TourCategory {
  WILDLIFE = 'wildlife',
  BEACH = 'beach',
  MOUNTAIN = 'mountain',
  CULTURAL = 'cultural',
  ADVENTURE = 'adventure',
  WELLNESS = 'wellness',
  CITY = 'city',
  ROAD_TRIP = 'road_trip'
}

export interface Tour {
  id: number;
  title: string;
  description: string;
  category: TourCategory;
  destination: string;
  duration_days: number;
  price_per_person: number;
  min_participants: number;
  max_participants?: number;
  current_participants: number;
  is_group_tour: boolean;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  includes?: string;
  excludes?: string;
  itinerary?: string;
}

export interface TourFilters {
  category?: TourCategory;
  destination?: string;
  min_price?: number;
  max_price?: number;
  skip?: number;
  limit?: number;
}
