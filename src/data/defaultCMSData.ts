import { HERO_SLIDES, SERVICES_LIST, BEEF_GRADES, GALLERY_ITEMS, NEWS_ARTICLES } from './mockData';

export interface HorticultureFeatureBlock {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
}

export interface HorticulturePageConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroCta: string;
  badgeText: string;
  introBadge: string;
  introHeading: string;
  introParagraph1: string;
  introParagraph2: string;
  introImage: string;
  featureBlocks: HorticultureFeatureBlock[];
  produceHeading: string;
  produceDescription: string;
}

export const DEFAULT_HORTICULTURE_PAGE_CONFIG: HorticulturePageConfig = {
  heroTitle: 'Horticulture Division',
  heroSubtitle: 'Cultivating nutrient-dense cabbage, tomatoes, spinach, rape, chomolia, and green peppers using precision irrigation and sustainable soil stewardship across fertile Botswana lands.',
  heroImage: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=2000&q=80',
  heroCta: 'Explore Fresh Produce',
  badgeText: 'Gweta, Botswana • Farm-Fresh Produce',
  introBadge: 'Sustainable Agriculture in Gweta',
  introHeading: 'Grown with Care, Harvested at Peak Freshness',
  introParagraph1: "At Gabolekwe Farms, our horticulture division combines advanced agricultural techniques with deep respect for Botswana's natural environment. We manage dedicated acreage utilizing precision drip irrigation, solar-powered greenhouse propagation, and rigorous post-harvest handling to guarantee premium quality vegetables.",
  introParagraph2: 'We take pride in supplying local markets, grocery vendors, safari lodges, and wholesale buyers across Gweta, Maun, and surrounding regions with reliable, fresh produce that meets the highest standards of food safety and nutritional integrity.',
  introImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1200&q=80',
  featureBlocks: [
    {
      id: 'feat-1',
      title: 'Drip Irrigation',
      description: 'Optimized water delivery directly to plant roots, minimizing evaporation under the African sun.',
      icon: 'Droplets'
    },
    {
      id: 'feat-2',
      title: 'Solar Greenhouses',
      description: 'Protected cultivation environments ensuring continuous, year-round harvest resilience.',
      icon: 'Sun'
    },
    {
      id: 'feat-3',
      title: 'Certified Fresh',
      description: 'Direct farm-to-market supply chains ensuring zero cold-chain lag.',
      icon: 'ShieldCheck'
    }
  ],
  produceHeading: 'What We Produce',
  produceDescription: 'Our core horticultural output is cultivated specifically for nutritional density, robust flavor, and dependable commercial supply.'
};

export interface BeefFeatureBlock {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
}

export interface BeefPageConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroCta: string;
  badgeText: string;
  whatsappCtaText: string;
  whatsappNumber: string;
  
  introEyebrow: string;
  introHeading: string;
  introParagraph1: string;
  introParagraph2: string;
  introImage: string;

  featureBlocks: BeefFeatureBlock[];

  wholesaleHeading: string;
  wholesaleDescription: string;
  wholesaleWhatsappText: string;
  wholesalePhone: string;
  wholesaleEmail: string;
  wholesaleCtaText: string;
}

export const DEFAULT_BEEF_PAGE_CONFIG: BeefPageConfig = {
  heroTitle: 'World-Class Botswana Beef',
  heroSubtitle: 'Raised on pristine Savannah grasslands with rigorous ethical husbandry, natural forage, and complete veterinary compliance from pasture to wholesale market.',
  heroImage: 'https://images.unsplash.com/photo-1545936856-d713c23945a8?auto=format&fit=crop&w=2000&q=80',
  heroCta: 'Explore Beef Products',
  badgeText: 'Gweta, Botswana • Export Quality Standards',
  whatsappCtaText: 'WhatsApp Wholesale Chat',
  whatsappNumber: '+267 73004101',

  introEyebrow: 'Excellence in Livestock Husbandry',
  introHeading: 'Pristine Grasslands & Ethical Stewardship',
  introParagraph1: 'Gabolekwe Farms manages robust herds of cattle and goats nurtured across expansive Gweta grazing lands. Supported by our on-site animal feed cultivation and rigorous veterinary care, our livestock thrive in natural conditions that produce exceptionally tender, flavorful beef.',
  introParagraph2: 'We supply quality beef cuts, quarters, and wholesale boxes to local butcheries, safari lodges, commercial vendors, and regional buyers who demand unwavering quality and strict health compliance.',
  introImage: 'https://images.unsplash.com/photo-1545936856-d713c23945a8?auto=format&fit=crop&w=1200&q=80',

  featureBlocks: [
    {
      id: 'beef-feat-1',
      title: 'Veterinary Compliance',
      description: 'Strict adherence to Botswana Department of Veterinary Services health regulations.',
      icon: 'ShieldCheck'
    },
    {
      id: 'beef-feat-2',
      title: 'Premium Cuts',
      description: 'Carefully butchered prime steaks, roasts, and wholesale boxes for every culinary need.',
      icon: 'Award'
    },
    {
      id: 'beef-feat-3',
      title: 'Traceable Herd',
      description: 'Full lifecycle tracking from Savannah pasture to wholesale delivery.',
      icon: 'Beef'
    }
  ],

  wholesaleHeading: 'Wholesale & Direct Orders',
  wholesaleDescription: 'Contact our Gweta dispatch desk for bulk orders, wholesale boxes, restaurant supplies, and custom cuts.',
  wholesaleWhatsappText: 'Chat on WhatsApp',
  wholesalePhone: '+267 72 820 542 / +267 74 061 099',
  wholesaleEmail: 'gabolekwefarms@gmail.com',
  wholesaleCtaText: 'Submit Wholesale Enquiry'
};

export interface SiteConfig {
  logoUrl: string;
  faviconUrl?: string;
  siteName: string;
  tagline: string;
  aboutTitle: string;
  aboutSubtitle: string;
  aboutMission: string;
  aboutVision: string;
  aboutHistory: string;
  aboutImage: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  whatsapp?: string;
  seoTitle?: string;
  seoDescription?: string;
  horticultureHeroTitle?: string;
  horticultureHeroSubtitle?: string;
  horticultureHeroImage?: string;
  horticultureHeroCta?: string;
  beefHeroTitle?: string;
  beefHeroSubtitle?: string;
  beefHeroImage?: string;
  beefHeroCta?: string;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  logoUrl: 'https://res.cloudinary.com/kxeewabw/image/upload/f_auto,q_auto/v1787575823/gabolekwe_farms/pzznrgfr5vbcpnrklde8.png',
  faviconUrl: 'https://res.cloudinary.com/kxeewabw/image/upload/f_auto,q_auto/v1787575823/gabolekwe_farms/pzznrgfr5vbcpnrklde8.png',
  siteName: 'Gabolekwe Farms',
  tagline: 'Growing quality. Building agriculture.',
  aboutTitle: 'Gabolekwe Farms in Gweta, Botswana',
  aboutSubtitle: 'A proud Botswana agricultural enterprise dedicated to sustainable livestock production, animal feed, and fresh horticultural produce.',
  aboutMission: 'To sustainably produce quality beef, livestock, and fresh vegetables while supplying local markets, vendors, and lodges with reliable agricultural produce.',
  aboutVision: 'To be a trusted commercial agricultural enterprise in Botswana, advancing food security, sustainable livestock management, and agricultural innovation.',
  aboutHistory: 'Based in Gweta, Botswana, Gabolekwe Farms is a commercial agricultural enterprise engaged in cattle and goat production, animal feed cultivation, and diverse horticulture. The farm produces fresh vegetables including cabbage, tomatoes, spinach, rape, chomolia, and green pepper, proudly supplying local markets, vendors, and lodges in Gweta, Maun, and surrounding areas.',
  aboutImage: 'https://res.cloudinary.com/kxeewabw/image/upload/f_auto,q_auto/v1787214894/gabolekwe_farms/nqnaass5utnapmqvqdgv.jpg',
  address: 'Gweta, Botswana',
  phone: '+267 72 820 542 / +267 74 061 099 / +267 73 004 101',
  email: 'gabolekwefarms@gmail.com',
  hours: 'Monday – Friday: 07:30 - 17:00 | Saturday: 08:00 - 13:00',
  facebook: 'https://www.facebook.com/gabolekwefarms',
  twitter: 'https://twitter.com/gabolekwefarms',
  linkedin: 'https://linkedin.com/company/gabolekwe-farms',
  instagram: 'https://instagram.com/gabolekwefarms',
  whatsapp: '+267 73004101',
  seoTitle: 'Gabolekwe Farms — Agricultural Excellence in Gweta, Botswana',
  seoDescription: 'Gabolekwe Farms is a commercial agricultural enterprise in Gweta, Botswana specializing in fresh horticulture produce, commercial beef products, irrigation design, and farm management technology.',
  horticultureHeroTitle: 'Horticulture Division',
  horticultureHeroSubtitle: 'Cultivating nutrient-dense cabbage, tomatoes, spinach, rape, chomolia, and green peppers using precision irrigation and sustainable soil stewardship across fertile Botswana lands.',
  horticultureHeroImage: 'https://res.cloudinary.com/kxeewabw/image/upload/f_auto,q_auto/v1787213783/gabolekwe_farms/kwwdowwthlnbhbrm2bpf.jpg',
  horticultureHeroCta: 'Explore Fresh Produce',
  beefHeroTitle: 'World-Class Botswana Beef',
  beefHeroSubtitle: 'Raised on pristine Savannah grasslands with rigorous ethical husbandry, natural forage, and complete veterinary compliance from pasture to wholesale market.',
  beefHeroImage: 'https://res.cloudinary.com/kxeewabw/image/upload/f_auto,q_auto/v1787213651/gabolekwe_farms/gwzgtej4lehsqnoxmmil.jpg',
  beefHeroCta: 'Explore Beef Grades'
};

export const INITIAL_PHOTOS = [
  'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1545936856-d713c23945a8?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80'
];

export { HERO_SLIDES, SERVICES_LIST, BEEF_GRADES, GALLERY_ITEMS, NEWS_ARTICLES };
