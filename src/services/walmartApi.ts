import { WalmartApiResponse, Product } from '../types/product';

const WALMART_API_URL = 'https://walmart2.p.rapidapi.com/searchV2/'; ;
const WALMART_API_KEY = '114d8daae5msh5150e4717dbea8fp171cb1jsn7732faf19883';

export const searchWalmartProducts = async (q: string, minPrice?: number, maxPrice?: number): Promise<Product[]> => {
  try {
    const params = new URLSearchParams({
      q,
      page: '1',
    });

    const response = await fetch(`${WALMART_API_URL}?${params}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': WALMART_API_KEY,
        'X-RapidAPI-Host': 'walmart2.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`Walmart API error: ${response.status}`);
    }

    const data: WalmartApiResponse = await response.json();
    
    // Transform Walmart products to our common Product interface
    return data.items
      .filter(product => {
        const price = product.price;
        if (!price) return false;
        if (minPrice && price < minPrice) return false;
        if (maxPrice && price > maxPrice) return false;
        return true;
      })
      .map(product => ({
        id: product.id,
        title: product.name,
        price: product.price,
        image: product.image || '',
        rating: product.rating,
        source: 'walmart' as const,
        url: product.productLink || `https://www.walmart.com/ip/${product.id}`
      }));
      console.log('Walmart products:', data.items);
  } catch (error) {
    console.error('Error fetching Walmart products:', error);
    return [];
  }
};