// Common product interface to standardize between different APIs
export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  rating?: number;
  source: 'amazon' | 'walmart' | 'ikea';
  url: string;
}
export interface IkeaApiResponse {
  products: IkeaProduct[];
  metadata: {} | null;
  [request_id: string]: any;
}

export interface IkeaProduct {
  id: string;
  name: string;
  price: {
    currentPrice: number;
    [key: string]: any;
  };
  contentualImageUrl: string;
  url?: string;
  [key: string]: any;
}

// Amazon API response types
export interface AmazonApiResponse {
  products: AmazonProduct[];
  metadata: {} | null;
  [request_id: string]: any;
}

export interface AmazonProduct {
  asin: string;
  title: string;
  price: {
    current_price: number;
    [key: string]: any;
  };
  thumbnail: string;
  reviews?: {
    rating: number;
    [key: string]: any;
  };
  url?: string;
  [key: string]: any;
}

// Walmart API response types
export interface WalmartApiResponse {
  items: WalmartProduct[];
  totalCount: number;
  [key: string]: any;
}

export interface WalmartProduct {
  id: string;
  name: string;
  price: number;
  imageInfo?: {
    thumbnailUrl: string;
    [key: string]: any;
  };
  reviewsInfo?: {
    averageRating: number;
    [key: string]: any;
  };
  productUrl?: string;
  [key: string]: any;
}