export interface SerpResult {
  title: string;
  link: string;
  snippet: string;
  source?: string;
  thumbnail?: string;
  price?: string;
  rating?: number;
  reviews?: number;
}

export async function searchWeb(query: string): Promise<SerpResult[]> {
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Search failed');
    
    const data = await response.json();
    
    // Process Google Search results
    const results: SerpResult[] = (data.organic_results || []).map((res: any) => ({
      title: res.title,
      link: res.link,
      snippet: res.snippet,
      source: res.displayed_link,
      thumbnail: res.thumbnail,
      price: res.rich_snippet?.top?.detected_extensions?.price || res.price,
      rating: res.rating,
      reviews: res.reviews
    }));

    return results;
  } catch (error) {
    console.error('Serp Search Error:', error);
    return [];
  }
}
