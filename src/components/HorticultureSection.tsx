import React, { useState } from 'react';
import { useCMS } from '../lib/cmsStore';
import { HorticultureProduct, INITIAL_HORTICULTURE_PRODUCTS } from '../data/horticultureData';
import { DEFAULT_HORTICULTURE_PAGE_CONFIG } from '../data/defaultCMSData';
import { 
  Sprout, Droplets, CheckCircle, ArrowRight, MessageSquare, Phone, 
  Search, ShieldCheck, Sun, Layers, Package, Calendar, Info, X, ExternalLink
} from 'lucide-react';

interface HorticultureSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const HorticultureSection: React.FC<HorticultureSectionProps> = ({ onNavigate }) => {
  const { gallery, siteConfig, horticultureProducts, horticulturePageConfig } = useCMS();
  
  const config = horticulturePageConfig || DEFAULT_HORTICULTURE_PAGE_CONFIG;
  const hortProducts = horticultureProducts && horticultureProducts.length > 0 ? horticultureProducts : INITIAL_HORTICULTURE_PRODUCTS;

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProductModal, setActiveProductModal] = useState<HorticultureProduct | null>(null);

  // Enquiry modal state
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedProductForEnquiry, setSelectedProductForEnquiry] = useState<string>('');
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryEmail, setEnquiryEmail] = useState('');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

  const { submitEnquiry } = useCMS();

  const categories = ['All', 'Leafy Vegetables', 'Vine Crops', 'Traditional Greens', 'Fruiting Vegetables'];

  const filteredProducts = hortProducts.filter(prod => {
    const matchesCat = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.packSizes.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const horticultureGallery = gallery.filter(g => g.category === 'Horticulture' || g.title.toLowerCase().includes('greenhouse') || g.title.toLowerCase().includes('vegetable') || g.title.toLowerCase().includes('irrigation'));

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitEnquiry({
      name: enquiryName,
      phone: enquiryPhone,
      email: enquiryEmail,
      subject: `Horticulture Produce Enquiry${selectedProductForEnquiry ? ` - ${selectedProductForEnquiry}` : ''}`,
      service: 'Horticulture',
      message: enquiryMessage
    });
    setEnquirySubmitted(true);
    setTimeout(() => {
      setEnquirySubmitted(false);
      setEnquiryModalOpen(false);
      setEnquiryName('');
      setEnquiryPhone('');
      setEnquiryEmail('');
      setEnquiryMessage('');
    }, 3000);
  };

  const whatsappNumber = siteConfig.phone.replace(/[^0-9]/g, '') || '26772820542';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hello%20Gabolekwe%20Farms,%20I%20would%20like%20to%20enquire%20about%20your%20fresh%20horticulture%20produce.`;

  const renderFeatureIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'sun': return <Sun className="w-5 h-5 text-emerald-700" />;
      case 'shieldcheck': return <ShieldCheck className="w-5 h-5 text-emerald-700" />;
      case 'sprout': return <Sprout className="w-5 h-5 text-emerald-700" />;
      case 'layers': return <Layers className="w-5 h-5 text-emerald-700" />;
      case 'package': return <Package className="w-5 h-5 text-emerald-700" />;
      default: return <Droplets className="w-5 h-5 text-emerald-700" />;
    }
  };

  return (
    <div className="bg-[#FAFBF6] text-slate-900 min-h-screen pt-24">
      
      {/* 1. FULL-SCREEN VISUAL HERO */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-slate-900 overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          <img
            src={config.heroImage || "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=2000&q=80"}
            alt="Gabolekwe Farms Horticulture"
            className="w-full h-full object-cover opacity-45 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C0A] via-slate-950/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs uppercase tracking-[0.25em] font-bold mb-6 rounded-full backdrop-blur-sm">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>{config.badgeText || 'Gweta, Botswana • Farm-Fresh Produce'}</span>
          </div>

          <h1 className="text-4xl sm:text-7xl lg:text-8xl font-serif font-bold tracking-tight mb-6 max-w-5xl mx-auto text-white">
            {config.heroTitle || 'Horticulture Division'}
          </h1>

          <p className="text-lg sm:text-2xl text-slate-200 font-light max-w-3xl mx-auto leading-relaxed mb-10">
            {config.heroSubtitle || 'Cultivating nutrient-dense crops using precision irrigation and sustainable soil stewardship across fertile Botswana lands.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('produce-showcase');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-widest transition-colors shadow-lg flex items-center justify-center gap-3"
            >
              <span>{config.heroCta || 'Explore Fresh Produce'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-widest transition-colors shadow-lg flex items-center justify-center gap-3"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>WhatsApp Direct Enquiry</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. HORTICULTURE INTRODUCTION */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] uppercase tracking-widest font-bold">
              <span>{config.introBadge || 'Sustainable Agriculture in Gweta'}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 leading-tight">
              {config.introHeading || 'Grown with Care, Harvested at Peak Freshness'}
            </h2>
            <p className="text-slate-700 text-base sm:text-lg font-light leading-relaxed">
              {config.introParagraph1}
            </p>
            {config.introParagraph2 && (
              <p className="text-slate-600 text-sm font-light leading-relaxed">
                {config.introParagraph2}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {config.featureBlocks && config.featureBlocks.slice(0, 2).map((feat) => (
                <div key={feat.id} className="bg-white p-6 border border-slate-200 shadow-xs">
                  <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-3">
                    {renderFeatureIcon(feat.icon)}
                  </div>
                  <h3 className="text-base font-serif font-bold text-slate-900 mb-1">{feat.title}</h3>
                  <p className="text-xs text-slate-600 font-light">{feat.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] bg-slate-200 border border-slate-300 shadow-md overflow-hidden">
              <img
                src={config.introImage || "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1200&q=80"}
                alt="Greenhouse vegetables at Gabolekwe Farms"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            {config.featureBlocks && config.featureBlocks[2] && (
              <div className="absolute -bottom-6 -left-6 bg-slate-900 text-white p-6 border border-emerald-500/35 max-w-xs shadow-xl hidden sm:block">
                <div className="flex items-center gap-3 mb-2">
                  {renderFeatureIcon(config.featureBlocks[2].icon)}
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">{config.featureBlocks[2].title}</span>
                </div>
                <p className="text-xs text-slate-300 font-light">
                  {config.featureBlocks[2].description}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. WHAT WE PRODUCE (KEY CROPS HIGHLIGHT) */}
      <section className="bg-white py-24 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-emerald-700 block mb-2">Primary Harvests</span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 mb-4">
              {config.produceHeading || 'What We Produce'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-light">
              {config.produceDescription || 'Our core horticultural output is cultivated specifically for nutritional density, robust flavor, and dependable commercial supply.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hortProducts.slice(0, 6).map((crop) => (
              <div key={crop.id} className="bg-[#FAFBF6] border border-slate-200 overflow-hidden group hover:border-emerald-700 transition-all duration-300 flex flex-col">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img src={crop.image} alt={crop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <span className="absolute top-3 left-3 bg-slate-900/90 text-white text-[9px] uppercase tracking-widest font-bold px-2.5 py-1">
                    {crop.category}
                  </span>
                  <span className={`absolute top-3 right-3 text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 border ${
                    crop.availability === 'In Season & In Stock' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}>
                    {crop.availability}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">{crop.name}</h3>
                    <p className="text-xs text-slate-600 font-light leading-relaxed mb-4">{crop.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedProductForEnquiry(crop.name);
                      setEnquiryModalOpen(true);
                    }}
                    className="text-xs font-bold uppercase tracking-widest text-emerald-700 hover:text-emerald-800 flex items-center gap-2 pt-4 border-t border-slate-200"
                  >
                    <span>Enquire Availability</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FRESH PRODUCE SHOWCASE (SEARCH & FILTERABLE) */}
      <section id="produce-showcase" className="py-24 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-emerald-700 block mb-2">Catalog & Specifications</span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900">
              Fresh Produce Showcase
            </h2>
            <p className="text-slate-600 text-sm font-light mt-1">
              Browse available pack sizes, harvest schedules, and availability status.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search produce, pack size..."
              className="w-full bg-white border border-slate-300 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-700"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest whitespace-nowrap border transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 p-8">
            <Sprout className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-serif text-slate-800">No Produce Found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(prod => (
              <div key={prod.id} className="bg-white border border-slate-200 overflow-hidden flex flex-col shadow-xs hover:shadow-md transition-all">
                <div className="aspect-[16/10] relative overflow-hidden bg-slate-100">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <span className={`absolute top-3 right-3 text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 border ${
                    prod.availability === 'In Season & In Stock'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : prod.availability === 'Limited Stock'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}>
                    {prod.availability}
                  </span>
                  <span className="absolute top-3 left-3 bg-slate-900 text-white text-[9px] uppercase tracking-widest font-bold px-2.5 py-1">
                    {prod.category}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div className="space-y-3">
                    <h3 className="text-xl font-serif font-bold text-slate-900">{prod.name}</h3>
                    <p className="text-xs text-slate-600 font-light leading-relaxed line-clamp-2">{prod.description}</p>
                    
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-slate-700">
                        <Package className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="font-medium">Pack Sizes:</span>
                        <span className="text-slate-600 truncate">{prod.packSizes.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="font-medium">Season:</span>
                        <span className="text-slate-600">{prod.harvestSeason}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setActiveProductModal(prod)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5"
                    >
                      <Info className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Details</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedProductForEnquiry(prod.name);
                        setEnquiryModalOpen(true);
                      }}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold uppercase tracking-widest transition-colors shadow-xs"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. FARM-TO-MARKET STORY */}
      <section className="bg-slate-900 text-white py-24 my-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-emerald-400 block mb-2">Traceability & Quality</span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold mb-4">
              The Farm-to-Market Story
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
              From our fertile fields in Gweta to local vendors, markets, and premium lodges in Maun and surrounding areas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Sustainable Soil & Seed',
                desc: 'Carefully selected non-GMO seeds planted in nutrient-conditioned Gweta soil with organic compost.'
              },
              {
                step: '02',
                title: 'Precision Irrigation',
                desc: 'Automated solar and borehole drip irrigation delivering optimal hydration directly to plant root systems.'
              },
              {
                step: '03',
                title: 'Expert Harvest',
                desc: 'Hand-picked at exact maturity by trained farm workers to preserve crispness, flavor, and vitamins.'
              },
              {
                step: '04',
                title: 'Reliable Supply Delivery',
                desc: 'Prompt distribution to local markets, lodges, and commercial buyers with strict cold-chain care.'
              }
            ].map((st, idx) => (
              <div key={idx} className="bg-slate-800/80 border border-slate-700 p-8 relative">
                <span className="text-3xl font-serif font-bold text-emerald-400 block mb-4">{st.step}</span>
                <h3 className="text-lg font-serif font-bold text-white mb-2">{st.title}</h3>
                <p className="text-xs text-slate-300 font-light leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. GALLERY / PHOTO SECTION */}
      {horticultureGallery.length > 0 && (
        <section className="py-24 max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-emerald-700 block mb-2">Visual Showcase</span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 mb-4">
              Horticulture Gallery
            </h2>
            <p className="text-slate-600 text-sm font-light">
              Real imagery capturing our greenhouses, crop fields, and harvest operations in Gweta.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {horticultureGallery.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 overflow-hidden group shadow-xs">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <span className="absolute top-3 left-3 bg-slate-900/90 text-white text-[9px] uppercase tracking-widest font-bold px-2.5 py-1">
                    {item.category}
                  </span>
                </div>
                <div className="p-6">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block mb-1">{item.date}</span>
                  <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. ENQUIRY CTA & WHATSAPP CTA */}
      <section className="bg-emerald-900 text-white py-24">
        <div className="max-w-5xl mx-auto px-6 sm:px-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950 border border-emerald-700 text-emerald-300 text-[10px] uppercase tracking-[0.2em] font-bold mb-6 rounded-full">
            <span>Direct Commercial Supply</span>
          </div>

          <h2 className="text-3xl sm:text-6xl font-serif font-bold mb-6">
            Ready to Order Fresh Produce?
          </h2>

          <p className="text-slate-200 text-base sm:text-lg font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Whether you represent a local market, safari lodge, restaurant, or bulk vendor in Botswana, we provide reliable supply schedules and top-tier farm produce.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                setSelectedProductForEnquiry('');
                setEnquiryModalOpen(true);
              }}
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold uppercase tracking-widest transition-colors shadow-lg flex items-center justify-center gap-3"
            >
              <Phone className="w-4 h-4 text-emerald-700" />
              <span>Submit Enquiry Form</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-widest transition-colors shadow-lg flex items-center justify-center gap-3"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>WhatsApp Direct Chat</span>
            </a>
          </div>
        </div>
      </section>

      {/* PRODUCT DETAILS MODAL */}
      {activeProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 overflow-y-auto">
          <div className="max-w-2xl w-full bg-white text-slate-900 border border-slate-300 p-8 sm:p-10 shadow-2xl my-8 relative">
            <button
              onClick={() => setActiveProductModal(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                {activeProductModal.category}
              </span>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-[10px] font-bold uppercase tracking-wider">
                {activeProductModal.availability}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-3">
              {activeProductModal.name}
            </h3>

            <p className="text-slate-700 text-sm font-light leading-relaxed mb-6">
              {activeProductModal.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#FAFBF6] p-6 border border-slate-200 mb-6 text-xs">
              <div>
                <span className="font-bold uppercase tracking-wider text-slate-500 block mb-1">Available Pack Sizes</span>
                <ul className="space-y-1 text-slate-800">
                  {activeProductModal.packSizes.map((sz, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-700 rounded-full" />
                      <span>{sz}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold uppercase tracking-wider text-slate-500 block mb-1">Harvest Season</span>
                <p className="text-slate-800 font-medium mb-3">{activeProductModal.harvestSeason}</p>

                <span className="font-bold uppercase tracking-wider text-slate-500 block mb-1">Growing Method</span>
                <p className="text-slate-800">{activeProductModal.growingMethod}</p>
              </div>
            </div>

            <div className="space-y-2 mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Nutritional Highlights</span>
              <div className="flex flex-wrap gap-2">
                {activeProductModal.nutritionalHighlights.map((hl, i) => (
                  <span key={i} className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium">
                    ✓ {hl}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
              <button
                onClick={() => setActiveProductModal(null)}
                className="px-6 py-3 bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-widest hover:bg-slate-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const name = activeProductModal.name;
                  setActiveProductModal(null);
                  setSelectedProductForEnquiry(name);
                  setEnquiryModalOpen(true);
                }}
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-widest shadow-xs"
              >
                Enquire For This Produce
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ENQUIRY MODAL */}
      {enquiryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 overflow-y-auto">
          <div className="max-w-xl w-full bg-white text-slate-900 border border-slate-300 p-8 sm:p-10 shadow-2xl my-8 relative">
            <button
              onClick={() => setEnquiryModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">
              Horticulture Produce Enquiry
            </h3>
            <p className="text-xs text-slate-600 mb-6 font-light">
              {selectedProductForEnquiry ? `Enquiring about: ${selectedProductForEnquiry}` : 'Submit your requirements and our team will contact you promptly.'}
            </p>

            {enquirySubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-700 mx-auto" />
                <h4 className="text-base font-bold">Enquiry Sent Successfully!</h4>
                <p className="text-xs text-slate-700">Gabolekwe Farms team will review your request and get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={enquiryName}
                    onChange={e => setEnquiryName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={enquiryPhone}
                      onChange={e => setEnquiryPhone(e.target.value)}
                      placeholder="+267 ..."
                      className="w-full bg-slate-50 border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={enquiryEmail}
                      onChange={e => setEnquiryEmail(e.target.value)}
                      placeholder="example@gmail.com"
                      className="w-full bg-slate-50 border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">Requirements & Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={enquiryMessage}
                    onChange={e => setEnquiryMessage(e.target.value)}
                    placeholder="Specify quantities, pack sizes, or delivery location in Botswana..."
                    className="w-full bg-slate-50 border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEnquiryModalOpen(false)}
                    className="px-6 py-3 bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-widest hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-widest shadow-xs"
                  >
                    Send Enquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
