import React, { useState } from 'react';
import { useCMS } from '../lib/cmsStore';
import { BeefProductGrade } from '../types';
import { 
  Beef, ShieldCheck, Award, CheckCircle, ArrowRight, MessageSquare, 
  Phone, Search, Package, Calendar, Info, X, Check, Sun, Droplets
} from 'lucide-react';

interface BeefProductsSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const BeefProductsSection: React.FC<BeefProductsSectionProps> = ({ onNavigate }) => {
  const { beefProducts, beefPageConfig, gallery, submitEnquiry } = useCMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<BeefProductGrade | null>(null);

  // Enquiry modal state
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedProductForEnquiry, setSelectedProductForEnquiry] = useState('');
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryEmail, setEnquiryEmail] = useState('');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

  const filteredBeef = beefProducts.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const livestockGallery = gallery.filter(g => g.category === 'Livestock' || g.title.toLowerCase().includes('cattle') || g.title.toLowerCase().includes('beef') || g.title.toLowerCase().includes('herd'));

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitEnquiry({
      name: enquiryName,
      phone: enquiryPhone,
      email: enquiryEmail,
      subject: `Beef & Livestock Wholesale Enquiry${selectedProductForEnquiry ? ` - ${selectedProductForEnquiry}` : ''}`,
      service: 'Beef Products',
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

  const whatsappNum = (beefPageConfig.whatsappNumber || '').replace(/[^0-9]/g, '') || '26774061099';
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=Hello%20Gabolekwe%20Farms,%20I%20would%20like%20to%20enquire%20about%20your%20premium%20beef%20products%20and%20wholesale%20availability.`;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return ShieldCheck;
      case 'Award': return Award;
      case 'Beef': return Beef;
      case 'Sun': return Sun;
      case 'Droplets': return Droplets;
      case 'Package': return Package;
      default: return ShieldCheck;
    }
  };

  return (
    <div className="bg-[#FAFBF6] text-slate-900 min-h-screen pt-24">
      
      {/* 1. FULL-SCREEN VISUAL HERO */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-slate-900 overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          <img
            src={beefPageConfig.heroImage || "https://images.unsplash.com/photo-1545936856-d713c23945a8?auto=format&fit=crop&w=2000&q=80"}
            alt="Gabolekwe Farms Beef Production"
            className="w-full h-full object-cover opacity-45 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C0A] via-slate-950/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs uppercase tracking-[0.25em] font-bold mb-6 rounded-full backdrop-blur-sm">
            <Beef className="w-4 h-4 text-emerald-400" />
            <span>{beefPageConfig.badgeText || 'Gweta, Botswana • Export Quality Standards'}</span>
          </div>

          <h1 className="text-4xl sm:text-7xl lg:text-8xl font-serif font-bold tracking-tight mb-6 max-w-5xl mx-auto text-white">
            {beefPageConfig.heroTitle}
          </h1>

          <p className="text-lg sm:text-2xl text-slate-200 font-light max-w-3xl mx-auto leading-relaxed mb-10">
            {beefPageConfig.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('beef-showcase');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-widest transition-colors shadow-lg flex items-center justify-center gap-3"
            >
              <span>{beefPageConfig.heroCta || 'Explore Beef Products'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-widest transition-colors shadow-lg flex items-center justify-center gap-3"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>{beefPageConfig.whatsappCtaText || 'WhatsApp Wholesale Chat'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. BEEF PRODUCTS INTRODUCTION */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] uppercase tracking-widest font-bold">
              <span>{beefPageConfig.introEyebrow}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 leading-tight">
              {beefPageConfig.introHeading}
            </h2>
            <p className="text-slate-700 text-base sm:text-lg font-light leading-relaxed">
              {beefPageConfig.introParagraph1}
            </p>
            <p className="text-slate-600 text-sm font-light leading-relaxed">
              {beefPageConfig.introParagraph2}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {beefPageConfig.featureBlocks?.map((block) => {
                const IconComponent = getIcon(block.icon);
                return (
                  <div key={block.id} className="bg-white p-6 border border-slate-200 shadow-xs">
                    <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-3">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-serif font-bold text-slate-900 mb-1">{block.title}</h3>
                    <p className="text-xs text-slate-600 font-light">{block.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] bg-slate-200 border border-slate-300 shadow-md overflow-hidden">
              <img
                src={beefPageConfig.introImage || "https://images.unsplash.com/photo-1545936856-d713c23945a8?auto=format&fit=crop&w=1200&q=80"}
                alt="Cattle grazing at Gabolekwe Farms"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-slate-900 text-white p-6 border border-emerald-500/35 max-w-xs shadow-xl hidden sm:block">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Traceable Herd</span>
              </div>
              <p className="text-xs text-slate-300 font-light">
                Full lifecycle tracking from Savannah pasture to wholesale delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT SHOWCASE */}
      <section id="beef-showcase" className="bg-white py-24 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-emerald-700 block mb-2">Fresh & Wholesome</span>
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900">
                Beef Products & Cuts
              </h2>
              <p className="text-slate-600 text-sm font-light mt-1">
                Explore our selection of premium cuts, steaks, and wholesale packs available from Gabolekwe Farms.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search beef cuts, products..."
                className="w-full bg-[#FAFBF6] border border-slate-300 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-700"
              />
            </div>
          </div>

          {filteredBeef.length === 0 ? (
            <div className="text-center py-20 bg-[#FAFBF6] border border-slate-200 p-8">
              <Beef className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-serif text-slate-800">No Beef Products Found</h3>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBeef.map((prod) => (
                <div key={prod.code} className="bg-[#FAFBF6] border border-slate-200 overflow-hidden flex flex-col shadow-xs hover:border-emerald-700 transition-all">
                  <div className="aspect-[16/10] relative overflow-hidden bg-slate-100">
                    <img 
                      src={prod.image || 'https://images.unsplash.com/photo-1545936856-d713c23945a8?auto=format&fit=crop&w=1000&q=80'} 
                      alt={prod.name} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                    <span className="absolute top-3 left-3 bg-emerald-900 text-white text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 border border-emerald-500/40">
                      {prod.code}
                    </span>
                    <span className={`absolute top-3 right-3 text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 border ${
                      prod.availability === 'In Stock'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : prod.availability === 'Available on Order'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}>
                      {prod.availability || 'In Stock'}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div className="space-y-3">
                      <h3 className="text-xl font-serif font-bold text-slate-900">{prod.name}</h3>
                      <p className="text-xs text-slate-600 font-light leading-relaxed">{prod.description}</p>
                      
                      <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs text-slate-700">
                        {prod.idealFor && (
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-medium">Ideal For:</span>
                            <span className="font-semibold text-slate-900 text-right">{prod.idealFor}</span>
                          </div>
                        )}
                        {prod.marbling && (
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-medium">Texture / Quality:</span>
                            <span className="text-emerald-700 font-bold">{prod.marbling}</span>
                          </div>
                        )}
                        {prod.packSizes && prod.packSizes.length > 0 && (
                          <div className="flex items-center gap-1.5 pt-1 text-slate-600">
                            <Package className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <span className="truncate">{prod.packSizes.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 mt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setSelectedGrade(prod)}
                        className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-[11px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5"
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
                        Enquire
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. GALLERY SECTION */}
      {livestockGallery.length > 0 && (
        <section className="bg-white py-24 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 sm:px-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-emerald-700 block mb-2">Visual Archive</span>
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 mb-4">
                Livestock & Herd Gallery
              </h2>
              <p className="text-slate-600 text-sm font-light">
                Real photos capturing our cattle operations and grazing management in Gweta.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {livestockGallery.map((item) => (
                <div key={item.id} className="bg-[#FAFBF6] border border-slate-200 overflow-hidden group shadow-xs">
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
          </div>
        </section>
      )}

      {/* 6. WHOLESALE / COMMERCIAL ENQUIRY & WHATSAPP CTA */}
      <section className="bg-slate-900 text-white py-24">
        <div className="max-w-5xl mx-auto px-6 sm:px-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 border border-emerald-500/40 text-emerald-400 text-[10px] uppercase tracking-[0.2em] font-bold mb-6 rounded-full">
            <span>Wholesale & Commercial Distribution</span>
          </div>

          <h2 className="text-3xl sm:text-6xl font-serif font-bold mb-6">
            {beefPageConfig.wholesaleHeading}
          </h2>

          <p className="text-slate-300 text-base sm:text-lg font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            {beefPageConfig.wholesaleDescription}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                setSelectedProductForEnquiry('');
                setEnquiryModalOpen(true);
              }}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-widest transition-colors shadow-lg flex items-center justify-center gap-3"
            >
              <Phone className="w-4 h-4 text-white" />
              <span>{beefPageConfig.wholesaleCtaText}</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-widest transition-colors shadow-lg flex items-center justify-center gap-3"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>{beefPageConfig.wholesaleWhatsappText}</span>
            </a>
          </div>
        </div>
      </section>

      {/* GRADE DETAILS MODAL */}
      {selectedGrade && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 overflow-y-auto">
          <div className="max-w-xl w-full bg-white text-slate-900 border border-slate-300 p-8 sm:p-10 shadow-2xl my-8 relative">
            <button
              onClick={() => setSelectedGrade(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 bg-emerald-900 text-white text-[10px] font-bold uppercase tracking-wider">
                Code: {selectedGrade.code}
              </span>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                {selectedGrade.availability || 'In Stock'}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-3">
              {selectedGrade.name}
            </h3>

            <p className="text-slate-700 text-sm font-light leading-relaxed mb-6">
              {selectedGrade.description}
            </p>

            <div className="space-y-4 bg-[#FAFBF6] p-6 border border-slate-200 mb-6 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="font-bold uppercase tracking-wider text-slate-500">Ideal For:</span>
                <span className="text-slate-900 font-semibold">{selectedGrade.idealFor}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="font-bold uppercase tracking-wider text-slate-500">Texture / Quality:</span>
                <span className="text-emerald-700 font-bold">{selectedGrade.marbling}</span>
              </div>
              {selectedGrade.pricing && (
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span className="font-bold uppercase tracking-wider text-slate-500">Pricing / Terms:</span>
                  <span className="text-slate-900 font-medium">{selectedGrade.pricing}</span>
                </div>
              )}
              {selectedGrade.packSizes && selectedGrade.packSizes.length > 0 && (
                <div className="py-1">
                  <span className="font-bold uppercase tracking-wider text-slate-500 block mb-1">Pack Sizes:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedGrade.packSizes.map((sz, i) => (
                      <span key={i} className="px-2.5 py-1 bg-white border border-slate-300 text-slate-800 text-[11px]">
                        {sz}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
              <button
                onClick={() => setSelectedGrade(null)}
                className="px-6 py-3 bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-widest hover:bg-slate-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const name = selectedGrade.name;
                  setSelectedGrade(null);
                  setSelectedProductForEnquiry(name);
                  setEnquiryModalOpen(true);
                }}
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-widest shadow-xs"
              >
                Enquire For This Cut
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
              Wholesale Beef & Livestock Enquiry
            </h3>
            <p className="text-xs text-slate-600 mb-6 font-light">
              {selectedProductForEnquiry ? `Enquiring about product: ${selectedProductForEnquiry}` : 'Submit your wholesale requirements for prompt quotation.'}
            </p>

            {enquirySubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-2">
                <Check className="w-10 h-10 text-emerald-700 mx-auto" />
                <h4 className="text-base font-bold">Enquiry Sent Successfully!</h4>
                <p className="text-xs text-slate-700">Gabolekwe Farms wholesale team will review your requirements and respond shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">Your Full Name / Business Name *</label>
                  <input
                    type="text"
                    required
                    value={enquiryName}
                    onChange={e => setEnquiryName(e.target.value)}
                    placeholder="Kwena Butchery / John Smith"
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
                    <label className="block text-[10px] uppercase tracking-widest text-slate-600 mb-1">Email Address *</label>
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
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">Requirements & Quantities *</label>
                  <textarea
                    required
                    rows={4}
                    value={enquiryMessage}
                    onChange={e => setEnquiryMessage(e.target.value)}
                    placeholder="Specify cuts, tonnage, pack sizes, or delivery location in Botswana..."
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
