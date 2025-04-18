import { IkeaApiResponse, Product } from '../types/product';

const IKEA_API_BASE_URL = 'https://ikea-api.p.rapidapi.com/keywordSearch';
const IKEA_API_KEY = '114d8daae5msh5150e4717dbea8fp171cb1jsn7732faf19883';

export const searchIkeaProducts = async (
  keyword: string,
  minPrice?: number,
  maxPrice?: number,
  country: string = 'us'
): Promise<Product[]> => {
  try {
    // Validate country code
    const validCountries = ['US', 'CA', 'DE', 'MX', 'AU', 'BR', 'IN', 'JP', 'NL', 'AE', 'PL', 'SA', 'SG', 'SE', 'TR', 'BE'];
    const code = validCountries.includes(country) ? country : 'us';

    const params = new URLSearchParams({
      keyword: keyword,
      page: '1',
      countryCode: code, // Use the validated country code
      language: 'en',
     // Make sure this matches the valid country codes
    });

    // Add price filters if provided
    if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
    if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());

    const response = await fetch(`${IKEA_API_BASE_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': IKEA_API_KEY,
        'X-RapidAPI-Host': 'ikea-api.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`IKEA API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const data: IkeaApiResponse = await response.json();
    
    // Transform Amazon products to our common Product interface
    return data
      .filter((product : any) => {
        const price = product.price.currentPrice;
        if (!price) return false;
        
        // Additional client-side filtering (in case API doesn't fully respect price params)
        if (minPrice !== undefined && price < minPrice) return false;
        if (maxPrice !== undefined && price > maxPrice) return false;
        
        return true;
      })
      .map((product : any) => ({
        id: product.id,
        title: product.name,
        price: product.price.currentPrice,
        image: product.contextualImageUrl,
        source: 'ikea' as const,
        url: product.url|| `https://www.ikea.com/dp/${product.asin}`,
      }
    ));
  } catch (error) {
    console.error('Error fetching Amazon products:', error);
    return [];
  }
};