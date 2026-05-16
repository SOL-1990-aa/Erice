export type EntityCategory = 'fashion' | 'streetwear' | ' textile' | 'research';

export interface EntityDiscovery {
  id: string;
  name: string;
  category: EntityCategory;
  summary: string;
  tags: string[];
  links: { label: string; url: string }[];
  imageUrl: string;
  details: string;
  createdAt: string; // ISO string for filtering
}

export interface SearchResult {
  entities: EntityDiscovery[];
  aiInsight: string;
}

export interface FilterOptions {
  category: string;
  tags: string[];
  dateRange: 'all' | 'recent' | 'past-year';
}
