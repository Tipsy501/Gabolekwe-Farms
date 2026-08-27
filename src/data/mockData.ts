import { HeroSlide, ServiceItem, BeefProductGrade, GalleryItem, NewsArticle } from '../types';

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    title: 'Gabolekwe Farms',
    subtitle: 'Horticulture • Beef Products • Agricultural Technology',
    description: 'A proud Botswana agricultural enterprise based in Gweta, dedicated to sustainable livestock production, animal feed, fresh horticultural produce, and agricultural innovation.',
    image: 'https://res.cloudinary.com/kxeewabw/image/upload/f_auto,q_auto/v1787213937/gabolekwe_farms/hxth2narejlovpvowaly.jpg',
    ctaText: 'Explore Our Services',
    ctaLink: 'services',
    badge: 'Gweta, Botswana'
  },
  {
    id: 'slide-2',
    title: 'Horticulture',
    subtitle: 'Fresh produce grown with purpose.',
    description: 'Cultivating nutrient-dense vegetables and fresh crops using precision drip irrigation and sustainable soil management across fertile Botswana lands.',
    image: 'https://res.cloudinary.com/kxeewabw/image/upload/f_auto,q_auto/v1787213783/gabolekwe_farms/kwwdowwthlnbhbrm2bpf.jpg',
    ctaText: 'Discover Horticulture',
    ctaLink: 'services',
    badge: 'Farm-Fresh Harvest'
  },
  {
    id: 'slide-3',
    title: 'Beef Products',
    subtitle: 'Quality beef from Botswana.',
    description: 'Raising world-class livestock on natural pastures with rigorous veterinary care, delivering premium grade Botswana beef trusted locally and internationally.',
    image: 'https://res.cloudinary.com/kxeewabw/image/upload/f_auto,q_auto/v1787213651/gabolekwe_farms/gwzgtej4lehsqnoxmmil.jpg',
    ctaText: 'View Beef Grades',
    ctaLink: 'beef',
    badge: 'World-Class Livestock'
  },
  {
    id: 'slide-4',
    title: 'Agricultural Technology',
    subtitle: 'Developing smarter farm management solutions.',
    description: 'Pioneering digital transformation in African agriculture with intelligent software for crop monitoring, resource allocation, and yield optimization.',
    image: 'https://res.cloudinary.com/kxeewabw/image/upload/f_auto,q_auto/v1787214480/gabolekwe_farms/i4vr9sglepunzorybbwj.jpg',
    ctaText: 'Learn About Our Tech',
    ctaLink: 'services',
    badge: 'Smart Farming Innovation'
  }
];

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'horticulture',
    title: 'Horticulture',
    shortDesc: 'Fresh vegetables including cabbage, tomatoes, spinach, rape, chomolia, and green pepper.',
    fullDesc: 'Our horticulture division in Gweta cultivates a diverse range of fresh vegetables including cabbage, tomatoes, spinach, rape, chomolia, and green pepper. We proudly supply local markets, vendors, and lodges in Gweta, Maun, and surrounding areas with reliable, farm-fresh produce grown with care.',
    iconName: 'Sprout',
    image: 'https://res.cloudinary.com/kxeewabw/image/upload/f_auto,q_auto/v1787215505/gabolekwe_farms/sewy2mzogt5pf3jf0yz5.jpg',
    benefits: [
      'Fresh production of cabbage, tomatoes, spinach, rape, chomolia, and green pepper',
      'Reliable supply for local markets, vendors, and lodges in Gweta and Maun',
      'Sustainable water management and soil care',
      'Quality harvesting and post-harvest handling'
    ],
    keyFeature: 'Cabbage, tomatoes, spinach, rape, chomolia & green pepper production'
  },
  {
    id: 'beef',
    title: 'Beef Products / Beef Sales',
    shortDesc: 'Cattle and goat production alongside animal feed cultivation.',
    fullDesc: 'Gabolekwe Farms is actively engaged in cattle and goat production, supported by on-site animal feed cultivation. We maintain high standards of livestock husbandry and veterinary care, supplying quality beef and livestock to local and regional buyers.',
    iconName: 'Beef',
    image: 'https://res.cloudinary.com/kxeewabw/image/upload/f_auto,q_auto/v1787215682/gabolekwe_farms/eaz1fghnckehvfxl19z3.jpg',
    benefits: [
      'Cattle and goat livestock production',
      'Animal feed cultivation to support herd health',
      'Adherence to Botswana veterinary and health standards',
      'Direct livestock and beef sales for local and regional markets'
    ],
    keyFeature: 'Cattle, goats & animal feed production'
  },
  {
    id: 'irrigation',
    title: 'Irrigation System Design & Consultation',
    shortDesc: 'Water management and irrigation solutions for agricultural efficiency.',
    fullDesc: 'Our agricultural services include irrigation system design and technical consultation to help farmers optimize water usage for crop production in Botswana’s climate.',
    iconName: 'Droplets',
    image: 'https://res.cloudinary.com/kxeewabw/image/upload/f_auto,q_auto/v1787215777/gabolekwe_farms/f9kufc98782a20zffwh4.jpg',
    benefits: [
      'Practical irrigation layout and design',
      'Water efficiency guidance for vegetable and feed crops',
      'Consultation on reliable water sourcing and distribution',
      'System maintenance and operational support'
    ],
    keyFeature: 'Irrigation design & water management consultation'
  },
  {
    id: 'technology',
    title: 'Farm Management Application Development',
    shortDesc: 'Digital tools designed to assist with farm record keeping and operations.',
    fullDesc: 'We develop farm management software applications designed to help agricultural operations track livestock, monitor inventory, manage crop schedules, and streamline daily administrative tasks.',
    iconName: 'Cpu',
    image: 'https://res.cloudinary.com/kxeewabw/image/upload/f_auto,q_auto/v1787215857/gabolekwe_farms/f4931a3q84c4x4g0eab1.jpg',
    benefits: [
      'Digital record keeping for livestock and crops',
      'Task and schedule management for farm workers',
      'Inventory and supply tracking modules',
      'User-friendly mobile and web accessibility'
    ],
    keyFeature: 'Practical farm management software solutions'
  }
];

export const BEEF_GRADES: BeefProductGrade[] = [
  {
    name: 'Beef Fillet',
    code: 'BF-01',
    description: 'The most tender and lean cut of beef, prized for its delicate texture and melt-in-the-mouth quality.',
    idealFor: 'Pan-searing, medallions, and gourmet roasts.',
    marbling: 'Fine & Subtle',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1000&q=80',
    packSizes: ['1kg Vacuum Pack', '5kg Wholesale Box'],
    pricing: 'Contact for Wholesale Pricing',
    availability: 'In Stock'
  },
  {
    name: 'T-Bone Steak',
    code: 'BF-02',
    description: 'A magnificent cut featuring both the tenderloin and strip steak separated by a T-shaped bone.',
    idealFor: 'Grilling, braai, and cast-iron searing.',
    marbling: 'Rich & Balanced',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1000&q=80',
    packSizes: ['2kg Pack', '10kg Wholesale Box'],
    pricing: 'Contact for Wholesale Pricing',
    availability: 'In Stock'
  },
  {
    name: 'Beef Mince',
    code: 'BF-03',
    description: 'Freshly ground lean beef prepared from premium primal cuts. Versatile and packed with rich savory flavor.',
    idealFor: 'Burgers, bolognese, meatballs, and pies.',
    marbling: 'Lean & Flavorful',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
    packSizes: ['1kg Pack', '5kg Bulk Pack', '10kg Catering Box'],
    pricing: 'Contact for Wholesale Pricing',
    availability: 'In Stock'
  },
  {
    name: 'Ribeye Steak',
    code: 'BF-04',
    description: 'Extremely flavorful and succulent steak with characteristic marbling that keeps it exceptionally juicy.',
    idealFor: 'Grilling, open-fire braai, and pan roasting.',
    marbling: 'Abundant Intermuscular Marbling',
    image: 'https://images.unsplash.com/photo-1545936856-d713c23945a8?auto=format&fit=crop&w=1000&q=80',
    packSizes: ['2kg Pack', '10kg Wholesale Box'],
    pricing: 'Contact for Wholesale Pricing',
    availability: 'In Stock'
  },
  {
    name: 'Sirloin Steak',
    code: 'BF-05',
    description: 'A classic cut offering a fantastic balance of deep robust beef flavor and tender firmness.',
    idealFor: 'Steak nights, grilling, and slicing for salads.',
    marbling: 'Moderate & Even',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1000&q=80',
    packSizes: ['2kg Pack', '10kg Wholesale Box'],
    pricing: 'Contact for Wholesale Pricing',
    availability: 'In Stock'
  },
  {
    name: 'Rump Steak',
    code: 'BF-06',
    description: 'A firm, lean cut with a rich, satisfying beef flavor that handles high-heat cooking superbly.',
    idealFor: 'Roasting, grilling, and cubing for sosaties.',
    marbling: 'Lean & Succulent',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1000&q=80',
    packSizes: ['2kg Pack', '10kg Wholesale Box'],
    pricing: 'Contact for Wholesale Pricing',
    availability: 'In Stock'
  },
  {
    name: 'Beef Brisket',
    code: 'BF-07',
    description: 'A flavorful, hardworking cut that transforms into melt-in-the-mouth tenderness when slow-cooked or smoked.',
    idealFor: 'Smoked barbecue, slow roasting, and corned beef.',
    marbling: 'Deep Interwoven Marbling',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
    packSizes: ['3kg Cut', '10kg Bulk Pack'],
    pricing: 'Contact for Wholesale Pricing',
    availability: 'In Stock'
  },
  {
    name: 'Beef Stew',
    code: 'BF-08',
    description: 'Pre-cut cubes of wholesome beef chuck and shoulder, ideal for hearty traditional stews and potjies.',
    idealFor: 'Traditional stews, potjies, and casseroles.',
    marbling: 'Balanced & Flavorful',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1000&q=80',
    packSizes: ['1kg Pack', '5kg Bulk Pack'],
    pricing: 'Contact for Wholesale Pricing',
    availability: 'In Stock'
  },
  {
    name: 'Beef Short Ribs',
    code: 'BF-09',
    description: 'Richly marbled ribs cut across the bone, delivering deep, savory flavor when braised or slow-cooked.',
    idealFor: 'Braising, slow cooking, and BBQ smoking.',
    marbling: 'Rich & Abundant',
    image: 'https://images.unsplash.com/photo-1545936856-d713c23945a8?auto=format&fit=crop&w=1000&q=80',
    packSizes: ['2kg Pack', '10kg Bulk Box'],
    pricing: 'Contact for Wholesale Pricing',
    availability: 'In Stock'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Greenhouse Horticulture Harvest',
    category: 'Horticulture',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80',
    description: 'Fresh bell peppers and tomatoes thriving in our climate-controlled greenhouses.',
    date: 'August 2026'
  },
  {
    id: 'gal-2',
    title: 'Prime Cattle Grazing in Savannah',
    category: 'Livestock',
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=1000&q=80',
    description: 'Our healthy livestock roaming the rich natural pastures of Botswana.',
    date: 'July 2026'
  },
  {
    id: 'gal-3',
    title: 'Center Pivot Irrigation in Action',
    category: 'Farm',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
    description: 'Efficient water distribution across 50 hectares of arable farmland.',
    date: 'August 2026'
  },
  {
    id: 'gal-4',
    title: 'Smart Farm Tech Dashboard',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
    description: 'Monitoring soil moisture and livestock RFID tags through our proprietary platform.',
    date: 'June 2026'
  },
  {
    id: 'gal-5',
    title: 'Drip Irrigation Setup for Vegetables',
    category: 'Horticulture',
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1000&q=80',
    description: 'Direct root hydration ensuring minimal evaporation under the African sun.',
    date: 'May 2026'
  },
  {
    id: 'gal-6',
    title: 'Veterinary Check & Herd Management',
    category: 'Livestock',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d691a4bf5?auto=format&fit=crop&w=1000&q=80',
    description: 'Routine health inspections ensuring world-class disease-free livestock standards.',
    date: 'August 2026'
  }
];

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Gabolekwe Farms Expands Horticultural Capacity with New Solar-Powered Greenhouses',
    slug: 'gabolekwe-farms-expands-horticultural-capacity-with-new-solar-powered-greenhouses',
    excerpt: 'Our latest expansion integrates cutting-edge photovoltaic energy to power automated drip irrigation and climate control systems.',
    content: 'Gabolekwe Farms is thrilled to announce the completion of our new 5-hectare solar-powered greenhouse facility. Designed to withstand regional climate variations while maximizing water efficiency, this expansion increases our organic tomato and pepper yield by over 45%. By harnessing Botswana abundant solar energy, we continue our commitment to carbon-neutral, sustainable farming.',
    date: 'August 10, 2026',
    category: 'Horticulture & Sustainability',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=1000&q=80',
    author: 'Topo Gabolekwe'
  },
  {
    id: 'news-2',
    title: 'Advancing Beef Export Standards: Meeting International Traceability Protocols',
    slug: 'advancing-beef-export-standards-meeting-international-traceability-protocols',
    excerpt: 'How our RFID tagging and rigorous animal husbandry are setting new benchmarks for Botswana livestock exports.',
    content: 'Botswana beef has long been celebrated for its superior grass-fed flavor. At Gabolekwe Farms, we have upgraded our herd tracking infrastructure with advanced biometric and RFID tagging. This allows buyers and regulators to trace every cut of beef from pasture to plate, guaranteeing uncompromised quality and food safety.',
    date: 'July 22, 2026',
    category: 'Livestock & Export',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1000&q=80',
    author: 'Dr. Mpho Gabolekwe'
  },
  {
    id: 'news-3',
    title: 'The Future of AgTech in Southern Africa: Bridging Farming and Software',
    slug: 'the-future-of-agtech-in-southern-africa-bridging-farming-and-software',
    excerpt: 'Exploring how custom farm management applications are transforming small-to-large scale agricultural productivity.',
    content: 'Agriculture is no longer just about soil and rain—it is about data. Our technology division has been piloting a comprehensive farm management suite that helps agricultural operators monitor soil sensors, forecast weather anomalies, and predict livestock feed requirements in real-time. Discover how digital tools are shaping the next decade of African farming.',
    date: 'June 15, 2026',
    category: 'Agricultural Tech',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
    author: 'Engineering Team'
  }
];

export const STATS_DATA = [
  { label: 'Hectares of Farmland', value: '1,200+' },
  { label: 'Cattle Herd Excellence', value: '4,500+' },
  { label: 'Tons of Fresh Produce/Yr', value: '3,800+' },
  { label: 'Water Efficiency Rate', value: '92%' }
];
