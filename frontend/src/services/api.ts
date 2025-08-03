// API service for Bay Area Transit backend integration
const API_BASE_URL = 'http://localhost:5000';

export interface Stop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  routes?: string[];
}

export interface Route {
  id: string;
  name: string;
  type: 'bus' | 'rail' | 'ferry';
  color?: string;
  stops?: string[];
}

export interface Arrival {
  id: string;
  route_id: string;
  route_name: string;
  destination: string;
  estimated_time: string;
  delay_minutes?: number;
  vehicle_id?: string;
}

export interface Alert {
  id: string;
  type: 'delay' | 'disruption' | 'info' | 'maintenance';
  title: string;
  description: string;
  route?: string;
  severity: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at?: string;
}

class ApiService {
  private async fetchWithErrorHandling<T>(url: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API Error for ${url}:`, error);
      throw error;
    }
  }

  // Get all transit stops for map markers and dropdowns
  async getStops(): Promise<Stop[]> {
    return this.fetchWithErrorHandling<Stop[]>('/stops');
  }

  // Get all available transit routes
  async getRoutes(): Promise<Route[]> {
    return this.fetchWithErrorHandling<Route[]>('/routes');
  }

  // Get next arrivals at a specific stop
  async getArrivals(stopId: string): Promise<Arrival[]> {
    return this.fetchWithErrorHandling<Arrival[]>(`/arrivals/${stopId}`);
  }

  // Get all stops served by a specific route
  async getRouteStops(routeId: string): Promise<Stop[]> {
    return this.fetchWithErrorHandling<Stop[]>(`/routes/${routeId}/stops`);
  }

  // Get system alerts and notifications
  async getAlerts(): Promise<Alert[]> {
    return this.fetchWithErrorHandling<Alert[]>('/alerts');
  }

  // Get system status and metrics (if available)
  async getSystemStatus(): Promise<any> {
    return this.fetchWithErrorHandling<any>('/status');
  }
}

export const apiService = new ApiService();