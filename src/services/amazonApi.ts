import { AmazonApiResponse, Product } from '../types/product';

const AMAZON_API_BASE_URL = 'https://amazon-online-data-api.p.rapidapi.com/search';
const AMAZON_API_KEY = '114d8daae5msh5150e4717dbea8fp171cb1jsn7732faf19883';

export const searchAmazonProducts = async (
  query: string,
  minPrice?: number,
  maxPrice?: number,
  country: string = 'US'
): Promise<Product[]> => {
  try {
    // Validate country code
    const validCountries = ['US', 'CA', 'DE', 'MX', 'AU', 'BR', 'IN', 'JP', 'NL', 'AE', 'PL', 'SA', 'SG', 'SE', 'TR', 'BE'];
    const geo = validCountries.includes(country) ? country : 'US';

    const params = new URLSearchParams({
      query: query,
      page: '1',
      country: geo, // Use the validated country code
      language: 'en',
      geo: geo,     // Make sure this matches the valid country codes
    });

    // Add price filters if provided
    if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
    if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());

    const response = await fetch(`${AMAZON_API_BASE_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': AMAZON_API_KEY,
        'X-RapidAPI-Host': 'amazon-online-data-api.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Amazon API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const data: AmazonApiResponse = await response.json();
    
    // Transform Amazon products to our common Product interface
    return data.products
      .filter(product => {
        const price = product.product_price;
        if (!price) return false;
        
        // Additional client-side filtering (in case API doesn't fully respect price params)
        if (minPrice !== undefined && price < minPrice) return false;
        if (maxPrice !== undefined && price > maxPrice) return false;
        
        return true;
      })
      .map(product => ({
        id: product.asin,
        title: product.product_title,
        price: product.product_price,
        image: product.product_photo,
        rating: product.product_star_rating,
        source: 'amazon' as const,
        url: product.product_url|| `https://www.amazon.com/dp/${product.asin}`,
      }));
  } catch (error) {
    console.error('Error fetching Amazon products:', error);
    return [];
  }
};