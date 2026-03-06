export interface Event {
  id: string;
  name: string;
  url: string;
  dates: {
    start: {
      localDate: string;
      localTime?: string;
    };
  };
  images: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  _embedded?: {
    venues?: Array<{
      name: string;
      city: {
        name: string;
      };
      state?: {
        name: string;
      };
    }>;
  };
  classifications?: Array<{
    segment?: {
      name: string;
    };
  }>;
}

export interface EventResponse {
  _embedded?: {
    events: Event[];
  };
  page?: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}