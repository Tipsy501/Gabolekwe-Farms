export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
  status?: 'Published' | 'Draft';
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  image: string;
  benefits: string[];
  keyFeature: string;
  status?: 'Published' | 'Draft';
}

export interface BeefProductGrade {
  id?: string;
  name: string;
  code: string;
  category?: string;
  description: string;
  idealFor: string;
  marbling: string;
  image?: string;
  packSizes?: string[];
  unit?: string;
  wholesaleAvailable?: boolean;
  enquiryButtonText?: string;
  pricing?: string;
  availability?: 'In Stock' | 'Available on Order' | 'Seasonal' | 'Out of Stock';
  status?: 'Published' | 'Draft';
  displayOrder?: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Horticulture' | 'Livestock' | 'Technology' | 'Farm';
  image: string;
  description: string;
  date: string;
  status?: 'Published' | 'Draft';
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  author: string;
  status?: 'Published' | 'Draft';
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  service: string;
  message: string;
  status: 'New' | 'Read' | 'Replied';
  createdAt: string;
}

export interface AdminUserRecord {
  id: string;
  email: string;
  role: 'Super Admin' | 'Admin';
  status: 'Active' | 'Disabled';
  createdAt: string;
}

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
  status?: 'Published' | 'Draft';
}

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

export interface SupabaseMediaRecord {
  id: string;
  cloudinary_public_id: string;
  cloudinary_url: string;
  secure_url: string;
  filename: string;
  width: number;
  height: number;
  format: string;
  file_size: number;
  folder: string;
  caption: string;
  category: string;
  uploaded_by: string;
  created_at: string;
}

export interface MediaItem {
  id: string;
  publicId: string;
  secureUrl: string;
  url: string;
  filename: string;
  width: number;
  height: number;
  format: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: string;
  folder: string;
  caption?: string;
  category?: string;
}


