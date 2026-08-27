import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  DEFAULT_SITE_CONFIG, 
  INITIAL_PHOTOS, 
  HERO_SLIDES, 
  SERVICES_LIST, 
  BEEF_GRADES, 
  GALLERY_ITEMS, 
  NEWS_ARTICLES,
  DEFAULT_HORTICULTURE_PAGE_CONFIG,
  DEFAULT_BEEF_PAGE_CONFIG,
  SiteConfig,
  HorticulturePageConfig,
  BeefPageConfig
} from '../data/defaultCMSData';
import { HeroSlide, ServiceItem, BeefProductGrade, GalleryItem, NewsArticle, Enquiry, AdminUserRecord, HorticultureProduct, MediaItem, HorticultureFeatureBlock, BeefFeatureBlock } from '../types';
import { INITIAL_HORTICULTURE_PRODUCTS } from '../data/horticultureData';
import { auth, googleProvider } from './firebase';
import { signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { saveMediaToSupabase, fetchMediaFromSupabase, deleteMediaFromSupabase, fetchCMSContentFromSupabase, fetchAllCMSContent, saveCMSContentToSupabase } from './supabase';
import { getCloudinaryConfig, uploadToCloudinary } from './cloudinary';

interface CMSContextType {
  isAdminLoggedIn: boolean;
  adminUser: any | null;
  isSuperAdmin: boolean;
  adminUsers: AdminUserRecord[];
  loginAdmin: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  registerAdmin: (email: string, pass: string) => Promise<void>;
  logoutAdmin: () => Promise<void>;
  saveAdminUser: (user: AdminUserRecord) => Promise<void>;
  deleteAdminUser: (id: string) => Promise<void>;
  
  siteConfig: SiteConfig;
  updateSiteConfig: (newConfig: Partial<SiteConfig>) => Promise<void>;
  
  photos: string[];
  mediaItems: MediaItem[];
  saveMediaItem: (item: Omit<MediaItem, 'id'> & { id?: string }) => Promise<MediaItem>;
  deleteMediaItem: (id: string, url?: string) => Promise<void>;
  uploadPhoto: (url: string, metadata?: Partial<MediaItem>) => Promise<MediaItem>;
  deletePhoto: (url: string) => Promise<void>;
  uploadFileToStorage: (file: File, onProgress?: (progress: number) => void) => Promise<string>;
  
  slides: HeroSlide[];
  saveSlide: (slide: HeroSlide) => Promise<void>;
  deleteSlide: (id: string) => Promise<void>;
  
  services: ServiceItem[];
  saveService: (service: ServiceItem) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  
  beefProducts: BeefProductGrade[];
  saveBeefProduct: (product: BeefProductGrade) => Promise<void>;
  deleteBeefProduct: (code: string) => Promise<void>;
  
  horticultureProducts: HorticultureProduct[];
  saveHorticultureProduct: (product: HorticultureProduct) => Promise<void>;
  deleteHorticultureProduct: (id: string) => Promise<void>;
  
  horticulturePageConfig: HorticulturePageConfig;
  updateHorticulturePageConfig: (newConfig: Partial<HorticulturePageConfig>) => Promise<void>;

  beefPageConfig: BeefPageConfig;
  updateBeefPageConfig: (newConfig: Partial<BeefPageConfig>) => Promise<void>;
  
  gallery: GalleryItem[];
  saveGalleryItem: (item: GalleryItem) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  
  news: NewsArticle[];
  saveNewsArticle: (article: NewsArticle) => Promise<void>;
  deleteNewsArticle: (id: string) => Promise<void>;
  
  enquiries: Enquiry[];
  submitEnquiry: (data: Omit<Enquiry, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateEnquiryStatus: (id: string, status: 'New' | 'Read' | 'Replied') => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;
  
  isLoading: boolean;
  activeAdminTab: string;
  setActiveAdminTab: (tab: string) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<any | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>([
    {
      id: 'super_admin_topo',
      email: 'topogabolekwe@gmail.com',
      role: 'Super Admin',
      status: 'Active',
      createdAt: new Date().toISOString()
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeAdminTab, setActiveAdminTab] = useState<string>('overview');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [photos, setPhotos] = useState<string[]>(INITIAL_PHOTOS);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [slides, setSlides] = useState<HeroSlide[]>(HERO_SLIDES);
  const [services, setServices] = useState<ServiceItem[]>(SERVICES_LIST);
  const [beefProducts, setBeefProducts] = useState<BeefProductGrade[]>(BEEF_GRADES);
  const [horticultureProducts, setHorticultureProducts] = useState<HorticultureProduct[]>(INITIAL_HORTICULTURE_PRODUCTS);
  const [horticulturePageConfig, setHorticulturePageConfig] = useState<HorticulturePageConfig>(DEFAULT_HORTICULTURE_PAGE_CONFIG);
  const [beefPageConfig, setBeefPageConfig] = useState<BeefPageConfig>(DEFAULT_BEEF_PAGE_CONFIG);
  const [gallery, setGallery] = useState<GalleryItem[]>(GALLERY_ITEMS);
  const [news, setNews] = useState<NewsArticle[]>(NEWS_ARTICLES);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  const userEmail = adminUser?.email?.toLowerCase().trim();
  const isSuperAdmin = userEmail === 'topogabolekwe@gmail.com' || adminUsers.some(u => u.email.toLowerCase().trim() === userEmail && u.role === 'Super Admin' && u.status === 'Active');

  // Verify authorization helper
  const verifyAuthorization = async (user: any): Promise<boolean> => {
    if (!user || !user.email) {
      setIsAdminLoggedIn(false);
      setAdminUser(null);
      return false;
    }

    const email = user.email.toLowerCase().trim();

    // Permanent Super Admin rule
    if (email === 'topogabolekwe@gmail.com') {
      setIsAdminLoggedIn(true);
      setAdminUser(user);
      return true;
    }

    // Check against authorized admins
    const isAllowed = adminUsers.some(a => a.email.toLowerCase().trim() === email && a.status === 'Active');

    if (isAllowed) {
      setIsAdminLoggedIn(true);
      setAdminUser(user);
      return true;
    } else {
      await signOut(auth);
      setIsAdminLoggedIn(false);
      setAdminUser(null);
      throw new Error(`Access Denied: The account "${user.email}" is not authorized to access the Admin Dashboard. Please request access from the Super Admin.`);
    }
  };

  // Listen to Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await verifyAuthorization(user);
        } catch (err) {
          console.warn('Authentication authorization check failed:', err);
        }
      } else {
        setIsAdminLoggedIn(false);
        setAdminUser(null);
      }
    });
    return () => unsubscribe();
  }, [adminUsers]);

  // Load CMS data from Supabase / API
  useEffect(() => {
    async function loadData() {
      try {
        console.log('[CMS Store] Initiating data hydration...');
        const allContent = await fetchAllCMSContent();

        // 1. Site Config
        const remoteConfig = allContent['site_config'];
        if (remoteConfig) {
          console.log('[CMS Store] Applied remote site_config');
          setSiteConfig({ ...DEFAULT_SITE_CONFIG, ...remoteConfig });
        } else {
          console.warn('[CMS Store Notice] site_config not in remote payload, checking fallback');
        }

        // 2. Admin Users
        const remoteAdmins = allContent['admins'];
        if (remoteAdmins && Array.isArray(remoteAdmins)) {
          if (!remoteAdmins.some(a => a.email.toLowerCase().trim() === 'topogabolekwe@gmail.com')) {
            remoteAdmins.push({
              id: 'super_admin_topo',
              email: 'topogabolekwe@gmail.com',
              role: 'Super Admin',
              status: 'Active',
              createdAt: new Date().toISOString()
            });
          }
          setAdminUsers(remoteAdmins);
        }

        // 3. Slideshow
        const remoteSlides = allContent['slides'];
        if (remoteSlides && Array.isArray(remoteSlides) && remoteSlides.length > 0) {
          console.log(`[CMS Store] Applied ${remoteSlides.length} remote slides`);
          setSlides(remoteSlides);
        }

        // 4. Services
        const remoteServices = allContent['services'];
        if (remoteServices && Array.isArray(remoteServices) && remoteServices.length > 0) {
          console.log(`[CMS Store] Applied ${remoteServices.length} remote services`);
          setServices(remoteServices);
        }

        // 5. Beef Products
        const remoteBeef = allContent['beef_products'];
        if (remoteBeef && Array.isArray(remoteBeef) && remoteBeef.length > 0) {
          console.log(`[CMS Store] Applied ${remoteBeef.length} remote beef products`);
          setBeefProducts(remoteBeef);
        }

        // 6. Horticulture Products
        const remoteHort = allContent['horticulture_products'];
        if (remoteHort && Array.isArray(remoteHort) && remoteHort.length > 0) {
          console.log(`[CMS Store] Applied ${remoteHort.length} remote horticulture products`);
          setHorticultureProducts(remoteHort);
        }

        // 7. Horticulture Page Config
        const remoteHortPage = allContent['horticulture_page'];
        if (remoteHortPage) {
          setHorticulturePageConfig({ ...DEFAULT_HORTICULTURE_PAGE_CONFIG, ...remoteHortPage });
        }

        // 8. Beef Page Config
        const remoteBeefPage = allContent['beef_page'];
        if (remoteBeefPage) {
          setBeefPageConfig({ ...DEFAULT_BEEF_PAGE_CONFIG, ...remoteBeefPage });
        }

        // 9. Gallery
        const remoteGallery = allContent['gallery'];
        if (remoteGallery && Array.isArray(remoteGallery) && remoteGallery.length > 0) {
          console.log(`[CMS Store] Applied ${remoteGallery.length} remote gallery items`);
          setGallery(remoteGallery);
        }

        // 10. News
        const remoteNews = allContent['news'];
        if (remoteNews && Array.isArray(remoteNews) && remoteNews.length > 0) {
          console.log(`[CMS Store] Applied ${remoteNews.length} remote news articles`);
          setNews(remoteNews);
        }

        // 11. Enquiries
        const remoteEnquiries = allContent['enquiries'];
        if (remoteEnquiries && Array.isArray(remoteEnquiries)) {
          setEnquiries(remoteEnquiries);
        }

        // 12. Media Metadata & Photos
        let loadedMedia: MediaItem[] = [];
        try {
          loadedMedia = await fetchMediaFromSupabase();
          if (loadedMedia.length > 0) {
            setMediaItems(loadedMedia);
            const mediaUrls = loadedMedia.map(m => m.secureUrl || m.url).filter(Boolean);
            setPhotos(mediaUrls);
          }
        } catch (mErr) {
          console.error('[CMS Store] Error fetching media metadata:', mErr);
        }

        if (Object.keys(allContent).length === 0) {
          console.error('[CMS Store Critical Error] No CMS content was retrieved from Supabase or /api/cms. Ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are configured in Vercel Production Environment Variables.');
        }

      } catch (err) {
        console.error('[CMS Store Fatal Exception] Error loading content from Supabase:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Auth methods
  const loginAdmin = async (email: string, pass: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      await verifyAuthorization(cred.user);
    } catch (err: any) {
      if (err.code === 'auth/unauthorized-domain') {
        throw new Error(`Firebase Error (auth/unauthorized-domain): The domain "${window.location.hostname}" is not authorized in Firebase. Please add this domain to Firebase Console -> Authentication -> Settings -> Authorized domains.`);
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password. Please check your credentials.');
      } else if (err.code === 'auth/too-many-requests') {
        throw new Error('Too many unsuccessful login attempts. Please try again later.');
      }
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await verifyAuthorization(cred.user);
    } catch (err: any) {
      if (err.code === 'auth/unauthorized-domain') {
        throw new Error(`Firebase Error (auth/unauthorized-domain): The domain "${window.location.hostname}" is not authorized in Firebase. Please add this domain to Firebase Console -> Authentication -> Settings -> Authorized domains.`);
      } else if (err.code === 'auth/popup-closed-by-user') {
        throw new Error('Google Sign-In popup was closed before completing login.');
      } else if (err.code === 'auth/popup-blocked') {
        throw new Error('Sign-In popup was blocked by your browser. Please allow popups for this site.');
      }
      throw err;
    }
  };

  const registerAdmin = async (email: string, pass: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await verifyAuthorization(cred.user);
    } catch (err: any) {
      if (err.code === 'auth/unauthorized-domain') {
        throw new Error(`Firebase Error (auth/unauthorized-domain): The domain "${window.location.hostname}" is not authorized in Firebase. Please add this domain to Firebase Console -> Authentication -> Settings -> Authorized domains.`);
      } else if (err.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email address already exists. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters long.');
      }
      throw err;
    }
  };

  const logoutAdmin = async () => {
    await signOut(auth);
    setIsAdminLoggedIn(false);
    setAdminUser(null);
  };

  // Admin User Management methods
  const saveAdminUser = async (userRecord: AdminUserRecord) => {
    if (!isSuperAdmin) {
      throw new Error('Only Super Admin can manage administrator users.');
    }
    if (userRecord.email === 'topogabolekwe@gmail.com' && (userRecord.role !== 'Super Admin' || userRecord.status !== 'Active')) {
      throw new Error('Cannot demote or disable the permanent Super Admin.');
    }
    const exists = adminUsers.some(u => u.id === userRecord.id);
    const updated = exists ? adminUsers.map(u => u.id === userRecord.id ? userRecord : u) : [...adminUsers, userRecord];
    setAdminUsers(updated);
    try {
      await saveCMSContentToSupabase('admins', updated);
    } catch (err) {
      console.error('Error saving admin user:', err);
      throw err;
    }
  };

  const deleteAdminUser = async (id: string) => {
    if (!isSuperAdmin) {
      throw new Error('Only Super Admin can remove administrator users.');
    }
    const target = adminUsers.find(u => u.id === id);
    if (target?.email === 'topogabolekwe@gmail.com') {
      throw new Error('Cannot remove the permanent Super Admin.');
    }
    const updated = adminUsers.filter(u => u.id !== id);
    setAdminUsers(updated);
    try {
      await saveCMSContentToSupabase('admins', updated);
    } catch (err) {
      console.error('Error deleting admin user:', err);
      throw err;
    }
  };

  // Updaters
  const updateSiteConfig = async (newConfig: Partial<SiteConfig>) => {
    const updated = { ...siteConfig, ...newConfig };
    setSiteConfig(updated);
    try {
      await saveCMSContentToSupabase('site_config', updated);
    } catch (err) {
      console.error('Error saving config to Supabase:', err);
    }
  };

  const uploadFileToStorage = async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    const config = getCloudinaryConfig();
    if (!config.cloudName || !config.uploadPreset) {
      throw new Error(
        'Cloudinary configuration is incomplete. Please configure VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET or enter your Cloud Name and Unsigned Upload Preset in the Media Library settings.'
      );
    }
    const result = await uploadToCloudinary(file, config.cloudName, config.uploadPreset, onProgress);
    return result.optimizedUrl;
  };

  const saveMediaItem = async (itemData: Omit<MediaItem, 'id'> & { id?: string }): Promise<MediaItem> => {
    const mediaId = itemData.id || (itemData.publicId ? itemData.publicId.replace(/[/.]/g, '_') : `media_${Date.now()}`);
    const mediaDoc: MediaItem = {
      id: mediaId,
      publicId: itemData.publicId || '',
      secureUrl: itemData.secureUrl || itemData.url || '',
      url: itemData.url || itemData.secureUrl || '',
      filename: itemData.filename || 'image',
      width: itemData.width || 0,
      height: itemData.height || 0,
      format: itemData.format || 'jpg',
      fileSize: itemData.fileSize || 0,
      uploadedAt: itemData.uploadedAt || new Date().toISOString(),
      uploadedBy: itemData.uploadedBy || adminUser?.email || 'admin@gabolekwefarms.co.bw',
      folder: itemData.folder || 'general',
      caption: itemData.caption || '',
      category: itemData.category || 'general'
    };

    console.log('[CMS Store] Inserting media record into Supabase PostgreSQL database:', mediaDoc);

    // Save metadata record directly to Supabase PostgreSQL database (No Firestore calls!)
    const savedItem = await saveMediaToSupabase(mediaDoc);
    console.log('[CMS Store] Supabase PostgreSQL record saved successfully:', savedItem.id);

    // Update local React state immediately
    setMediaItems(prev => {
      const exists = prev.some(m => m.id === savedItem.id);
      return exists ? prev.map(m => m.id === savedItem.id ? savedItem : m) : [savedItem, ...prev];
    });

    const urlToSave = savedItem.secureUrl || savedItem.url;
    setPhotos(prev => Array.from(new Set([urlToSave, ...prev])));

    return savedItem;
  };

  const deleteMediaItem = async (id: string, url?: string) => {
    setMediaItems(prev => prev.filter(m => m.id !== id));
    if (url) {
      setPhotos(prev => prev.filter(p => p !== url));
    }
    try {
      await deleteMediaFromSupabase(id);
      console.log('[CMS Store] Deleted media record from Supabase:', id);
    } catch (err) {
      console.error('[CMS Store] Error deleting media record from Supabase:', err);
    }
  };

  const uploadPhoto = async (url: string, metadata?: Partial<MediaItem>): Promise<MediaItem> => {
    const publicIdMatch = url.match(/\/v\d+\/([^/.]+)/);
    const derivedPublicId = publicIdMatch ? publicIdMatch[1] : `img_${Date.now()}`;

    return await saveMediaItem({
      publicId: metadata?.publicId || derivedPublicId,
      secureUrl: metadata?.secureUrl || url,
      url: url,
      filename: metadata?.filename || 'image',
      width: metadata?.width || 0,
      height: metadata?.height || 0,
      format: metadata?.format || 'jpg',
      fileSize: metadata?.fileSize || 0,
      uploadedAt: metadata?.uploadedAt || new Date().toISOString(),
      uploadedBy: metadata?.uploadedBy || adminUser?.email || 'admin@gabolekwefarms.co.bw',
      folder: metadata?.folder || 'general',
      caption: metadata?.caption || ''
    });
  };

  const deletePhoto = async (url: string) => {
    const updated = photos.filter(p => p !== url);
    setPhotos(updated);
    const mediaMatch = mediaItems.find(m => m.secureUrl === url || m.url === url);
    if (mediaMatch) {
      await deleteMediaItem(mediaMatch.id, url);
    }
  };

  const saveSlide = async (slide: HeroSlide) => {
    const exists = slides.some(s => s.id === slide.id);
    const updated = exists ? slides.map(s => s.id === slide.id ? slide : s) : [...slides, slide];
    setSlides(updated);
    try {
      await saveCMSContentToSupabase('slides', updated);
    } catch (err) {
      console.error('Error saving slide:', err);
    }
  };

  const deleteSlide = async (id: string) => {
    const updated = slides.filter(s => s.id !== id);
    setSlides(updated);
    try {
      await saveCMSContentToSupabase('slides', updated);
    } catch (err) {
      console.error('Error deleting slide:', err);
    }
  };

  const saveService = async (service: ServiceItem) => {
    const exists = services.some(s => s.id === service.id);
    const updated = exists ? services.map(s => s.id === service.id ? service : s) : [...services, service];
    setServices(updated);
    try {
      await saveCMSContentToSupabase('services', updated);
    } catch (err) {
      console.error('Error saving service:', err);
    }
  };

  const deleteService = async (id: string) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    try {
      await saveCMSContentToSupabase('services', updated);
    } catch (err) {
      console.error('Error deleting service:', err);
    }
  };

  const saveBeefProduct = async (product: BeefProductGrade) => {
    const exists = beefProducts.some(p => p.code === product.code);
    const updated = exists ? beefProducts.map(p => p.code === product.code ? product : p) : [...beefProducts, product];
    setBeefProducts(updated);
    try {
      await saveCMSContentToSupabase('beef_products', updated);
    } catch (err) {
      console.error('Error saving beef product:', err);
    }
  };

  const deleteBeefProduct = async (code: string) => {
    const updated = beefProducts.filter(p => p.code !== code);
    setBeefProducts(updated);
    try {
      await saveCMSContentToSupabase('beef_products', updated);
    } catch (err) {
      console.error('Error deleting beef product:', err);
    }
  };

  const saveHorticultureProduct = async (product: HorticultureProduct) => {
    const exists = horticultureProducts.some(p => p.id === product.id);
    const updated = exists ? horticultureProducts.map(p => p.id === product.id ? product : p) : [...horticultureProducts, product];
    setHorticultureProducts(updated);
    try {
      await saveCMSContentToSupabase('horticulture_products', updated);
    } catch (err) {
      console.error('Error saving horticulture product:', err);
    }
  };

  const deleteHorticultureProduct = async (id: string) => {
    const updated = horticultureProducts.filter(p => p.id !== id);
    setHorticultureProducts(updated);
    try {
      await saveCMSContentToSupabase('horticulture_products', updated);
    } catch (err) {
      console.error('Error deleting horticulture product:', err);
    }
  };

  const updateHorticulturePageConfig = async (newConfig: Partial<HorticulturePageConfig>) => {
    const updated = { ...horticulturePageConfig, ...newConfig };
    setHorticulturePageConfig(updated);
    try {
      await saveCMSContentToSupabase('horticulture_page', updated);
    } catch (err) {
      console.error('Error saving horticulture_page:', err);
    }
  };

  const updateBeefPageConfig = async (newConfig: Partial<BeefPageConfig>) => {
    const updated = { ...beefPageConfig, ...newConfig };
    setBeefPageConfig(updated);
    try {
      await saveCMSContentToSupabase('beef_page', updated);
    } catch (err) {
      console.error('Error saving beef_page:', err);
    }
  };

  const saveGalleryItem = async (item: GalleryItem) => {
    const exists = gallery.some(g => g.id === item.id);
    const updated = exists ? gallery.map(g => g.id === item.id ? item : g) : [...gallery, item];
    setGallery(updated);
    try {
      await saveCMSContentToSupabase('gallery', updated);
    } catch (err) {
      console.error('Error saving gallery item:', err);
    }
  };

  const deleteGalleryItem = async (id: string) => {
    const updated = gallery.filter(g => g.id !== id);
    setGallery(updated);
    try {
      await saveCMSContentToSupabase('gallery', updated);
    } catch (err) {
      console.error('Error deleting gallery item:', err);
    }
  };

  const saveNewsArticle = async (article: NewsArticle) => {
    const exists = news.some(n => n.id === article.id);
    const updated = exists ? news.map(n => n.id === article.id ? article : n) : [...news, article];
    setNews(updated);
    try {
      await saveCMSContentToSupabase('news', updated);
    } catch (err) {
      console.error('Error saving news article:', err);
    }
  };

  const deleteNewsArticle = async (id: string) => {
    const updated = news.filter(n => n.id !== id);
    setNews(updated);
    try {
      await saveCMSContentToSupabase('news', updated);
    } catch (err) {
      console.error('Error deleting news article:', err);
    }
  };

  const submitEnquiry = async (data: Omit<Enquiry, 'id' | 'status' | 'createdAt'>) => {
    const newEnq: Enquiry = {
      ...data,
      id: 'enq_' + Date.now() + Math.random().toString(36).substring(2, 7),
      status: 'New',
      createdAt: new Date().toISOString()
    };
    const updated = [newEnq, ...enquiries];
    setEnquiries(updated);
    try {
      await saveCMSContentToSupabase('enquiries', updated);
    } catch (err) {
      console.error('Error submitting enquiry:', err);
    }
  };

  const updateEnquiryStatus = async (id: string, status: 'New' | 'Read' | 'Replied') => {
    const updated = enquiries.map(e => e.id === id ? { ...e, status } : e);
    setEnquiries(updated);
    try {
      await saveCMSContentToSupabase('enquiries', updated);
    } catch (err) {
      console.error('Error updating enquiry status:', err);
    }
  };

  const deleteEnquiry = async (id: string) => {
    const updated = enquiries.filter(e => e.id !== id);
    setEnquiries(updated);
    try {
      await saveCMSContentToSupabase('enquiries', updated);
    } catch (err) {
      console.error('Error deleting enquiry:', err);
    }
  };

  return (
    <CMSContext.Provider value={{
      isAdminLoggedIn,
      adminUser,
      isSuperAdmin,
      adminUsers,
      loginAdmin,
      loginWithGoogle,
      registerAdmin,
      logoutAdmin,
      saveAdminUser,
      deleteAdminUser,
      siteConfig,
      updateSiteConfig,
      photos,
      mediaItems,
      saveMediaItem,
      deleteMediaItem,
      uploadPhoto,
      deletePhoto,
      uploadFileToStorage,
      slides,
      saveSlide,
      deleteSlide,
      services,
      saveService,
      deleteService,
      beefProducts,
      saveBeefProduct,
      deleteBeefProduct,
      horticultureProducts,
      saveHorticultureProduct,
      deleteHorticultureProduct,
      horticulturePageConfig,
      updateHorticulturePageConfig,
      beefPageConfig,
      updateBeefPageConfig,
      gallery,
      saveGalleryItem,
      deleteGalleryItem,
      news,
      saveNewsArticle,
      deleteNewsArticle,
      enquiries,
      submitEnquiry,
      updateEnquiryStatus,
      deleteEnquiry,
      isLoading,
      activeAdminTab,
      setActiveAdminTab,
      isAdminOpen,
      setIsAdminOpen
    }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
