import React, { useState } from 'react';
import { useCMS } from '../lib/cmsStore';
import { MediaPickerModal } from './MediaPickerModal';
import { 
  LayoutDashboard, 
  Mail, 
  FileText, 
  Briefcase, 
  Sprout, 
  Beef, 
  Grid, 
  Newspaper, 
  Image as ImageIcon, 
  Users, 
  Settings, 
  ArrowLeft, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Search, 
  Phone, 
  MessageSquare, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Eye, 
  Menu,
  Upload,
  Globe,
  Tag,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { HeroSlide, ServiceItem, BeefProductGrade, GalleryItem, NewsArticle, Enquiry, AdminUserRecord, HorticultureProduct } from '../types';
import { INITIAL_HORTICULTURE_PRODUCTS } from '../data/horticultureData';
import { HorticulturePageConfig, HorticultureFeatureBlock, DEFAULT_HORTICULTURE_PAGE_CONFIG, BeefPageConfig, BeefFeatureBlock, DEFAULT_BEEF_PAGE_CONFIG } from '../data/defaultCMSData';

export const AdminDashboard: React.FC = () => {
  const { 
    logoutAdmin, 
    siteConfig, 
    updateSiteConfig,
    photos,
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
    updateEnquiryStatus,
    deleteEnquiry,
    activeAdminTab,
    setActiveAdminTab,
    adminUser,
    isSuperAdmin,
    adminUsers,
    saveAdminUser,
    deleteAdminUser
  } = useCMS();

  // Local state for modals & forms
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);

  // Media Library Picker Modal state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerCallback, setPickerCallback] = useState<((url: string) => void) | null>(null);

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 4500);
  };

  const openMediaPickerFor = (onSelect: (url: string) => void) => {
    setPickerCallback(() => onSelect);
    setPickerOpen(true);
  };

  // Form states for edits
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editingBeef, setEditingBeef] = useState<BeefProductGrade | null>(null);
  const [editingHorticulture, setEditingHorticulture] = useState<HorticultureProduct | null>(null);
  const [editingFeatureBlock, setEditingFeatureBlock] = useState<HorticultureFeatureBlock | null>(null);
  const [editingBeefFeatureBlock, setEditingBeefFeatureBlock] = useState<BeefFeatureBlock | null>(null);
  const [horticultureSubTab, setHorticultureSubTab] = useState<'intro' | 'features' | 'produce' | 'products'>('intro');
  const [beefSubTab, setBeefSubTab] = useState<'intro' | 'features' | 'products' | 'wholesale'>('intro');
  const [hortPageForm, setHortPageForm] = useState<HorticulturePageConfig>(horticulturePageConfig || DEFAULT_HORTICULTURE_PAGE_CONFIG);
  const [beefPageForm, setBeefPageForm] = useState<BeefPageConfig>(beefPageConfig || DEFAULT_BEEF_PAGE_CONFIG);

  React.useEffect(() => {
    if (horticulturePageConfig) {
      setHortPageForm(horticulturePageConfig);
    }
  }, [horticulturePageConfig]);

  React.useEffect(() => {
    if (beefPageConfig) {
      setBeefPageForm(beefPageConfig);
    }
  }, [beefPageConfig]);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<AdminUserRecord | null>(null);

  // Enquiry filters & detail view
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryFilter, setEnquiryFilter] = useState<'All' | 'New' | 'Read' | 'Replied'>('All');

  // Site Config state
  const [configForm, setConfigForm] = useState(siteConfig);

  React.useEffect(() => {
    setConfigForm(siteConfig);
  }, [siteConfig]);

  // Automatically mark enquiry as read when opened if currently New
  React.useEffect(() => {
    if (selectedEnquiry && selectedEnquiry.status === 'New') {
      updateEnquiryStatus(selectedEnquiry.id, 'Read').catch(err => {
        console.warn('Failed to auto-mark enquiry as read:', err);
      });
      setSelectedEnquiry(prev => prev ? { ...prev, status: 'Read' } : null);
    }
  }, [selectedEnquiry?.id]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteConfig(configForm);
    showSuccess('Site settings updated successfully!');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    try {
      const downloadUrl = await uploadFileToStorage(file);
      await uploadPhoto(downloadUrl);
      showSuccess('Image uploaded successfully to Firebase Storage!');
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingFile(false);
    }
  };

  // Derived metrics
  const newEnquiriesCount = enquiries.filter(e => e.status === 'New').length;
  const publishedNewsCount = news.filter(n => n.status !== 'Draft').length;
  const activeHortProducts = horticultureProducts && horticultureProducts.length > 0 ? horticultureProducts : INITIAL_HORTICULTURE_PRODUCTS;

  const filteredEnquiries = enquiries.filter(e => {
    const matchesFilter = enquiryFilter === 'All' || e.status === enquiryFilter;
    const matchesSearch = enquirySearch === '' || 
      e.name.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      e.email.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      e.subject.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      e.service.toLowerCase().includes(enquirySearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sidebarNavItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'enquiries', label: 'Messages', icon: Mail, badge: newEnquiriesCount > 0 ? `${newEnquiriesCount} New` : undefined },
    { id: 'pages', label: 'Pages / Content', icon: FileText },
    { id: 'services', label: 'Services', icon: Briefcase, count: services.length },
    { id: 'horticulture_page', label: 'Horticulture Page', icon: Sprout, count: activeHortProducts.length },
    { id: 'beef_page', label: 'Beef Page', icon: Beef, count: beefProducts.length },
    { id: 'gallery', label: 'Gallery Showcase', icon: Grid, count: gallery.length },
    { id: 'news', label: 'News & Media', icon: Newspaper, count: news.length },
    { id: 'photos', label: 'Media Library', icon: ImageIcon, count: photos.length },
    { id: 'admins', label: 'Users & Access', icon: Users, count: adminUsers.length },
    { id: 'config', label: 'Site Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0A0C0A] text-[#F8F9FA] font-sans antialiased flex flex-col lg:flex-row selection:bg-[#A4C293] selection:text-[#0A0C0A]">
      
      {/* Toast Notification */}
      {successMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#A4C293] text-[#0A0C0A] px-5 py-3.5 shadow-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-white/20 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* MOBILE TOP BAR */}
      <div className="lg:hidden bg-[#0A0C0A] border-b border-white/10 p-4 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#A4C293]/20 border border-[#A4C293]/40 flex items-center justify-center font-serif font-bold text-[#A4C293]">
            G
          </div>
          <div>
            <span className="text-xs font-serif font-bold tracking-tight block">GABOLEKWE FARMS</span>
            <span className="text-[9px] uppercase tracking-widest text-[#A4C293] font-semibold block">Admin Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { window.location.href = '/'; }}
            className="p-2 bg-white/5 hover:bg-white/10 text-white/80 rounded"
            title="Public Site"
          >
            <Globe className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-white/10 text-white rounded focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE SLIDE-OUT MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#0A0C0A]/95 backdrop-blur-md flex flex-col p-6 overflow-y-auto">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <span className="text-sm font-serif font-bold text-white">Dashboard Navigation</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white/60 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-1 flex-1">
            {sidebarNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeAdminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveAdminTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-colors ${
                    isActive 
                      ? 'bg-[#A4C293] text-[#0A0C0A]' 
                      : 'text-white/80 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-white/10 space-y-3 mt-6">
            <button
              onClick={() => { window.location.href = '/'; }}
              className="w-full py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Public Website</span>
            </button>
            <button
              onClick={logoutAdmin}
              className="w-full py-3 bg-red-950/60 hover:bg-red-900/60 text-red-200 border border-red-500/30 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#0A0C0A] border-r border-white/10 shrink-0 sticky top-0 h-screen overflow-y-auto">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded bg-[#A4C293]/20 border border-[#A4C293]/40 flex items-center justify-center font-serif font-bold text-[#A4C293] text-lg">
              G
            </div>
            <div>
              <h1 className="text-sm font-serif font-bold tracking-tight text-white">GABOLEKWE FARMS</h1>
              <span className="text-[9px] uppercase tracking-widest text-[#A4C293] font-semibold block">Administration Portal</span>
            </div>
          </div>
          <p className="text-[10px] text-white/50 leading-tight">
            Gweta, Botswana • Agribusiness Management System
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5 flex-1">
          {sidebarNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeAdminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveAdminTab(item.id)}
                className={`w-full text-left px-3.5 py-3 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all group ${
                  isActive 
                    ? 'bg-[#A4C293]/15 text-[#A4C293] border-l-4 border-[#A4C293]' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[#A4C293]' : 'text-white/40 group-hover:text-white'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="px-2 py-0.5 bg-emerald-500 text-[#0A0C0A] text-[9px] font-extrabold rounded-full animate-pulse">
                    {item.badge}
                  </span>
                ) : item.count !== undefined ? (
                  <span className="text-[10px] text-white/40 font-mono group-hover:text-white/60">
                    {item.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* User Account & Actions Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 space-y-3">
          <div className="p-3 bg-black/50 border border-white/10 rounded">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] uppercase tracking-widest text-[#A4C293] font-bold">
                {isSuperAdmin ? 'Super Admin' : 'Admin'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <p className="text-xs font-mono text-white/90 truncate">{adminUser?.email || 'topogabolekwe@gmail.com'}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { window.location.href = '/'; }}
              className="py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 rounded transition-colors"
              title="Visit Website"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Site</span>
            </button>
            <button
              onClick={logoutAdmin}
              className="py-2.5 px-3 bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 text-red-200 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 rounded transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0E120E] overflow-y-auto">
        
        {/* TOP BAR DESKTOP HEADER */}
        <header className="hidden lg:flex items-center justify-between px-8 py-5 border-b border-white/10 bg-[#0A0C0A]/60 backdrop-blur-md sticky top-0 z-30">
          <div>
            <span className="text-[10px] text-[#A4C293] font-mono uppercase tracking-widest font-bold block">
              Admin / {sidebarNavItems.find(i => i.id === activeAdminTab)?.label}
            </span>
            <h2 className="text-xl font-serif text-white font-semibold">
              {sidebarNavItems.find(i => i.id === activeAdminTab)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/60 border border-emerald-500/30 rounded text-emerald-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Firestore Sync Online</span>
            </div>

            <button
              onClick={() => { window.location.href = '/'; }}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 rounded transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Site</span>
            </button>
          </div>
        </header>

        {/* CONTENT TAB VIEWS */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">

          {/* Global Toast Banners */}
          {successMsg && (
            <div className="bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 px-6 py-4 rounded-lg flex items-center justify-between shadow-xl animate-fade-in">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">{successMsg}</span>
              </div>
              <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-950/90 border border-red-500/50 text-red-200 px-6 py-4 rounded-lg flex items-center justify-between shadow-xl animate-fade-in">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">{errorMsg}</span>
              </div>
              <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 1. DASHBOARD OVERVIEW TAB */}
          {activeAdminTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Header Welcome Banner */}
              <div className="bg-gradient-to-r from-emerald-950/40 via-[#121612] to-[#0A0C0A] border border-white/10 p-6 sm:p-8 rounded-lg relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A4C293]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Administrator Control Center</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif text-white">
                    Welcome back, <span className="text-[#A4C293]">Administrator</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 max-w-2xl leading-relaxed">
                    Manage content, respond to customer enquiries, publish farm updates, and oversee products for Gabolekwe Farms in Gweta, Botswana.
                  </p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                
                {/* Metric 1: Messages */}
                <div 
                  onClick={() => setActiveAdminTab('enquiries')}
                  className="bg-black/50 hover:bg-black/80 border border-white/10 p-6 rounded-lg space-y-3 cursor-pointer group transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 rounded">
                      <Mail className="w-5 h-5" />
                    </div>
                    {newEnquiriesCount > 0 ? (
                      <span className="px-2.5 py-1 bg-emerald-500 text-[#0A0C0A] text-[10px] font-extrabold uppercase tracking-wider rounded-full">
                        {newEnquiriesCount} New
                      </span>
                    ) : (
                      <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Up to date</span>
                    )}
                  </div>
                  <div>
                    <span className="text-3xl font-serif font-bold text-white block">{enquiries.length}</span>
                    <span className="text-xs text-white/60 uppercase tracking-wider font-semibold">Total Enquiries</span>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-[#A4C293] uppercase tracking-wider font-bold group-hover:translate-x-1 transition-transform">
                    <span>Review Messages</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Metric 2: News Articles */}
                <div 
                  onClick={() => setActiveAdminTab('news')}
                  className="bg-black/50 hover:bg-black/80 border border-white/10 p-6 rounded-lg space-y-3 cursor-pointer group transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-sky-950/60 border border-sky-500/30 text-sky-400 rounded">
                      <Newspaper className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider rounded">
                      {publishedNewsCount} Published
                    </span>
                  </div>
                  <div>
                    <span className="text-3xl font-serif font-bold text-white block">{news.length}</span>
                    <span className="text-xs text-white/60 uppercase tracking-wider font-semibold">News & Articles</span>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-sky-300 uppercase tracking-wider font-bold group-hover:translate-x-1 transition-transform">
                    <span>Manage Articles</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Metric 3: Horticulture Produce */}
                <div 
                  onClick={() => setActiveAdminTab('horticulture')}
                  className="bg-black/50 hover:bg-black/80 border border-white/10 p-6 rounded-lg space-y-3 cursor-pointer group transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 rounded">
                      <Sprout className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Year-Round</span>
                  </div>
                  <div>
                    <span className="text-3xl font-serif font-bold text-white block">{activeHortProducts.length}</span>
                    <span className="text-xs text-white/60 uppercase tracking-wider font-semibold">Horticulture Products</span>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-[#A4C293] uppercase tracking-wider font-bold group-hover:translate-x-1 transition-transform">
                    <span>Manage Produce</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Metric 4: Beef Products */}
                <div 
                  onClick={() => setActiveAdminTab('beef')}
                  className="bg-black/50 hover:bg-black/80 border border-white/10 p-6 rounded-lg space-y-3 cursor-pointer group transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-amber-950/60 border border-amber-500/30 text-amber-400 rounded">
                      <Beef className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-amber-300 font-bold uppercase tracking-widest">Commercial</span>
                  </div>
                  <div>
                    <span className="text-3xl font-serif font-bold text-white block">{beefProducts.length}</span>
                    <span className="text-xs text-white/60 uppercase tracking-wider font-semibold">Beef Grades</span>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-amber-300 uppercase tracking-wider font-bold group-hover:translate-x-1 transition-transform">
                    <span>Manage Beef</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

              </div>

              {/* Quick Actions & Recent Messages Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Recent Messages (Col-span 2) */}
                <div className="lg:col-span-2 space-y-4 bg-black/40 border border-white/10 p-6 rounded-lg">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-lg font-serif text-white font-bold">Recent Customer Enquiries</h3>
                      <p className="text-xs text-white/50">Latest enquiries submitted through the public website</p>
                    </div>
                    <button 
                      onClick={() => setActiveAdminTab('enquiries')}
                      className="text-xs text-[#A4C293] font-bold uppercase tracking-wider hover:underline"
                    >
                      View All ({enquiries.length})
                    </button>
                  </div>

                  {enquiries.length === 0 ? (
                    <div className="py-12 text-center text-white/40 space-y-2">
                      <Mail className="w-8 h-8 mx-auto opacity-30" />
                      <p className="text-xs">No client enquiries received yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {enquiries.slice(0, 4).map(enq => (
                        <div 
                          key={enq.id}
                          onClick={() => {
                            setSelectedEnquiry(enq);
                            setActiveAdminTab('enquiries');
                          }}
                          className={`p-4 rounded border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                            enq.status === 'New' 
                              ? 'bg-emerald-950/20 border-emerald-500/40 hover:bg-emerald-950/30' 
                              : 'bg-black/30 border-white/5 hover:bg-white/5'
                          }`}
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded ${
                                enq.status === 'New' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                enq.status === 'Read' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
                                'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              }`}>
                                {enq.status}
                              </span>
                              <span className="text-[10px] text-[#A4C293] font-mono truncate">{enq.service}</span>
                            </div>
                            <h4 className="text-sm font-bold text-white truncate">{enq.name}</h4>
                            <p className="text-xs text-white/70 truncate">{enq.subject}</p>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] text-white/40 block">
                              {new Date(enq.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-[10px] text-[#A4C293] font-bold uppercase tracking-wider">
                              Open &rarr;
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Shortcuts & Contact Overview (Col-span 1) */}
                <div className="space-y-6">
                  
                  {/* Shortcuts Card */}
                  <div className="bg-black/40 border border-white/10 p-6 rounded-lg space-y-4">
                    <h3 className="text-base font-serif text-white font-bold border-b border-white/10 pb-3">
                      Quick Admin Shortcuts
                    </h3>
                    <div className="grid grid-cols-1 gap-2.5">
                      <button
                        onClick={() => setActiveAdminTab('news')}
                        className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-between rounded transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Plus className="w-4 h-4 text-[#A4C293]" />
                          <span>Publish News Article</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                      </button>

                      <button
                        onClick={() => setActiveAdminTab('horticulture')}
                        className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-between rounded transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Plus className="w-4 h-4 text-[#A4C293]" />
                          <span>Add Horticulture Product</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                      </button>

                      <button
                        onClick={() => setActiveAdminTab('beef')}
                        className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-between rounded transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Plus className="w-4 h-4 text-[#A4C293]" />
                          <span>Add Beef Grade</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                      </button>

                      <button
                        onClick={() => setActiveAdminTab('photos')}
                        className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-between rounded transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Upload className="w-4 h-4 text-[#A4C293]" />
                          <span>Upload Farm Image</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                      </button>

                      <button
                        onClick={() => setActiveAdminTab('config')}
                        className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-between rounded transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Settings className="w-4 h-4 text-[#A4C293]" />
                          <span>Update Site Settings</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                      </button>
                    </div>
                  </div>

                  {/* Public Details Card */}
                  <div className="bg-black/40 border border-white/10 p-6 rounded-lg space-y-3">
                    <h3 className="text-base font-serif text-white font-bold border-b border-white/10 pb-3">
                      Current Public Details
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-white/40 block uppercase tracking-wider text-[10px]">Phone</span>
                        <span className="text-white font-medium">{siteConfig.phone}</span>
                      </div>
                      <div>
                        <span className="text-white/40 block uppercase tracking-wider text-[10px]">Email</span>
                        <span className="text-white font-medium">{siteConfig.email}</span>
                      </div>
                      <div>
                        <span className="text-white/40 block uppercase tracking-wider text-[10px]">Operating Hours</span>
                        <span className="text-white font-medium">{siteConfig.hours}</span>
                      </div>
                      <div>
                        <span className="text-white/40 block uppercase tracking-wider text-[10px]">Farm Location</span>
                        <span className="text-white font-medium">{siteConfig.address}</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* 2. MESSAGES TAB */}
          {activeAdminTab === 'enquiries' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif text-[#F8F9FA] mb-1">Customer Enquiries & Messages</h2>
                <p className="text-xs text-[#F8F9FA]/60 uppercase tracking-widest font-semibold">
                  Review, search, filter, and respond directly via phone, email, or WhatsApp
                </p>
              </div>

              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-black/50 p-4 border border-white/10 rounded-lg">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={enquirySearch}
                    onChange={e => setEnquirySearch(e.target.value)}
                    placeholder="Search by name, email, subject..."
                    className="w-full bg-black/80 border border-white/10 pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#A4C293] rounded"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                  {(['All', 'New', 'Read', 'Replied'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => setEnquiryFilter(status)}
                      className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest border transition-colors rounded ${
                        enquiryFilter === status
                          ? 'bg-[#A4C293] text-[#0A0C0A] border-[#A4C293]'
                          : 'bg-black/30 text-white/70 border-white/10 hover:text-white'
                      }`}
                    >
                      {status} ({status === 'All' ? enquiries.length : enquiries.filter(e => e.status === status).length})
                    </button>
                  ))}
                </div>
              </div>

              {/* Enquiries List */}
              {filteredEnquiries.length === 0 ? (
                <div className="text-center py-20 bg-black/20 border border-white/10 p-8 rounded-lg">
                  <Mail className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-serif text-white/80">No Enquiries Found</h3>
                  <p className="text-xs text-white/50 mt-1">No customer messages match your search or filter criteria.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEnquiries.map(enq => (
                    <div 
                      key={enq.id}
                      className={`bg-black/50 border p-5 rounded-lg transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                        enq.status === 'New' ? 'border-[#A4C293]/60 bg-emerald-950/10' : 'border-white/10'
                      }`}
                    >
                      <div className="space-y-1.5 cursor-pointer flex-1" onClick={() => setSelectedEnquiry(enq)}>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${
                            enq.status === 'New' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            enq.status === 'Read' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
                            'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          }`}>
                            {enq.status}
                          </span>
                          <span className="text-[11px] text-[#A4C293] font-mono">
                            {enq.service}
                          </span>
                          <span className="text-[11px] text-white/40">
                            {new Date(enq.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white">{enq.name} <span className="text-xs text-white/60 font-normal">({enq.email} | {enq.phone})</span></h4>
                        <p className="text-xs font-semibold text-white/90">{enq.subject}</p>
                        <p className="text-xs text-white/70 line-clamp-1">{enq.message}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {enq.phone && (
                          <a
                            href={`tel:${enq.phone}`}
                            className="p-2.5 bg-white/5 hover:bg-white/15 border border-white/10 text-emerald-400 rounded transition-colors"
                            title="Call Phone"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        )}
                        {enq.email && (
                          <a
                            href={`mailto:${enq.email}`}
                            className="p-2.5 bg-white/5 hover:bg-white/15 border border-white/10 text-sky-400 rounded transition-colors"
                            title="Send Email"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                        {enq.phone && (
                          <a
                            href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-white/5 hover:bg-white/15 border border-white/10 text-emerald-500 rounded transition-colors"
                            title="WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>
                        )}

                        <button
                          onClick={() => setSelectedEnquiry(enq)}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold uppercase tracking-widest transition-colors rounded"
                        >
                          View
                        </button>

                        <button
                          onClick={async () => {
                            if (confirm('Are you sure you want to delete this enquiry?')) {
                              await deleteEnquiry(enq.id);
                              showSuccess('Enquiry deleted successfully.');
                            }
                          }}
                          className="p-2.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 rounded transition-colors"
                          title="Delete Enquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Enquiry Details Modal */}
              {selectedEnquiry && (
                <div className="fixed inset-0 z-50 bg-[#0A0C0A]/90 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto">
                  <div className="max-w-2xl w-full bg-[#0A0C0A] border border-white/20 p-8 shadow-2xl rounded-lg my-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[10px] text-[#A4C293] uppercase tracking-widest font-bold">Enquiry Details</span>
                        <h3 className="text-xl font-serif text-white">{selectedEnquiry.subject}</h3>
                      </div>
                      <button onClick={() => setSelectedEnquiry(null)} className="text-white/60 hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-black/50 p-4 border border-white/10 rounded">
                      <div>
                        <span className="text-white/50 block uppercase tracking-wider mb-1">Client Name</span>
                        <span className="text-white font-bold text-sm">{selectedEnquiry.name}</span>
                      </div>
                      <div>
                        <span className="text-white/50 block uppercase tracking-wider mb-1">Service Category</span>
                        <span className="text-[#A4C293] font-bold">{selectedEnquiry.service}</span>
                      </div>
                      <div>
                        <span className="text-white/50 block uppercase tracking-wider mb-1">Phone Number</span>
                        <a href={`tel:${selectedEnquiry.phone}`} className="text-sky-400 hover:underline">{selectedEnquiry.phone || 'N/A'}</a>
                      </div>
                      <div>
                        <span className="text-white/50 block uppercase tracking-wider mb-1">Email Address</span>
                        <a href={`mailto:${selectedEnquiry.email}`} className="text-sky-400 hover:underline">{selectedEnquiry.email}</a>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs text-white/50 uppercase tracking-wider block">Full Message</span>
                      <div className="bg-black/60 border border-white/10 p-4 rounded text-sm text-white/90 leading-relaxed font-light whitespace-pre-wrap">
                        {selectedEnquiry.message}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-xs text-white/50 uppercase tracking-wider">Status:</span>
                        {(['New', 'Read', 'Replied'] as const).map(st => (
                          <button
                            key={st}
                            onClick={async () => {
                              await updateEnquiryStatus(selectedEnquiry.id, st);
                              setSelectedEnquiry({ ...selectedEnquiry, status: st });
                              showSuccess(`Enquiry marked as ${st}`);
                            }}
                            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-colors rounded ${
                              selectedEnquiry.status === st
                                ? 'bg-[#A4C293] text-[#0A0C0A] border-[#A4C293]'
                                : 'bg-black/40 text-white/70 border-white/10 hover:text-white'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        {selectedEnquiry.phone && (
                          <a
                            href={`tel:${selectedEnquiry.phone}`}
                            className="px-4 py-2.5 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors rounded"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call</span>
                          </a>
                        )}
                        {selectedEnquiry.email && (
                          <a
                            href={`mailto:${selectedEnquiry.email}`}
                            className="px-4 py-2.5 bg-sky-950/60 hover:bg-sky-900/60 border border-sky-500/30 text-sky-300 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors rounded"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Email</span>
                          </a>
                        )}
                        {selectedEnquiry.phone && (
                          <a
                            href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2.5 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors rounded"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. PAGES / CONTENT TAB (SLIDES, ABOUT, CONTACT HEADERS) */}
          {activeAdminTab === 'pages' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif text-[#F8F9FA] mb-1">Page & Content Manager</h2>
                  <p className="text-xs text-[#F8F9FA]/60 uppercase tracking-widest font-semibold">
                    Manage full-screen homepage slides, About Us text, and section headers
                  </p>
                </div>
                <button
                  onClick={() => setEditingSlide({
                    id: `slide-${Date.now()}`,
                    title: 'New Hero Slide Title',
                    subtitle: 'Subtitle text...',
                    description: 'Description text...',
                    image: photos[0] || '',
                    ctaText: 'Explore Agriculture',
                    ctaLink: '#horticulture',
                    badge: 'Gabolekwe Farms'
                  })}
                  className="bg-[#F8F9FA] text-[#0A0C0A] px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#A4C293] transition-colors flex items-center gap-2 rounded"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Hero Slide</span>
                </button>
              </div>

              {/* Hero Slideshow Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-serif text-white font-bold border-b border-white/10 pb-2">
                  Homepage Full-Screen Slides ({slides.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {slides.map((slide, idx) => (
                    <div key={slide.id} className="bg-black/50 border border-white/10 rounded-lg p-5 space-y-4 relative group">
                      <div className="relative h-44 rounded overflow-hidden border border-white/10">
                        <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end">
                          <span className="text-[10px] text-[#A4C293] font-bold uppercase tracking-widest block">{slide.badge || `Slide #${idx + 1}`}</span>
                          <h4 className="text-base font-serif font-bold text-white line-clamp-1">{slide.title}</h4>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <p className="text-white/80 line-clamp-2">{slide.description}</p>
                        <div className="flex items-center justify-between text-[11px] text-white/50 pt-2 border-t border-white/10">
                          <span>Button: <strong className="text-white">{slide.ctaText}</strong></span>
                          <span>Link: <strong className="text-[#A4C293]">{slide.ctaLink}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                        <button onClick={() => setEditingSlide(slide)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider rounded flex items-center gap-1">
                          <Edit2 className="w-3 h-3" /> Edit Slide
                        </button>
                        <button onClick={() => deleteSlide(slide.id)} className="p-1.5 bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 text-red-300 rounded">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* About Us Page Content */}
              <div className="bg-black/40 border border-white/10 p-6 rounded-lg space-y-4">
                <h3 className="text-lg font-serif text-white font-bold border-b border-white/10 pb-3">
                  About Us & Farm Vision Content
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block uppercase tracking-wider text-white/60 mb-1 font-bold">About Section Title</label>
                    <input 
                      type="text" 
                      value={configForm.aboutTitle || 'Pioneering Commercial Agriculture in Gweta'} 
                      onChange={e => setConfigForm({...configForm, aboutTitle: e.target.value})}
                      className="w-full bg-black/60 border border-white/10 p-3 text-white rounded"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-white/60 mb-1 font-bold">About Section Subtitle</label>
                    <input 
                      type="text" 
                      value={configForm.aboutSubtitle || 'Sustainable Growth • Local Employment • Food Security'} 
                      onChange={e => setConfigForm({...configForm, aboutSubtitle: e.target.value})}
                      className="w-full bg-black/60 border border-white/10 p-3 text-white rounded"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block uppercase tracking-wider text-white/60 mb-1 font-bold">Mission Statement</label>
                    <textarea 
                      rows={3} 
                      value={configForm.aboutMission || 'Gabolekwe Farms is dedicated to advancing Botswana’s agricultural sector through modern sustainable farming, high-yield drip irrigation, premium beef cattle production, and local community empowerment.'} 
                      onChange={e => setConfigForm({...configForm, aboutMission: e.target.value})}
                      className="w-full bg-black/60 border border-white/10 p-3 text-white rounded"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block uppercase tracking-wider text-white/60 mb-1 font-bold">Featured About Us Image URL</label>
                    <div className="flex gap-2">
                      <input 
                        type="url" 
                        value={configForm.aboutImage || photos[0] || ''} 
                        onChange={e => setConfigForm({...configForm, aboutImage: e.target.value})}
                        className="flex-1 bg-black/60 border border-white/10 p-3 text-white rounded"
                        placeholder="https://..."
                      />
                      <button
                        type="button"
                        onClick={() => openMediaPickerFor((url) => setConfigForm({...configForm, aboutImage: url}))}
                        className="px-4 py-2 bg-[#A4C293]/20 hover:bg-[#A4C293]/30 border border-[#A4C293]/40 text-[#A4C293] text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1.5 shrink-0 transition-colors"
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span>Media Library</span>
                      </button>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleSaveConfig}
                  className="px-6 py-3 bg-[#A4C293] text-[#0A0C0A] text-xs font-bold uppercase tracking-widest rounded hover:bg-white transition-colors"
                >
                  Save Page Text
                </button>
              </div>

              {/* Edit Slide Modal */}
              {editingSlide && (
                <div className="fixed inset-0 z-50 bg-[#0A0C0A]/90 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto">
                  <div className="max-w-2xl w-full bg-[#0A0C0A] border border-white/20 p-8 shadow-2xl rounded-lg my-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-serif text-[#F8F9FA]">Edit Hero Slide</h3>
                      <button onClick={() => setEditingSlide(null)} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      await saveSlide(editingSlide);
                      setEditingSlide(null);
                      showSuccess('Hero slide saved successfully!');
                    }} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Badge / Tagline</label>
                          <input type="text" value={editingSlide.badge || ''} onChange={e => setEditingSlide({...editingSlide, badge: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Slide Title *</label>
                          <input type="text" required value={editingSlide.title} onChange={e => setEditingSlide({...editingSlide, title: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Subtitle</label>
                        <input type="text" value={editingSlide.subtitle || ''} onChange={e => setEditingSlide({...editingSlide, subtitle: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Description Paragraph</label>
                        <textarea rows={3} value={editingSlide.description} onChange={e => setEditingSlide({...editingSlide, description: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Background Image URL *</label>
                        <div className="flex gap-2">
                          <input type="url" required value={editingSlide.image} onChange={e => setEditingSlide({...editingSlide, image: e.target.value})} className="flex-1 bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                          <button
                            type="button"
                            onClick={() => openMediaPickerFor((url) => setEditingSlide({...editingSlide, image: url}))}
                            className="px-4 py-2 bg-[#A4C293]/20 hover:bg-[#A4C293]/30 border border-[#A4C293]/40 text-[#A4C293] text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1.5 shrink-0 transition-colors"
                          >
                            <ImageIcon className="w-4 h-4" />
                            <span>Media Library</span>
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">CTA Button Text</label>
                          <input type="text" value={editingSlide.ctaText} onChange={e => setEditingSlide({...editingSlide, ctaText: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">CTA Link (e.g. #contact, #beef)</label>
                          <input type="text" value={editingSlide.ctaLink} onChange={e => setEditingSlide({...editingSlide, ctaLink: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                        </div>
                      </div>
                      <div className="pt-4 flex justify-end gap-4">
                        <button type="button" onClick={() => setEditingSlide(null)} className="px-6 py-3 bg-white/10 text-xs font-bold uppercase tracking-widest text-white rounded">Cancel</button>
                        <button type="submit" className="px-6 py-3 bg-[#A4C293] text-[#0A0C0A] text-xs font-bold uppercase tracking-widest hover:bg-white rounded">Save Slide</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. SERVICES TAB */}
          {activeAdminTab === 'services' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif text-[#F8F9FA] mb-1">Core Services Manager</h2>
                  <p className="text-xs text-[#F8F9FA]/60 uppercase tracking-widest font-semibold">
                    Manage commercial farm offerings, highlights, and benefits
                  </p>
                </div>
                <button
                  onClick={() => setEditingService({
                    id: `service-${Date.now()}`,
                    title: 'New Agribusiness Service',
                    shortDesc: 'Short description of service...',
                    fullDesc: 'Comprehensive detailed description of service...',
                    iconName: 'Sprout',
                    image: photos[0] || '',
                    keyFeature: 'Key Highlight Feature',
                    benefits: ['Benefit 1', 'Benefit 2']
                  })}
                  className="bg-[#F8F9FA] text-[#0A0C0A] px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#A4C293] transition-colors flex items-center gap-2 rounded"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div key={service.id} className="bg-black/50 border border-white/10 p-5 rounded-lg flex flex-col justify-between space-y-4">
                    <div className="flex items-start gap-4">
                      {service.image && (
                        <img src={service.image} alt={service.title} className="w-16 h-16 object-cover border border-white/10 rounded shrink-0" referrerPolicy="no-referrer" />
                      )}
                      <div>
                        <span className="text-[10px] text-[#A4C293] font-mono uppercase tracking-widest block font-bold">{service.id}</span>
                        <h3 className="text-lg font-serif text-white font-bold">{service.title}</h3>
                        <p className="text-xs text-white/70 line-clamp-2 mt-1">{service.shortDesc}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] text-white/40 uppercase tracking-wider font-bold">
                        Key: <strong className="text-white">{service.keyFeature}</strong>
                      </span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditingService(service)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider rounded flex items-center gap-1">
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                        <button onClick={() => deleteService(service.id)} className="p-1.5 bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 text-red-300 rounded">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Service Modal */}
              {editingService && (
                <div className="fixed inset-0 z-50 bg-[#0A0C0A]/90 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto">
                  <div className="max-w-2xl w-full bg-[#0A0C0A] border border-white/20 p-8 shadow-2xl rounded-lg my-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-serif text-[#F8F9FA]">Edit Agribusiness Service</h3>
                      <button onClick={() => setEditingService(null)} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      await saveService(editingService);
                      setEditingService(null);
                      showSuccess('Service saved successfully!');
                    }} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Service ID (slug)</label>
                          <input type="text" required value={editingService.id} onChange={e => setEditingService({...editingService, id: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Service Title *</label>
                          <input type="text" required value={editingService.title} onChange={e => setEditingService({...editingService, title: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Short Description</label>
                        <input type="text" value={editingService.shortDesc} onChange={e => setEditingService({...editingService, shortDesc: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Full Description</label>
                        <textarea rows={3} value={editingService.fullDesc} onChange={e => setEditingService({...editingService, fullDesc: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Icon Name (Sprout, Beef, Droplets, Cpu)</label>
                          <input type="text" value={editingService.iconName} onChange={e => setEditingService({...editingService, iconName: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Key Feature Highlight</label>
                          <input type="text" value={editingService.keyFeature} onChange={e => setEditingService({...editingService, keyFeature: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Featured Image URL</label>
                        <div className="flex gap-2">
                          <input type="url" value={editingService.image} onChange={e => setEditingService({...editingService, image: e.target.value})} className="flex-1 bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                          <button
                            type="button"
                            onClick={() => openMediaPickerFor((url) => setEditingService({...editingService, image: url}))}
                            className="px-4 py-2 bg-[#A4C293]/20 hover:bg-[#A4C293]/30 border border-[#A4C293]/40 text-[#A4C293] text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1.5 shrink-0 transition-colors"
                          >
                            <ImageIcon className="w-4 h-4" />
                            <span>Media Library</span>
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Benefits (comma separated)</label>
                        <input type="text" value={editingService.benefits.join(', ')} onChange={e => setEditingService({...editingService, benefits: e.target.value.split(',').map(s => s.trim())})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                      </div>
                      <div className="pt-4 flex justify-end gap-4">
                        <button type="button" onClick={() => setEditingService(null)} className="px-6 py-3 bg-white/10 text-xs font-bold uppercase tracking-widest text-white rounded">Cancel</button>
                        <button type="submit" className="px-6 py-3 bg-[#A4C293] text-[#0A0C0A] text-xs font-bold uppercase tracking-widest hover:bg-white rounded">Save Service</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5. HORTICULTURE PAGE CMS TAB */}
          {activeAdminTab === 'horticulture_page' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <h2 className="text-2xl font-serif text-[#F8F9FA] mb-1">Horticulture Page CMS</h2>
                  <p className="text-xs text-[#F8F9FA]/60 uppercase tracking-widest font-semibold">
                    Manage introduction, feature blocks, What We Produce section, and product catalog
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await updateHorticulturePageConfig(hortPageForm);
                      showSuccess('Horticulture Page updated successfully!');
                    }}
                    className="px-5 py-2.5 bg-[#A4C293] text-[#0A0C0A] text-xs font-bold uppercase tracking-widest rounded hover:bg-white transition-colors flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Save Page Changes
                  </button>
                </div>
              </div>

              {/* Sub-tabs */}
              <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
                <button
                  type="button"
                  onClick={() => setHorticultureSubTab('intro')}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors ${
                    horticultureSubTab === 'intro' ? 'bg-[#A4C293] text-[#0A0C0A]' : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  1. Page Introduction & Hero
                </button>
                <button
                  type="button"
                  onClick={() => setHorticultureSubTab('features')}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors ${
                    horticultureSubTab === 'features' ? 'bg-[#A4C293] text-[#0A0C0A]' : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  2. Feature Blocks ({hortPageForm.featureBlocks.length})
                </button>
                <button
                  type="button"
                  onClick={() => setHorticultureSubTab('produce')}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors ${
                    horticultureSubTab === 'produce' ? 'bg-[#A4C293] text-[#0A0C0A]' : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  3. "What We Produce" Section
                </button>
                <button
                  type="button"
                  onClick={() => setHorticultureSubTab('products')}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors ${
                    horticultureSubTab === 'products' ? 'bg-[#A4C293] text-[#0A0C0A]' : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  4. Produce Catalog ({horticultureProducts.length})
                </button>
              </div>

              {/* Sub-tab 1: Intro */}
              {horticultureSubTab === 'intro' && (
                <div className="space-y-6 bg-black/40 border border-white/10 p-6 rounded-lg">
                  <h3 className="text-lg font-serif text-white font-bold border-b border-white/10 pb-3">Hero Banner & Introduction Section</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Hero Title</label>
                      <input
                        type="text"
                        value={hortPageForm.heroTitle}
                        onChange={e => setHortPageForm({...hortPageForm, heroTitle: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Hero Subtitle</label>
                      <input
                        type="text"
                        value={hortPageForm.heroSubtitle}
                        onChange={e => setHortPageForm({...hortPageForm, heroSubtitle: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Badge Text</label>
                      <input
                        type="text"
                        value={hortPageForm.badgeText}
                        onChange={e => setHortPageForm({...hortPageForm, badgeText: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">CTA Button Text</label>
                      <input
                        type="text"
                        value={hortPageForm.heroCta}
                        onChange={e => setHortPageForm({...hortPageForm, heroCta: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Hero Wallpaper Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={hortPageForm.heroImage}
                        onChange={e => setHortPageForm({...hortPageForm, heroImage: e.target.value})}
                        className="flex-1 bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                      />
                      <button
                        type="button"
                        onClick={() => openMediaPickerFor((url) => setHortPageForm({...hortPageForm, heroImage: url}))}
                        className="px-4 py-2 bg-[#A4C293]/20 hover:bg-[#A4C293]/30 border border-[#A4C293]/40 text-[#A4C293] text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1.5"
                      >
                        <ImageIcon className="w-4 h-4" /> Media Library
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6 space-y-4">
                    <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Introduction Content Blocks</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Intro Badge</label>
                        <input
                          type="text"
                          value={hortPageForm.introBadge}
                          onChange={e => setHortPageForm({...hortPageForm, introBadge: e.target.value})}
                          className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Main Heading</label>
                        <input
                          type="text"
                          value={hortPageForm.introHeading}
                          onChange={e => setHortPageForm({...hortPageForm, introHeading: e.target.value})}
                          className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Main Description Paragraph 1</label>
                      <textarea
                        rows={3}
                        value={hortPageForm.introParagraph1}
                        onChange={e => setHortPageForm({...hortPageForm, introParagraph1: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Main Description Paragraph 2</label>
                      <textarea
                        rows={3}
                        value={hortPageForm.introParagraph2}
                        onChange={e => setHortPageForm({...hortPageForm, introParagraph2: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Intro Image URL</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={hortPageForm.introImage}
                          onChange={e => setHortPageForm({...hortPageForm, introImage: e.target.value})}
                          className="flex-1 bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                        />
                        <button
                          type="button"
                          onClick={() => openMediaPickerFor((url) => setHortPageForm({...hortPageForm, introImage: url}))}
                          className="px-4 py-2 bg-[#A4C293]/20 hover:bg-[#A4C293]/30 border border-[#A4C293]/40 text-[#A4C293] text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1.5"
                        >
                          <ImageIcon className="w-4 h-4" /> Media Library
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 2: Feature Blocks */}
              {horticultureSubTab === 'features' && (
                <div className="space-y-6 bg-black/40 border border-white/10 p-6 rounded-lg">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <h3 className="text-lg font-serif text-white font-bold">Horticulture Feature Blocks</h3>
                      <p className="text-xs text-white/60">Add, edit, delete, or reorder feature cards displayed on the horticulture page</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingFeatureBlock({
                        id: `block-${Date.now()}`,
                        title: 'New Feature Block',
                        description: 'Description of sustainable agronomy practice...',
                        icon: 'Sprout',
                        image: photos[0] || ''
                      })}
                      className="px-4 py-2 bg-[#F8F9FA] text-[#0A0C0A] text-xs font-bold uppercase tracking-wider rounded hover:bg-[#A4C293] flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Add Feature Block
                    </button>
                  </div>

                  <div className="space-y-4">
                    {hortPageForm.featureBlocks.map((block, index) => (
                      <div key={block.id} className="bg-black/60 border border-white/10 p-4 rounded-lg flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded bg-[#A4C293]/20 border border-[#A4C293]/40 flex items-center justify-center text-[#A4C293] shrink-0 font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] px-2 py-0.5 bg-white/10 text-[#A4C293] font-bold uppercase tracking-wider rounded">Icon: {block.icon}</span>
                            </div>
                            <h4 className="text-base font-serif text-white font-bold">{block.title}</h4>
                            <p className="text-xs text-white/70 line-clamp-1">{block.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              if (index > 0) {
                                const newBlocks = [...hortPageForm.featureBlocks];
                                const temp = newBlocks[index];
                                newBlocks[index] = newBlocks[index - 1];
                                newBlocks[index - 1] = temp;
                                setHortPageForm({...hortPageForm, featureBlocks: newBlocks});
                              }
                            }}
                            disabled={index === 0}
                            className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white rounded text-xs"
                            title="Move Up"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (index < hortPageForm.featureBlocks.length - 1) {
                                const newBlocks = [...hortPageForm.featureBlocks];
                                const temp = newBlocks[index];
                                newBlocks[index] = newBlocks[index + 1];
                                newBlocks[index + 1] = temp;
                                setHortPageForm({...hortPageForm, featureBlocks: newBlocks});
                              }
                            }}
                            disabled={index === hortPageForm.featureBlocks.length - 1}
                            className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white rounded text-xs"
                            title="Move Down"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingFeatureBlock(block)}
                            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase rounded flex items-center gap-1"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const newBlocks = hortPageForm.featureBlocks.filter(b => b.id !== block.id);
                              setHortPageForm({...hortPageForm, featureBlocks: newBlocks});
                              showSuccess('Feature block removed!');
                            }}
                            className="p-2 bg-red-950/60 hover:bg-red-900/60 text-red-200 border border-red-500/30 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Edit Feature Block Modal */}
                  {editingFeatureBlock && (
                    <div className="fixed inset-0 z-50 bg-[#0A0C0A]/90 backdrop-blur-md flex items-center justify-center p-6">
                      <div className="max-w-lg w-full bg-[#0A0C0A] border border-white/20 p-8 shadow-2xl rounded-lg">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-serif text-white font-bold">Edit Feature Block</h3>
                          <button onClick={() => setEditingFeatureBlock(null)} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const exists = hortPageForm.featureBlocks.some(b => b.id === editingFeatureBlock.id);
                          const newBlocks = exists
                            ? hortPageForm.featureBlocks.map(b => b.id === editingFeatureBlock.id ? editingFeatureBlock : b)
                            : [...hortPageForm.featureBlocks, editingFeatureBlock];
                          setHortPageForm({...hortPageForm, featureBlocks: newBlocks});
                          setEditingFeatureBlock(null);
                          showSuccess('Feature block saved successfully!');
                        }} className="space-y-4">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Title *</label>
                            <input
                              type="text"
                              required
                              value={editingFeatureBlock.title}
                              onChange={e => setEditingFeatureBlock({...editingFeatureBlock, title: e.target.value})}
                              className="w-full bg-black/60 border border-white/10 p-3 text-sm text-white rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Icon Name (Sun, Droplets, ShieldCheck, Sprout, Layers, Package)</label>
                            <select
                              value={editingFeatureBlock.icon}
                              onChange={e => setEditingFeatureBlock({...editingFeatureBlock, icon: e.target.value})}
                              className="w-full bg-black/60 border border-white/10 p-3 text-sm text-white rounded"
                            >
                              <option value="Sun">Sun</option>
                              <option value="Droplets">Droplets</option>
                              <option value="ShieldCheck">ShieldCheck</option>
                              <option value="Sprout">Sprout</option>
                              <option value="Layers">Layers</option>
                              <option value="Package">Package</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Description</label>
                            <textarea
                              rows={3}
                              value={editingFeatureBlock.description}
                              onChange={e => setEditingFeatureBlock({...editingFeatureBlock, description: e.target.value})}
                              className="w-full bg-black/60 border border-white/10 p-3 text-sm text-white rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Image URL (Optional)</label>
                            <div className="flex gap-2">
                              <input
                                type="url"
                                value={editingFeatureBlock.image || ''}
                                onChange={e => setEditingFeatureBlock({...editingFeatureBlock, image: e.target.value})}
                                className="flex-1 bg-black/60 border border-white/10 p-3 text-sm text-white rounded"
                              />
                              <button
                                type="button"
                                onClick={() => openMediaPickerFor((url) => setEditingFeatureBlock({...editingFeatureBlock, image: url}))}
                                className="px-3 py-2 bg-[#A4C293]/20 text-[#A4C293] text-xs font-bold uppercase rounded"
                              >
                                Media Library
                              </button>
                            </div>
                          </div>
                          <div className="pt-4 flex justify-end gap-4">
                            <button type="button" onClick={() => setEditingFeatureBlock(null)} className="px-5 py-2.5 bg-white/10 text-xs font-bold uppercase text-white rounded">Cancel</button>
                            <button type="submit" className="px-5 py-2.5 bg-[#A4C293] text-[#0A0C0A] text-xs font-bold uppercase rounded hover:bg-white">Save Block</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sub-tab 3: Produce Section Text */}
              {horticultureSubTab === 'produce' && (
                <div className="space-y-6 bg-black/40 border border-white/10 p-6 rounded-lg">
                  <h3 className="text-lg font-serif text-white font-bold border-b border-white/10 pb-3">"What We Produce" Section Heading & Description</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Section Heading</label>
                      <input
                        type="text"
                        value={hortPageForm.produceHeading}
                        onChange={e => setHortPageForm({...hortPageForm, produceHeading: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Section Description</label>
                      <textarea
                        rows={3}
                        value={hortPageForm.produceDescription}
                        onChange={e => setHortPageForm({...hortPageForm, produceDescription: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 4: Produce Catalog */}
              {horticultureSubTab === 'products' && (
                <div className="space-y-6 bg-black/40 border border-white/10 p-6 rounded-lg">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <h3 className="text-lg font-serif text-white font-bold">Horticulture Produce Catalog</h3>
                      <p className="text-xs text-white/60">Manage crops, availability, harvest seasons, and pack sizes</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingHorticulture({
                        id: `prod-${Date.now()}`,
                        name: 'Fresh Harvest Produce',
                        category: 'Leafy Vegetables',
                        description: 'Description of vegetable or crop...',
                        availability: 'In Season & In Stock',
                        packSizes: ['10kg Bulk Bag', '20kg Crate'],
                        harvestSeason: 'Year-Round',
                        image: photos[0] || '',
                        nutritionalHighlights: ['High in Vitamin C', 'Rich in dietary fiber'],
                        growingMethod: 'Precision drip irrigation with organic compost conditioning.'
                      })}
                      className="px-4 py-2 bg-[#F8F9FA] text-[#0A0C0A] text-xs font-bold uppercase tracking-wider rounded hover:bg-[#A4C293] flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Add Produce Item
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {horticultureProducts.map((prod) => (
                      <div key={prod.id} className="bg-black/60 border border-white/10 p-5 rounded-lg flex flex-col justify-between space-y-4">
                        <div className="flex items-start gap-4">
                          {prod.image && (
                            <img src={prod.image} alt={prod.name} className="w-20 h-20 object-cover border border-white/10 rounded shrink-0" referrerPolicy="no-referrer" />
                          )}
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-[#A4C293] font-bold uppercase tracking-widest">{prod.category}</span>
                              <span className="text-[9px] px-2 py-0.5 bg-emerald-950 text-emerald-200 border border-emerald-500/30 uppercase tracking-widest font-bold rounded">
                                {prod.availability}
                              </span>
                            </div>
                            <h4 className="text-lg font-serif text-white font-bold">{prod.name}</h4>
                            <p className="text-xs text-white/70 line-clamp-2">{prod.description}</p>
                            <p className="text-[10px] text-white/50 font-mono">Season: {prod.harvestSeason}</p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                          <span className="text-[10px] text-white/40 uppercase tracking-wider">
                            Packs: <strong className="text-white">{prod.packSizes.join(', ')}</strong>
                          </span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setEditingHorticulture(prod)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider rounded flex items-center gap-1">
                              <Edit2 className="w-3 h-3" /> Edit
                            </button>
                            <button onClick={() => deleteHorticultureProduct(prod.id)} className="p-1.5 bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 text-red-300 rounded">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Edit Horticulture Produce Modal */}
          {editingHorticulture && (
            <div className="fixed inset-0 z-50 bg-[#0A0C0A]/90 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto">
              <div className="max-w-2xl w-full bg-[#0A0C0A] border border-white/20 p-8 shadow-2xl rounded-lg my-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-serif text-[#F8F9FA]">Edit Horticulture Produce</h3>
                  <button onClick={() => setEditingHorticulture(null)} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  await saveHorticultureProduct(editingHorticulture);
                  setEditingHorticulture(null);
                  showSuccess('Horticulture product saved successfully!');
                }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Produce Name *</label>
                      <input type="text" required value={editingHorticulture.name} onChange={e => setEditingHorticulture({...editingHorticulture, name: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Category</label>
                      <input type="text" value={editingHorticulture.category} onChange={e => setEditingHorticulture({...editingHorticulture, category: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Description</label>
                    <textarea rows={3} value={editingHorticulture.description} onChange={e => setEditingHorticulture({...editingHorticulture, description: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Availability Status</label>
                      <select
                        value={editingHorticulture.availability}
                        onChange={e => setEditingHorticulture({...editingHorticulture, availability: e.target.value as any})}
                        className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded"
                      >
                        <option value="In Season & In Stock">In Season & In Stock</option>
                        <option value="Limited Stock">Limited Stock</option>
                        <option value="Coming Soon">Coming Soon</option>
                        <option value="Out of Season">Out of Season</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Harvest Season</label>
                      <input type="text" value={editingHorticulture.harvestSeason} onChange={e => setEditingHorticulture({...editingHorticulture, harvestSeason: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Pack Sizes (comma separated)</label>
                    <input type="text" value={editingHorticulture.packSizes.join(', ')} onChange={e => setEditingHorticulture({...editingHorticulture, packSizes: e.target.value.split(',').map(s => s.trim())})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Image URL</label>
                    <div className="flex gap-2">
                      <input type="url" value={editingHorticulture.image} onChange={e => setEditingHorticulture({...editingHorticulture, image: e.target.value})} className="flex-1 bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                      <button
                        type="button"
                        onClick={() => openMediaPickerFor((url) => setEditingHorticulture({...editingHorticulture, image: url}))}
                        className="px-4 py-2 bg-[#A4C293]/20 hover:bg-[#A4C293]/30 border border-[#A4C293]/40 text-[#A4C293] text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1.5 shrink-0 transition-colors"
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span>Media Library</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Nutritional Highlights (comma separated)</label>
                    <input type="text" value={editingHorticulture.nutritionalHighlights.join(', ')} onChange={e => setEditingHorticulture({...editingHorticulture, nutritionalHighlights: e.target.value.split(',').map(s => s.trim())})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Growing Method</label>
                    <input type="text" value={editingHorticulture.growingMethod} onChange={e => setEditingHorticulture({...editingHorticulture, growingMethod: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                  </div>
                  <div className="pt-4 flex justify-end gap-4">
                    <button type="button" onClick={() => setEditingHorticulture(null)} className="px-6 py-3 bg-white/10 text-xs font-bold uppercase tracking-widest text-white rounded">Cancel</button>
                    <button type="submit" className="px-6 py-3 bg-[#A4C293] text-[#0A0C0A] text-xs font-bold uppercase tracking-widest hover:bg-white rounded">Save Produce</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 6. BEEF PAGE CMS TAB */}
          {activeAdminTab === 'beef_page' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <h2 className="text-2xl font-serif text-[#F8F9FA] mb-1">Beef Page CMS</h2>
                  <p className="text-xs text-[#F8F9FA]/60 uppercase tracking-widest font-semibold">
                    Manage introduction, feature blocks, wholesale CTA, and product cuts catalog
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await updateBeefPageConfig(beefPageForm);
                      showSuccess('Beef Page updated successfully!');
                    }}
                    className="px-5 py-2.5 bg-[#A4C293] text-[#0A0C0A] text-xs font-bold uppercase tracking-widest rounded hover:bg-white transition-colors flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Save Page Changes
                  </button>
                </div>
              </div>

              {/* Sub-tabs */}
              <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
                <button
                  type="button"
                  onClick={() => setBeefSubTab('intro')}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors ${
                    beefSubTab === 'intro' ? 'bg-[#A4C293] text-[#0A0C0A]' : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  1. Hero & Story Intro
                </button>
                <button
                  type="button"
                  onClick={() => setBeefSubTab('features')}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors ${
                    beefSubTab === 'features' ? 'bg-[#A4C293] text-[#0A0C0A]' : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  2. Feature Blocks ({beefPageForm.featureBlocks?.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setBeefSubTab('products')}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors ${
                    beefSubTab === 'products' ? 'bg-[#A4C293] text-[#0A0C0A]' : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  3. Beef Products Catalog ({beefProducts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setBeefSubTab('wholesale')}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors ${
                    beefSubTab === 'wholesale' ? 'bg-[#A4C293] text-[#0A0C0A]' : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  4. Wholesale CTA
                </button>
              </div>

              {/* Sub-tab 1: Intro */}
              {beefSubTab === 'intro' && (
                <div className="space-y-6 bg-black/40 border border-white/10 p-6 rounded-lg">
                  <h3 className="text-lg font-serif text-white font-bold border-b border-white/10 pb-3">Hero Banner & Introduction Section</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Hero Title</label>
                      <input
                        type="text"
                        value={beefPageForm.heroTitle || ''}
                        onChange={e => setBeefPageForm({...beefPageForm, heroTitle: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Hero Subtitle</label>
                      <input
                        type="text"
                        value={beefPageForm.heroSubtitle || ''}
                        onChange={e => setBeefPageForm({...beefPageForm, heroSubtitle: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Badge Text</label>
                      <input
                        type="text"
                        value={beefPageForm.badgeText || ''}
                        onChange={e => setBeefPageForm({...beefPageForm, badgeText: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">CTA Button Text</label>
                      <input
                        type="text"
                        value={beefPageForm.heroCta || ''}
                        onChange={e => setBeefPageForm({...beefPageForm, heroCta: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">WhatsApp Button Text</label>
                      <input
                        type="text"
                        value={beefPageForm.whatsappCtaText || ''}
                        onChange={e => setBeefPageForm({...beefPageForm, whatsappCtaText: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">WhatsApp Phone Number</label>
                      <input
                        type="text"
                        value={beefPageForm.whatsappNumber || ''}
                        onChange={e => setBeefPageForm({...beefPageForm, whatsappNumber: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Hero Wallpaper Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={beefPageForm.heroImage || ''}
                        onChange={e => setBeefPageForm({...beefPageForm, heroImage: e.target.value})}
                        className="flex-1 bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                      />
                      <button
                        type="button"
                        onClick={() => openMediaPickerFor((url) => setBeefPageForm({...beefPageForm, heroImage: url}))}
                        className="px-4 py-2 bg-[#A4C293]/20 hover:bg-[#A4C293]/30 border border-[#A4C293]/40 text-[#A4C293] text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1.5"
                      >
                        <ImageIcon className="w-4 h-4" /> Media Library
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6 space-y-4">
                    <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Introduction / Story Section</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Section Eyebrow</label>
                        <input
                          type="text"
                          value={beefPageForm.introEyebrow || ''}
                          onChange={e => setBeefPageForm({...beefPageForm, introEyebrow: e.target.value})}
                          className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Section Heading</label>
                        <input
                          type="text"
                          value={beefPageForm.introHeading || ''}
                          onChange={e => setBeefPageForm({...beefPageForm, introHeading: e.target.value})}
                          className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Paragraph 1</label>
                      <textarea
                        rows={3}
                        value={beefPageForm.introParagraph1 || ''}
                        onChange={e => setBeefPageForm({...beefPageForm, introParagraph1: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Paragraph 2</label>
                      <textarea
                        rows={3}
                        value={beefPageForm.introParagraph2 || ''}
                        onChange={e => setBeefPageForm({...beefPageForm, introParagraph2: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Introduction Section Image URL</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={beefPageForm.introImage || ''}
                          onChange={e => setBeefPageForm({...beefPageForm, introImage: e.target.value})}
                          className="flex-1 bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                        />
                        <button
                          type="button"
                          onClick={() => openMediaPickerFor((url) => setBeefPageForm({...beefPageForm, introImage: url}))}
                          className="px-4 py-2 bg-[#A4C293]/20 hover:bg-[#A4C293]/30 border border-[#A4C293]/40 text-[#A4C293] text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1.5"
                        >
                          <ImageIcon className="w-4 h-4" /> Media Library
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 2: Feature Blocks */}
              {beefSubTab === 'features' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-serif text-white font-bold">Beef Page Feature Blocks</h3>
                      <p className="text-xs text-white/60">Manage highlight blocks displayed alongside the beef introduction section</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingBeefFeatureBlock({
                        id: 'beef-feat-' + Date.now(),
                        title: 'New Feature',
                        description: 'Feature description...',
                        icon: 'ShieldCheck'
                      })}
                      className="px-4 py-2.5 bg-[#A4C293] text-[#0A0C0A] text-xs font-bold uppercase tracking-widest rounded hover:bg-white transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Feature Block
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {beefPageForm.featureBlocks?.map((block) => (
                      <div key={block.id} className="bg-black/50 border border-white/10 p-6 rounded-lg flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] uppercase font-bold text-[#A4C293] bg-[#A4C293]/10 px-2 py-0.5 rounded">{block.icon}</span>
                            <div className="flex items-center gap-1">
                              <button onClick={() => setEditingBeefFeatureBlock(block)} className="p-1.5 bg-white/5 hover:bg-white/10 text-white rounded">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => {
                                  const updatedBlocks = beefPageForm.featureBlocks.filter(b => b.id !== block.id);
                                  setBeefPageForm({...beefPageForm, featureBlocks: updatedBlocks});
                                }} 
                                className="p-1.5 bg-red-950/60 text-red-200 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <h4 className="text-base font-serif font-bold text-white mb-1">{block.title}</h4>
                          <p className="text-xs text-white/70 font-light">{block.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-tab 3: Products Catalog */}
              {beefSubTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-serif text-white font-bold">Beef Products & Cuts Catalog</h3>
                      <p className="text-xs text-white/60">Manage prime cuts, description, availability, and pricing</p>
                    </div>
                    <button
                      onClick={() => setEditingBeef({
                        name: 'New Beef Cut',
                        code: `BF-${Date.now().toString().slice(-4)}`,
                        description: 'Description of beef product...',
                        idealFor: 'Grilling & Roasts',
                        marbling: 'Rich & Flavorful',
                        image: photos[0] || '',
                        packSizes: ['1kg Pack', '5kg Box'],
                        pricing: 'Contact for Wholesale Pricing',
                        availability: 'In Stock'
                      })}
                      className="bg-[#F8F9FA] text-[#0A0C0A] px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#A4C293] transition-colors flex items-center gap-2 rounded"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Beef Product</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {beefProducts.map((beef) => (
                      <div key={beef.code} className="bg-black/50 border border-white/10 p-6 rounded-lg flex items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          {beef.image && (
                            <img src={beef.image} alt={beef.name} className="w-16 h-16 object-cover border border-white/10 rounded shrink-0" referrerPolicy="no-referrer" />
                          )}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] text-[#A4C293] uppercase tracking-widest font-bold">Code: {beef.code}</span>
                              <span className="text-[10px] px-2 py-0.5 bg-white/10 text-white font-medium rounded">{beef.availability || 'In Stock'}</span>
                            </div>
                            <h3 className="text-lg font-serif text-[#F8F9FA] font-bold">{beef.name}</h3>
                            <p className="text-xs text-[#F8F9FA]/70 line-clamp-1">{beef.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <button onClick={() => setEditingBeef(beef)} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 rounded">
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button onClick={() => deleteBeefProduct(beef.code)} className="p-2 bg-red-950/60 hover:bg-red-900/60 text-red-200 border border-red-500/30 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-tab 4: Wholesale CTA */}
              {beefSubTab === 'wholesale' && (
                <div className="space-y-6 bg-black/40 border border-white/10 p-6 rounded-lg">
                  <h3 className="text-lg font-serif text-white font-bold border-b border-white/10 pb-3">Wholesale & Distribution CTA Section</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Section Heading</label>
                      <input
                        type="text"
                        value={beefPageForm.wholesaleHeading || ''}
                        onChange={e => setBeefPageForm({...beefPageForm, wholesaleHeading: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">CTA Button Text</label>
                      <input
                        type="text"
                        value={beefPageForm.wholesaleCtaText || ''}
                        onChange={e => setBeefPageForm({...beefPageForm, wholesaleCtaText: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Section Description</label>
                    <textarea
                      rows={3}
                      value={beefPageForm.wholesaleDescription || ''}
                      onChange={e => setBeefPageForm({...beefPageForm, wholesaleDescription: e.target.value})}
                      className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">WhatsApp Button Text</label>
                      <input
                        type="text"
                        value={beefPageForm.wholesaleWhatsappText || ''}
                        onChange={e => setBeefPageForm({...beefPageForm, wholesaleWhatsappText: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={beefPageForm.wholesalePhone || ''}
                        onChange={e => setBeefPageForm({...beefPageForm, wholesalePhone: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Contact Email</label>
                      <input
                        type="email"
                        value={beefPageForm.wholesaleEmail || ''}
                        onChange={e => setBeefPageForm({...beefPageForm, wholesaleEmail: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Beef Feature Block Modal */}
              {editingBeefFeatureBlock && (
            <div className="fixed inset-0 z-50 bg-[#0A0C0A]/90 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto">
              <div className="max-w-md w-full bg-[#0A0C0A] border border-white/20 p-8 shadow-2xl rounded-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-serif text-[#F8F9FA]">Edit Feature Block</h3>
                  <button onClick={() => setEditingBeefFeatureBlock(null)} className="text-white/60 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const exists = beefPageForm.featureBlocks.some(b => b.id === editingBeefFeatureBlock.id);
                  const updatedBlocks = exists 
                    ? beefPageForm.featureBlocks.map(b => b.id === editingBeefFeatureBlock.id ? editingBeefFeatureBlock : b)
                    : [...beefPageForm.featureBlocks, editingBeefFeatureBlock];
                  const updatedForm = {...beefPageForm, featureBlocks: updatedBlocks};
                  setBeefPageForm(updatedForm);
                  await updateBeefPageConfig(updatedForm);
                  setEditingBeefFeatureBlock(null);
                  showSuccess('Beef feature block saved successfully!');
                }} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={editingBeefFeatureBlock.title}
                      onChange={e => setEditingBeefFeatureBlock({...editingBeefFeatureBlock, title: e.target.value})}
                      className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Icon (ShieldCheck, Award, Beef, Sun, Droplets, Package)</label>
                    <input
                      type="text"
                      required
                      value={editingBeefFeatureBlock.icon}
                      onChange={e => setEditingBeefFeatureBlock({...editingBeefFeatureBlock, icon: e.target.value})}
                      className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Description</label>
                    <textarea
                      rows={3}
                      required
                      value={editingBeefFeatureBlock.description}
                      onChange={e => setEditingBeefFeatureBlock({...editingBeefFeatureBlock, description: e.target.value})}
                      className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded"
                    />
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => setEditingBeefFeatureBlock(null)} className="px-5 py-2.5 bg-white/10 text-xs font-bold uppercase tracking-widest text-white rounded">Cancel</button>
                    <button type="submit" className="px-5 py-2.5 bg-[#A4C293] text-[#0A0C0A] text-xs font-bold uppercase tracking-widest rounded hover:bg-white">Save Block</button>
                  </div>
                </form>
              </div>
            </div>
          )}

              {/* Edit Beef Modal */}
              {editingBeef && (
                <div className="fixed inset-0 z-50 bg-[#0A0C0A]/90 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto">
                  <div className="max-w-xl w-full bg-[#0A0C0A] border border-white/20 p-8 shadow-2xl rounded-lg my-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-serif text-[#F8F9FA]">Edit Beef Product</h3>
                      <button onClick={() => setEditingBeef(null)} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      await saveBeefProduct(editingBeef);
                      setEditingBeef(null);
                      showSuccess('Beef product saved successfully!');
                    }} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Product Name *</label>
                          <input type="text" required value={editingBeef.name} onChange={e => setEditingBeef({...editingBeef, name: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Code (e.g. BF-01) *</label>
                          <input type="text" required value={editingBeef.code} onChange={e => setEditingBeef({...editingBeef, code: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Description</label>
                        <textarea rows={3} value={editingBeef.description} onChange={e => setEditingBeef({...editingBeef, description: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Ideal For</label>
                          <input type="text" value={editingBeef.idealFor} onChange={e => setEditingBeef({...editingBeef, idealFor: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Marbling Profile</label>
                          <input type="text" value={editingBeef.marbling} onChange={e => setEditingBeef({...editingBeef, marbling: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Availability</label>
                          <select
                            value={editingBeef.availability || 'In Stock'}
                            onChange={e => setEditingBeef({...editingBeef, availability: e.target.value as any})}
                            className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded"
                          >
                            <option value="In Stock">In Stock</option>
                            <option value="Available on Order">Available on Order</option>
                            <option value="Seasonal">Seasonal</option>
                            <option value="Out of Stock">Out of Stock</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Pricing / Terms</label>
                          <input type="text" value={editingBeef.pricing || ''} onChange={e => setEditingBeef({...editingBeef, pricing: e.target.value})} placeholder="Contact for Wholesale" className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Pack Sizes (comma separated)</label>
                        <input type="text" value={editingBeef.packSizes ? editingBeef.packSizes.join(', ') : ''} onChange={e => setEditingBeef({...editingBeef, packSizes: e.target.value.split(',').map(s => s.trim())})} placeholder="5kg Pack, 10kg Box" className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Image URL</label>
                        <div className="flex gap-2">
                          <input type="url" value={editingBeef.image || ''} onChange={e => setEditingBeef({...editingBeef, image: e.target.value})} placeholder="https://..." className="flex-1 bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                          <button
                            type="button"
                            onClick={() => openMediaPickerFor((url) => setEditingBeef({...editingBeef, image: url}))}
                            className="px-4 py-2 bg-[#A4C293]/20 hover:bg-[#A4C293]/30 border border-[#A4C293]/40 text-[#A4C293] text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1.5 shrink-0 transition-colors"
                          >
                            <ImageIcon className="w-4 h-4" />
                            <span>Media Library</span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-4 flex justify-end gap-4">
                        <button type="button" onClick={() => setEditingBeef(null)} className="px-6 py-3 bg-white/10 text-xs font-bold uppercase tracking-widest text-white rounded">Cancel</button>
                        <button type="submit" className="px-6 py-3 bg-[#A4C293] text-[#0A0C0A] text-xs font-bold uppercase tracking-widest hover:bg-white rounded">Save Product</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 7. GALLERY SHOWCASE TAB */}
          {activeAdminTab === 'gallery' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif text-[#F8F9FA] mb-1">Gallery Showcase Manager</h2>
                  <p className="text-xs text-[#F8F9FA]/60 uppercase tracking-widest font-semibold">
                    Manage showcase images, captions, and categories
                  </p>
                </div>
                <button
                  onClick={() => setEditingGallery({
                    id: `gallery-${Date.now()}`,
                    title: 'New Gallery Item',
                    category: 'Horticulture',
                    image: photos[0] || '',
                    description: 'Description of photo...',
                    date: 'August 2026'
                  })}
                  className="bg-[#F8F9FA] text-[#0A0C0A] px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#A4C293] transition-colors flex items-center gap-2 rounded"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Gallery Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gallery.map((item) => (
                  <div key={item.id} className="bg-black/50 border border-white/10 p-4 rounded-lg flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="h-40 rounded overflow-hidden border border-white/10 relative">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-[#A4C293] text-[9px] font-bold uppercase tracking-widest rounded border border-white/10">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-serif font-bold text-white">{item.title}</h3>
                      <p className="text-xs text-white/60 line-clamp-2">{item.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                      <span className="text-[10px] text-white/40">{item.date}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditingGallery(item)} className="p-1.5 bg-white/5 hover:bg-white/15 text-white rounded"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => deleteGalleryItem(item.id)} className="p-1.5 bg-red-950/60 hover:bg-red-900/60 text-red-200 border border-red-500/30 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Gallery Modal */}
              {editingGallery && (
                <div className="fixed inset-0 z-50 bg-[#0A0C0A]/90 backdrop-blur-md flex items-center justify-center p-6">
                  <div className="max-w-xl w-full bg-[#0A0C0A] border border-white/20 p-8 shadow-2xl rounded-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-serif text-[#F8F9FA]">Edit Gallery Photo</h3>
                      <button onClick={() => setEditingGallery(null)} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      await saveGalleryItem(editingGallery);
                      setEditingGallery(null);
                      showSuccess('Gallery item saved successfully!');
                    }} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Title *</label>
                          <input type="text" required value={editingGallery.title} onChange={e => setEditingGallery({...editingGallery, title: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Category</label>
                          <select value={editingGallery.category} onChange={e => setEditingGallery({...editingGallery, category: e.target.value as any})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded">
                            <option value="Horticulture">Horticulture</option>
                            <option value="Livestock">Livestock</option>
                            <option value="Technology">Technology</option>
                            <option value="Farm">Farm</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Image URL *</label>
                        <div className="flex gap-2">
                          <input type="url" required value={editingGallery.image} onChange={e => setEditingGallery({...editingGallery, image: e.target.value})} className="flex-1 bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                          <button
                            type="button"
                            onClick={() => openMediaPickerFor((url) => setEditingGallery({...editingGallery, image: url}))}
                            className="px-4 py-2 bg-[#A4C293]/20 hover:bg-[#A4C293]/30 border border-[#A4C293]/40 text-[#A4C293] text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1.5 shrink-0 transition-colors"
                          >
                            <ImageIcon className="w-4 h-4" />
                            <span>Media Library</span>
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Description</label>
                        <textarea rows={2} value={editingGallery.description} onChange={e => setEditingGallery({...editingGallery, description: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Date</label>
                        <input type="text" value={editingGallery.date} onChange={e => setEditingGallery({...editingGallery, date: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                      </div>
                      <div className="pt-4 flex justify-end gap-4">
                        <button type="button" onClick={() => setEditingGallery(null)} className="px-6 py-3 bg-white/10 text-xs font-bold uppercase tracking-widest text-white rounded">Cancel</button>
                        <button type="submit" className="px-6 py-3 bg-[#A4C293] text-[#0A0C0A] text-xs font-bold uppercase tracking-widest hover:bg-white rounded">Save Image</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 8. NEWS TAB */}
          {activeAdminTab === 'news' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif text-[#F8F9FA] mb-1">News & Farm Updates</h2>
                  <p className="text-xs text-[#F8F9FA]/60 uppercase tracking-widest font-semibold">
                    Create, edit, publish, draft, or delete news articles
                  </p>
                </div>
                <button
                  onClick={() => setEditingNews({
                    id: `news-${Date.now()}`,
                    title: 'New Article Title',
                    slug: 'new-article-title',
                    excerpt: 'Short excerpt...',
                    content: 'Full article content here...',
                    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                    category: 'Sustainability',
                    readTime: '3 min read',
                    image: photos[0] || '',
                    author: 'Gabolekwe Editorial',
                    status: 'Published',
                    tags: ['Sustainability', 'Agriculture'],
                    seoTitle: 'Farm News | Gabolekwe Farms',
                    seoDescription: 'Read latest updates from Gabolekwe Farms.'
                  })}
                  className="bg-[#F8F9FA] text-[#0A0C0A] px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#A4C293] transition-colors flex items-center gap-2 rounded"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Article</span>
                </button>
              </div>

              <div className="space-y-4">
                {news.map((article) => (
                  <div key={article.id} className="bg-black/50 border border-white/10 p-6 rounded-lg flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      {article.image && (
                        <img src={article.image} alt={article.title} className="w-16 h-16 object-cover border border-white/10 rounded shrink-0" referrerPolicy="no-referrer" />
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] text-[#A4C293] uppercase tracking-widest font-bold">{article.category} • {article.date}</span>
                          <span className={`text-[9px] px-2 py-0.5 uppercase tracking-widest font-bold rounded ${article.status === 'Draft' ? 'bg-amber-950 text-amber-200 border border-amber-500/40' : 'bg-emerald-950 text-emerald-200 border border-emerald-500/40'}`}>
                            {article.status || 'Published'}
                          </span>
                        </div>
                        <h3 className="text-lg font-serif text-[#F8F9FA] font-bold">{article.title}</h3>
                        <p className="text-xs text-[#F8F9FA]/70 line-clamp-1">{article.excerpt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={async () => {
                          const newStatus = article.status === 'Draft' ? 'Published' : 'Draft';
                          await saveNewsArticle({ ...article, status: newStatus });
                          showSuccess(`Article "${article.title}" marked as ${newStatus}`);
                        }}
                        className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded border transition-colors ${
                          article.status === 'Draft'
                            ? 'bg-amber-950/60 text-amber-300 border-amber-500/40 hover:bg-amber-900/60'
                            : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                        }`}
                      >
                        {article.status === 'Draft' ? 'Draft' : 'Published'}
                      </button>
                      <button onClick={() => setEditingNews(article)} className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 rounded">
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button onClick={() => deleteNewsArticle(article.id)} className="p-2 bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 text-red-200 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit News Modal */}
              {editingNews && (
                <div className="fixed inset-0 z-50 bg-[#0A0C0A]/90 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto">
                  <div className="max-w-2xl w-full bg-[#0A0C0A] border border-white/20 p-8 shadow-2xl rounded-lg my-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-serif text-[#F8F9FA]">Edit News Article</h3>
                      <button onClick={() => setEditingNews(null)} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      await saveNewsArticle(editingNews);
                      setEditingNews(null);
                      showSuccess('News article saved successfully!');
                    }} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Article Title *</label>
                          <input 
                            type="text" 
                            required 
                            value={editingNews.title} 
                            onChange={e => {
                              const newTitle = e.target.value;
                              const generatedSlug = newTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-');
                              setEditingNews({
                                ...editingNews, 
                                title: newTitle,
                                slug: editingNews.slug && editingNews.slug !== generatedSlug ? editingNews.slug : generatedSlug
                              });
                            }} 
                            className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">URL Slug *</label>
                          <div className="flex items-center bg-black/50 border border-white/10 rounded px-3 py-1">
                            <span className="text-xs text-white/40 mr-1">/news/</span>
                            <input 
                              type="text" 
                              required
                              value={editingNews.slug || ''} 
                              onChange={e => setEditingNews({...editingNews, slug: e.target.value})} 
                              className="w-full bg-transparent border-none p-2 text-sm text-white focus:outline-none" 
                            />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Category</label>
                          <input type="text" value={editingNews.category} onChange={e => setEditingNews({...editingNews, category: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Publication Date</label>
                          <input type="text" value={editingNews.date} onChange={e => setEditingNews({...editingNews, date: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Status</label>
                          <select 
                            value={editingNews.status || 'Published'} 
                            onChange={e => setEditingNews({...editingNews, status: e.target.value as any})}
                            className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded"
                          >
                            <option value="Published">Published</option>
                            <option value="Draft">Save Draft</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Excerpt</label>
                        <textarea rows={2} value={editingNews.excerpt} onChange={e => setEditingNews({...editingNews, excerpt: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Full Content</label>
                        <textarea rows={5} value={editingNews.content} onChange={e => setEditingNews({...editingNews, content: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Author</label>
                          <input type="text" value={editingNews.author} onChange={e => setEditingNews({...editingNews, author: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Read Time</label>
                          <input type="text" value={editingNews.readTime} onChange={e => setEditingNews({...editingNews, readTime: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Tags (comma separated)</label>
                          <input type="text" value={editingNews.tags ? editingNews.tags.join(', ') : ''} onChange={e => setEditingNews({...editingNews, tags: e.target.value.split(',').map(s => s.trim())})} placeholder="Sustainability, Farm" className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Featured Image URL</label>
                        <div className="flex gap-2">
                          <input type="url" value={editingNews.image} onChange={e => setEditingNews({...editingNews, image: e.target.value})} className="flex-1 bg-black/50 border border-white/10 p-3 text-sm text-white rounded" />
                          <button
                            type="button"
                            onClick={() => openMediaPickerFor((url) => setEditingNews({...editingNews, image: url}))}
                            className="px-4 py-2 bg-[#A4C293]/20 hover:bg-[#A4C293]/30 border border-[#A4C293]/40 text-[#A4C293] text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1.5 shrink-0 transition-colors"
                          >
                            <ImageIcon className="w-4 h-4" />
                            <span>Media Library</span>
                          </button>
                        </div>
                      </div>
                      <div className="pt-4 flex justify-end gap-4">
                        <button type="button" onClick={() => setEditingNews(null)} className="px-6 py-3 bg-white/10 text-xs font-bold uppercase tracking-widest text-white rounded">Cancel</button>
                        <button type="submit" className="px-6 py-3 bg-[#A4C293] text-[#0A0C0A] text-xs font-bold uppercase tracking-widest hover:bg-white rounded">Save Article</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 9. MEDIA LIBRARY TAB */}
          {activeAdminTab === 'photos' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-serif text-[#F8F9FA] mb-1">Media Library</h2>
                <p className="text-xs text-[#F8F9FA]/60 uppercase tracking-widest font-semibold">
                  Upload local files to Firebase Storage or enter external image URLs
                </p>
              </div>

              {/* Upload Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/50 p-6 border border-white/10 rounded-lg">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Option A: Upload Local Image File</h3>
                  <p className="text-xs text-white/60">Upload directly from device to Firebase Storage bucket with live progress</p>
                  <button
                    type="button"
                    onClick={() => openMediaPickerFor(() => {})}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-[#A4C293] text-[#0A0C0A] text-xs font-bold uppercase tracking-widest rounded cursor-pointer hover:bg-white transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Image File</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Option B: Add Image URL</h3>
                  <p className="text-xs text-white/60">Paste an existing Unsplash or hosted photo link</p>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newPhotoUrl.trim()) return;
                    await uploadPhoto(newPhotoUrl.trim());
                    setNewPhotoUrl('');
                    showSuccess('Image URL added to media library!');
                  }} className="flex gap-2">
                    <input
                      type="url"
                      required
                      value={newPhotoUrl}
                      onChange={e => setNewPhotoUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 bg-black/60 border border-white/10 px-3 py-2 text-xs text-white rounded"
                    />
                    <button type="submit" className="px-4 py-2 bg-white text-[#0A0C0A] text-xs font-bold uppercase tracking-wider rounded hover:bg-[#A4C293]">
                      Add URL
                    </button>
                  </form>
                </div>
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {photos.map((photo, idx) => (
                  <div key={idx} className="group relative h-40 rounded overflow-hidden border border-white/10 bg-black/40">
                    <img src={photo} alt={`Farm asset ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between items-end">
                      <button
                        onClick={() => deletePhoto(photo)}
                        className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                        title="Delete Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <span className="text-[9px] text-white/70 font-mono truncate w-full">{photo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. USERS TAB */}
          {activeAdminTab === 'admins' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif text-[#F8F9FA] mb-1">Administrator Accounts</h2>
                  <p className="text-xs text-[#F8F9FA]/60 uppercase tracking-widest font-semibold">
                    {isSuperAdmin ? 'Manage system administrators, roles, and security permissions' : 'Registered system administrators'}
                  </p>
                </div>
                {isSuperAdmin && (
                  <button
                    onClick={() => setEditingAdmin({
                      id: 'admin_' + Date.now(),
                      email: '',
                      role: 'Admin',
                      status: 'Active',
                      createdAt: new Date().toISOString()
                    })}
                    className="bg-[#F8F9FA] text-[#0A0C0A] px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#A4C293] transition-colors flex items-center gap-2 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Admin User</span>
                  </button>
                )}
              </div>

              {!isSuperAdmin && (
                <div className="p-4 bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs rounded-lg">
                  Note: Logged in as standard Admin. Only Super Admin (topogabolekwe@gmail.com) can modify administrator privileges.
                </div>
              )}

              <div className="space-y-4">
                {adminUsers.map((admin) => (
                  <div key={admin.id || admin.email} className="bg-black/50 border border-white/10 p-6 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`px-2.5 py-0.5 text-[9px] uppercase tracking-widest font-bold border rounded ${
                          admin.role === 'Super Admin' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' : 'bg-white/10 text-white/80 border-white/20'
                        }`}>
                          {admin.role}
                        </span>
                        <span className={`px-2.5 py-0.5 text-[9px] uppercase tracking-widest font-bold border rounded ${
                          admin.status === 'Active' ? 'bg-sky-950/60 text-sky-300 border-sky-500/30' : 'bg-red-950/60 text-red-300 border-red-500/30'
                        }`}>
                          {admin.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-serif text-[#F8F9FA] font-bold">{admin.email}</h3>
                      <p className="text-[11px] text-white/50">Created: {new Date(admin.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>

                    {isSuperAdmin && admin.email !== 'topogabolekwe@gmail.com' && (
                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => setEditingAdmin(admin)}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm(`Are you sure you want to remove administrator ${admin.email}?`)) {
                              try {
                                await deleteAdminUser(admin.id);
                                showSuccess('Administrator removed successfully.');
                              } catch (err: any) {
                                alert(err.message);
                              }
                            }
                          }}
                          className="p-2 bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 text-red-200 rounded"
                          title="Remove Admin"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Edit / Add Admin Modal */}
              {editingAdmin && (
                <div className="fixed inset-0 z-50 bg-[#0A0C0A]/90 backdrop-blur-md flex items-center justify-center p-6">
                  <div className="max-w-md w-full bg-[#0A0C0A] border border-white/20 p-8 shadow-2xl rounded-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-serif text-[#F8F9FA]">Manage Administrator</h3>
                      <button onClick={() => setEditingAdmin(null)} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        await saveAdminUser(editingAdmin);
                        setEditingAdmin(null);
                        showSuccess('Administrator saved successfully!');
                      } catch (err: any) {
                        alert(err.message);
                      }
                    }} className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Admin Email *</label>
                        <input
                          type="email"
                          required
                          disabled={editingAdmin.email === 'topogabolekwe@gmail.com'}
                          value={editingAdmin.email}
                          onChange={e => setEditingAdmin({...editingAdmin, email: e.target.value})}
                          className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Role</label>
                        <select
                          disabled={editingAdmin.email === 'topogabolekwe@gmail.com'}
                          value={editingAdmin.role}
                          onChange={e => setEditingAdmin({...editingAdmin, role: e.target.value as any})}
                          className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded disabled:opacity-50"
                        >
                          <option value="Admin">Admin</option>
                          <option value="Super Admin">Super Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/70 mb-1">Access Status</label>
                        <select
                          disabled={editingAdmin.email === 'topogabolekwe@gmail.com'}
                          value={editingAdmin.status}
                          onChange={e => setEditingAdmin({...editingAdmin, status: e.target.value as any})}
                          className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white rounded disabled:opacity-50"
                        >
                          <option value="Active">Active</option>
                          <option value="Disabled">Disabled</option>
                        </select>
                      </div>
                      <div className="pt-4 flex justify-end gap-4">
                        <button type="button" onClick={() => setEditingAdmin(null)} className="px-6 py-3 bg-white/10 text-xs font-bold uppercase tracking-widest text-white rounded">Cancel</button>
                        <button type="submit" className="px-6 py-3 bg-[#A4C293] text-[#0A0C0A] text-xs font-bold uppercase tracking-widest hover:bg-white rounded">Save Admin</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 11. SITE SETTINGS TAB */}
          {activeAdminTab === 'config' && (
            <form onSubmit={handleSaveConfig} className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif text-[#F8F9FA] mb-1">Site & Branding Settings</h2>
                <p className="text-xs text-[#F8F9FA]/60 uppercase tracking-widest font-semibold mb-6">
                  Manage Gabolekwe Farms corporate identity, contact info, and social channels
                </p>
              </div>

              {/* SITE NAME & TAGLINE */}
              <div className="space-y-4 bg-black/40 border border-white/10 p-6 rounded-lg">
                <h3 className="text-lg font-serif text-[#F8F9FA] pb-2 border-b border-white/10 font-bold">General Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#F8F9FA]/70 mb-2">Site Name</label>
                    <input type="text" value={configForm.siteName || ''} onChange={e => setConfigForm({...configForm, siteName: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3.5 text-sm text-white rounded" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#F8F9FA]/70 mb-2">Tagline</label>
                    <input type="text" value={configForm.tagline || ''} onChange={e => setConfigForm({...configForm, tagline: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3.5 text-sm text-white rounded" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 bg-black/40 border border-white/10 p-6 rounded-lg">
                <h3 className="text-lg font-serif text-[#F8F9FA] pb-2 border-b border-white/10 font-bold">Contact & Headquarters</h3>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#F8F9FA]/70 mb-2">Headquarters & Farm Address</label>
                  <input type="text" value={configForm.address} onChange={e => setConfigForm({...configForm, address: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3.5 text-sm text-white rounded" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#F8F9FA]/70 mb-2">Phone Number(s)</label>
                    <input type="text" value={configForm.phone} onChange={e => setConfigForm({...configForm, phone: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3.5 text-sm text-white rounded" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#F8F9FA]/70 mb-2">Email Address(es)</label>
                    <input type="text" value={configForm.email} onChange={e => setConfigForm({...configForm, email: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3.5 text-sm text-white rounded" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#F8F9FA]/70 mb-2">WhatsApp Number</label>
                    <input type="text" value={configForm.whatsapp || ''} onChange={e => setConfigForm({...configForm, whatsapp: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3.5 text-sm text-white rounded" placeholder="+267 73004101" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#F8F9FA]/70 mb-2">Operating Hours</label>
                  <input type="text" value={configForm.hours} onChange={e => setConfigForm({...configForm, hours: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3.5 text-sm text-white rounded" />
                </div>

                <h3 className="text-lg font-serif text-[#F8F9FA] pt-4 pb-2 border-t border-white/10 font-bold">Social Media Channels</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#F8F9FA]/70 mb-2">Facebook URL</label>
                    <input type="url" value={configForm.facebook} onChange={e => setConfigForm({...configForm, facebook: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3.5 text-sm text-white rounded" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#F8F9FA]/70 mb-2">Twitter / X URL</label>
                    <input type="url" value={configForm.twitter} onChange={e => setConfigForm({...configForm, twitter: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3.5 text-sm text-white rounded" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/70 mb-2">LinkedIn URL</label>
                    <input type="url" value={configForm.linkedin} onChange={e => setConfigForm({...configForm, linkedin: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3.5 text-sm text-white rounded" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/70 mb-2">Instagram URL</label>
                    <input type="url" value={configForm.instagram} onChange={e => setConfigForm({...configForm, instagram: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3.5 text-sm text-white rounded" />
                  </div>
                </div>
              </div>

              <button type="submit" className="bg-[#A4C293] text-[#0A0C0A] px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors rounded">
                Save Site Settings
              </button>
            </form>
          )}

        </div>
      </main>

      {/* Media Library Selection Modal */}
      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelectImage={(url) => {
          if (pickerCallback) pickerCallback(url);
          showSuccess('Image selected from Media Library!');
        }}
        photos={photos}
        gallery={gallery}
        uploadFileToStorage={uploadFileToStorage}
        uploadPhoto={uploadPhoto}
        deletePhoto={deletePhoto}
      />
    </div>
  );
};
