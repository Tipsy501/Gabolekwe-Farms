export interface HorticultureProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  availability: 'In Season & In Stock' | 'Limited Stock' | 'Coming Soon' | 'Out of Season';
  packSizes: string[];
  harvestSeason: string;
  image: string;
  nutritionalHighlights: string[];
  growingMethod: string;
}

export const INITIAL_HORTICULTURE_PRODUCTS: HorticultureProduct[] = [
  {
    id: 'prod-cabbage',
    name: 'Cabbage',
    category: 'Leafy Vegetables',
    description: 'Crisp, dense, nutrient-rich green heads cultivated in our nutrient-dense Gweta soils. Perfect for fresh slaws, traditional dishes, and commercial catering.',
    availability: 'In Season & In Stock',
    packSizes: ['10kg Bulk Bag', '20kg Bulk Crate', 'Individual Head (Approx 1.5kg)'],
    harvestSeason: 'Year-Round (Peak: May – October)',
    image: 'https://res.cloudinary.com/kxeewabw/image/upload/f_auto,q_auto/v1787217555/gabolekwe_farms/i4ehrhkpyabz7zuykvn9.jpg',
    nutritionalHighlights: ['High in Vitamin C & K', 'Rich in dietary fiber', 'Antioxidant properties'],
    growingMethod: 'Precision drip irrigation with organic compost conditioning.'
  },
  {
    id: 'prod-tomatoes',
    name: 'Tomatoes',
    category: 'Vine Crops',
    description: 'Vibrant, vine-ripened red tomatoes harvested at the absolute peak of sweetness and firmness. Trusted by top lodges, restaurants, and local markets.',
    availability: 'In Season & In Stock',
    packSizes: ['5kg Box', '10kg Commercial Crate', 'Bulk Wholesale Pallet'],
    harvestSeason: 'Year-Round (Controlled Greenhouse Production)',
    image: 'https://res.cloudinary.com/kxeewabw/image/upload/f_auto,q_auto/v1787217886/gabolekwe_farms/aiho10uqt4w0e3wtos0n.jpg',
    nutritionalHighlights: ['Rich in Lycopene', 'High Vitamin A & C', 'Natural potassium source'],
    growingMethod: 'Climate-controlled greenhouse trellising with drip fertigation.'
  },
  {
    id: 'prod-spinach',
    name: 'Spinach',
    category: 'Leafy Vegetables',
    description: 'Tender, dark green spinach leaves packed with iron and essential minerals. Hand-harvested daily to ensure peak crispness upon delivery.',
    availability: 'In Season & In Stock',
    packSizes: ['1kg Bunch Pack', '5kg Commercial Bag', '10kg Restaurant Box'],
    harvestSeason: 'Year-Round (Cool Season Favorite)',
    image: 'https://res.cloudinary.com/kxeewabw/image/upload/f_auto,q_auto/v1787211571/gabolekwe_farms/nne7ty06tlwlh34lyqps.jpg',
    nutritionalHighlights: ['Exceptional Iron & Calcium', 'Vitamins A, C, and K', 'Low calorie & nutrient dense'],
    growingMethod: 'Shade net protection with filtered borehole water irrigation.'
  },
  {
    id: 'prod-rape',
    name: 'Rape',
    category: 'Traditional Greens',
    description: 'A staple of Botswanan cuisine, our rape greens boast robust flavor, dark succulent leaves, and excellent nutritional value.',
    availability: 'In Season & In Stock',
    packSizes: ['1kg Bunch', '5kg Bulk Pack', '20kg Market Sack'],
    harvestSeason: 'April – November',
    image: 'https://res.cloudinary.com/kxeewabw/image/upload/f_auto,q_auto/v1787218380/gabolekwe_farms/qtkdgnaj6o02j1swdk3t.jpg',
    nutritionalHighlights: ['Rich in dietary fiber', 'Calcium & magnesium', 'Traditional nutritional profile'],
    growingMethod: 'Sustainable open-field farming with natural soil enrichment.'
  },
  {
    id: 'prod-chomolia',
    name: 'Chomolia (Covo)',
    category: 'Traditional Greens',
    description: 'Crisp, flavorful chomolia leaves cultivated specifically for local culinary traditions and high-volume catering demands.',
    availability: 'In Season & In Stock',
    packSizes: ['1kg Bunch', '5kg Bundle', '15kg Wholesale Sack'],
    harvestSeason: 'Year-Round',
    image: 'https://res.cloudinary.com/kxeewabw/image/upload/f_auto,q_auto/v1787219598/gabolekwe_farms/otmaaagmbaniy6pxvpuw.jpg',
    nutritionalHighlights: ['High Vitamin C', 'Plant-based iron', 'Essential minerals'],
    growingMethod: 'Precision micro-irrigation and integrated pest management.'
  },
  {
    id: 'prod-green-pepper',
    name: 'Green Peppers',
    category: 'Fruiting Vegetables',
    description: 'Thick-walled, crisp green bell peppers harvested at optimal maturity for maximum crunch, sweetness, and culinary versatility.',
    availability: 'In Season & In Stock',
    packSizes: ['3kg Box', '5kg Commercial Crate', '10kg Wholesale Box'],
    harvestSeason: 'May – December',
    image: 'https://res.cloudinary.com/kxeewabw/image/upload/f_auto,q_auto/v1787218599/gabolekwe_farms/gtaaixzmdmh09ertb9ez.jpg',
    nutritionalHighlights: ['Very high Vitamin C content', 'Antioxidants', 'Low sodium'],
    growingMethod: 'Greenhouse staking and specialized nutrient delivery.'
  },
  {
    id: 'prod-spring-onions',
    name: 'Spring Onions',
    category: 'Leafy Vegetables',
    description: 'Fresh, aromatic spring onions with crisp white stalks and vibrant green tops. Cultivated with precision drip irrigation for optimal culinary flavor and crunch.',
    availability: 'In Season & In Stock',
    packSizes: ['500g Bunch', '1kg Commercial Bundle', '5kg Restaurant Crate'],
    harvestSeason: 'Year-Round',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=1000&q=80',
    nutritionalHighlights: ['Rich in Vitamin K & C', 'Natural antioxidants', 'Digestive health benefits'],
    growingMethod: 'Precision micro-irrigation with enriched organic compost bed preparation.'
  }
];
