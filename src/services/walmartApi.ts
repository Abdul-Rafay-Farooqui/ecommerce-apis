import { WalmartApiResponse, Product } from '../types/product';

const WALMART_API_URL = 'https://walmart-product-api2.p.rapidapi.com/search'; ;
const WALMART_API_KEY = '114d8daae5msh5150e4717dbea8fp171cb1jsn7732faf19883';

export const searchWalmartProducts = async (query: string, minPrice?: number, maxPrice?: number): Promise<Product[]> => {
  try {
    const params = new URLSearchParams({
      q: query,
      page: '1',
    });

    const response = await fetch(`${WALMART_API_URL}?${params}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': WALMART_API_KEY,
        'X-RapidAPI-Host': 'walmart-product-api2.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`Walmart API error: ${response.status}`);
    }

    const data: WalmartApiResponse = await response.json();
    
    console.log('Walmart API response:', data);
    // Transform Walmart products to our common Product interface
    return data.itemsV2
      .filter((itemsV2 : any )=> {
        const price = itemsV2.priceInfo.currentPrice.priceString;
        if (!price) return false;
        if (minPrice && price < minPrice) return false;
        if (maxPrice && price > maxPrice) return false;
        return true;
      })
      .map((itemV2 : any )=> ({
        id: itemV2.usItemId,
        title: itemV2.name,
        price: itemV2.priceInfo.currentPrice.priceString,
        image: itemV2.imageInfo.thumbnailUrl || '',
        source: 'walmart' as const,
        url: itemV2.productLink || `https://www.walmart.com/ip/${itemV2.usItemId}`
      }));
      console.log('Walmart products:', data.items);
  } catch (error) {
    console.error('Error fetching Walmart products:', error);
    return [];
  }
};