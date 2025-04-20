import { TargetApiResponse, Product } from '../types/product';

const TARGET_API_BASE_URL = 'https://target1.p.rapidapi.com/products/v2/list';
const TARGET_API_KEY = '114d8daae5msh5150e4717dbea8fp171cb1jsn7732faf19883';

export const searchTargetProducts = async (
  query: string,
  minPrice?: number,
  maxPrice?: number,
): Promise<Product[]> => {
  try {
    const params = new URLSearchParams({
      store_id: "911",       
      category: "5xtg6",
      keyword: query,
      count: "20",
      offset: "0",
      default_purchasability_filter: "true",
      sort_by: "relevance"
    });


    // Add price filters if provided
    if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
    if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());

    const response = await fetch(`${TARGET_API_BASE_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': TARGET_API_KEY,
        'X-RapidAPI-Host': 'target1.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Target API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const data: TargetApiResponse = await response.json();    
    // Transform Trget products to our common Product interface
    return data.data.search.products
      .filter((products : any) => {
        const price = products.price.current_retail;
        if (!price) return false;
        
        // Additional client-side filtering (in case API doesn't fully respect price params)
        if (minPrice !== undefined && price < minPrice) return false;
        if (maxPrice !== undefined && price > maxPrice) return false;
        
        return true;
      })
      .map((products : any )=> ({
        id: products.item.tcin,
        title: products.item.product_classification.item_type.name,
        price: products.price.current_retail,
        image: products.item.enrichment.images.primary_image_url,
        source: 'target' as const,
        url: products.item.enrichment.buy_url|| `https://www.target.com/dp/${products.item.tcin}`,
      }));
  } catch (error) {
    console.error('Error fetching Amazon products:', error);
    return [];
  }
};
