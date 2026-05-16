import { EntityDiscovery } from './types';

export const DISCOVERY_ENTITIES: EntityDiscovery[] = [
  {
    id: 'ercie-collection',
    name: 'Ercie Collection',
    category: 'fashion',
    summary: 'A premier women’s fashion boutique specializing in elegant evening wear and luxury essentials.',
    tags: ['Luxury', 'Evening Wear', 'Boutique'],
    links: [
      { label: 'Instagram', url: '#' },
      { label: 'Shop Now', url: '#' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
    details: 'The Ercie Collection represents the pinnacle of modern elegance, offering a curated selection of dresses, heels, and jumpsuits designed for the discerning woman.',
    createdAt: '2026-05-10T10:00:00Z'
  },
  {
    id: 'erce-clothing',
    name: 'Erce Clothing',
    category: 'streetwear',
    summary: 'Cutting-edge UK streetwear label known for bold graphic tees and urban aesthetics.',
    tags: ['Streetwear', 'UK Brand', 'Graphic Design'],
    links: [
      { label: 'Collection', url: '#' },
      { label: 'Twitter', url: '#' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop',
    details: 'Erce Clothing captures the raw energy of urban youth culture, blending high-quality fabrics with striking visual narratives that define the contemporary streetwear scene.',
    createdAt: '2026-04-15T10:00:00Z'
  },
  {
    id: 'ercea-international',
    name: 'Ercea International',
    category: ' textile',
    summary: 'Renowned French textile house pioneering innovative fabric prints and fashion exhibitions.',
    tags: ['Textiles', 'French Design', 'Innovation'],
    links: [
      { label: 'Portfolio', url: '#' },
      { label: 'Contact', url: '#' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=2012&auto=format&fit=crop',
    details: 'Based in France, Ercea International is a leader in textile architecture, providing high-end fashion brands with unique, ethically-sourced fabric prints.',
    createdAt: '2025-11-20T10:00:00Z'
  },
  {
    id: 'erce-unesco-study',
    name: 'ERCE 2025 Study',
    category: 'research',
    summary: 'UNESCO educational initiative analyzing student performance and teaching quality across global regions.',
    tags: ['Education', 'UNESCO', 'Data Analysis'],
    links: [
      { label: 'Study Details', url: '#' },
      { label: 'Raw Data', url: '#' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop',
    details: 'The Regional Comparative and Explantory Study (ERCE) 2025 provides critical insights into educational outcomes, helping policymakers shape the future of learning.',
    createdAt: '2026-01-05T10:00:00Z'
  }
];
