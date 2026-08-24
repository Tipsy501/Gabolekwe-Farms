import React from 'react';
import { useCMS } from '../lib/cmsStore';
import { Sprout, Beef, Droplets, Cpu, ArrowRight, ShieldCheck, Award, MapPin, Phone, MessageSquare, Mail } from 'lucide-react';

interface HomeSectionProps {
  onNavigate: (sectionId: string) => void;
  onSelectNews: (articleId: string) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ onNavigate }) => {
  const { siteConfig, services, beefProducts, gallery, horticultureProducts } = useCMS();

  const horticultureList = (horticultureProducts && horticultureProducts.length > 0)
    ? horticultureProducts.map(p => p.name)
    : ['Cabbage', 'Tomatoes', 'Spinach', 'Rape', 'Chomolia', 'Green Pepper'];

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sprout': return <Sprout className="w-7 h-7 text-emerald-700" />;
      case 'Beef': return <Beef className="w-7 h-7 text-emerald-700" />;
      case 'Droplets': return <Droplets className="w-7 h-7 text-emerald-700" />;
      case 'Cpu': return <Cpu className="w-7 h-7 text-emerald-700" />;
      default: return <Sprout className="w-7 h-7 text-emerald-700" />;
    }
  };

  return (
    <div className="bg-[#FAFBF6] text-slate-800">
      
      {/* 1. Who We Are */}
      <section className="py-28 max-w-7xl mx-auto px-6 sm:px-12 border-b border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] uppercase tracking-widest font-bold mb-6 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>{siteConfig.address || 'Gweta, Botswana'}</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-bold font-serif text-slate-900 mb-8 leading-[1.05]">
              {siteConfig.aboutTitle || 'Who We Are: Cultivating Botswana Agriculture'}
            </h2>
            <p className="text-slate-700 text-lg sm:text-xl font-light mb-8 leading-relaxed">
              {siteConfig.aboutSubtitle || 'Gabolekwe Farms is a proud Botswana agricultural enterprise dedicated to sustainable livestock production, animal feed, and fresh horticultural produce.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold rounded-full">✓</div>
                <span className="text-slate-800 text-sm font-medium">Sustainable Cattle & Goat Production</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold rounded-full">✓</div>
                <span className="text-slate-800 text-sm font-medium">Fresh Vegetables & Horticulture</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold rounded-full">✓</div>
                <span className="text-slate-800 text-sm font-medium">Irrigation System Design & Water Management</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold rounded-full">✓</div>
                <span className="text-slate-800 text-sm font-medium">Farm Management Software Solutions</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('about')}
              className="inline-flex items-center gap-3 bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-4 text-xs uppercase tracking-widest font-bold transition-all group shadow-sm"
            >
              <span>Read Full About Story</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-white" />
            </button>
          </div>
          <div className="relative">
            <div className="aspect-square overflow-hidden border border-slate-200 shadow-lg bg-white p-2">
              <img
                src={siteConfig.aboutImage || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80"}
                alt="Gabolekwe Farms Operations"
                className="w-full h-full object-cover shadow-sm hover:scale-102 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white border border-slate-200 p-8 max-w-xs hidden sm:block shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-6 h-6 text-emerald-700" />
                <span className="font-serif italic text-xl text-slate-900 font-bold">Proudly Local</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Supplying local markets, vendors, and lodges in Gweta, Maun, and surrounding areas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. What We Do (Four Service Cards) */}
      <section className="py-28 max-w-7xl mx-auto px-6 sm:px-12 border-b border-slate-200 bg-white">
        <div className="max-w-3xl mb-16">
          <h2 className="text-xs uppercase font-bold tracking-[0.3em] text-emerald-700 mb-3">
            What We Do
          </h2>
          <h3 className="text-4xl sm:text-5xl font-bold font-serif text-slate-900 mb-4">
            Our Core Divisions & Services
          </h3>
          <p className="text-slate-600 text-lg font-light">
            Providing reliable agricultural produce, livestock production, engineering consultation, and farm management technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-[#FAFBF6] border border-slate-200 p-8 hover:border-emerald-600 transition-all group flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div>
                <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-colors">
                  {getServiceIcon(service.iconName)}
                </div>
                <h4 className="text-2xl font-serif text-slate-900 mb-4 font-bold">
                  {service.title}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed mb-8 font-light">
                  {service.shortDesc}
                </p>
              </div>
              <button
                onClick={() => onNavigate('services')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-emerald-700 hover:text-emerald-900 transition-colors pt-4 border-t border-slate-200"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Our Products Preview (Beef & Horticulture) */}
      <section className="py-28 max-w-7xl mx-auto px-6 sm:px-12 border-b border-slate-200">
        <div className="max-w-3xl mb-16">
          <h2 className="text-xs uppercase font-bold tracking-[0.3em] text-emerald-700 mb-3">
            Our Products
          </h2>
          <h3 className="text-4xl sm:text-5xl font-bold font-serif text-slate-900 mb-4">
            Fresh Produce & Quality Livestock
          </h3>
          <p className="text-slate-600 text-lg font-light">
            Harvested at peak freshness and raised under rigorous veterinary standards.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Horticulture Preview */}
          <div className="bg-white border border-slate-200 p-10 flex flex-col justify-between shadow-xs">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] uppercase tracking-widest font-bold mb-6 rounded-full">
                <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                <span>Horticultural Harvest</span>
              </div>
              <h4 className="text-3xl font-serif text-slate-900 mb-4 font-bold">Fresh Vegetables & Crops</h4>
              <p className="text-sm text-slate-600 font-light leading-relaxed mb-6">
                We cultivate and supply fresh, wholesome vegetables tailored for local markets, vendors, and lodges:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {horticultureList.map((veg, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs text-slate-800 font-semibold text-center">
                    {veg}
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => onNavigate('services')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              <span>Explore Horticulture Division</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Beef & Livestock Preview */}
          <div className="bg-white border border-slate-200 p-10 flex flex-col justify-between shadow-xs">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] uppercase tracking-widest font-bold mb-6 rounded-full">
                <Beef className="w-3.5 h-3.5 text-emerald-700" />
                <span>Beef & Livestock Sales</span>
              </div>
              <h4 className="text-3xl font-serif text-slate-900 mb-4 font-bold">Cattle, Goats & Animal Feed</h4>
              <p className="text-sm text-slate-600 font-light leading-relaxed mb-6">
                Raising resilient livestock on natural Savannah pastures supported by on-site animal feed cultivation:
              </p>
              <div className="space-y-3 mb-8">
                {beefProducts.slice(0, 2).map((grade, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-3 flex items-center justify-between">
                    <div>
                      <span className="font-serif text-sm text-slate-900 font-bold block">{grade.name}</span>
                      <span className="text-[11px] text-slate-600">{grade.description}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-emerald-100 text-emerald-800">
                      {grade.code}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => onNavigate('beef')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              <span>Explore Beef Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Our Story (Gweta, Botswana) */}
      <section className="py-28 max-w-7xl mx-auto px-6 sm:px-12 border-b border-slate-200 bg-white">
        <div className="bg-gradient-to-br from-emerald-50 via-white to-sky-50 border border-slate-200 p-10 sm:p-16 shadow-sm">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-900 text-[11px] uppercase tracking-widest font-bold mb-6 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Gweta, Botswana</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold font-serif text-slate-900 mb-6">
              Our Story in Gweta
            </h2>
            <p className="text-slate-700 text-lg font-light leading-relaxed mb-8">
              {siteConfig.aboutHistory || 'Based in Gweta, Botswana, Gabolekwe Farms is a commercial agricultural enterprise engaged in cattle and goat production, animal feed cultivation, and diverse horticulture, proudly supplying local markets, vendors, and lodges in Gweta, Maun, and surrounding areas.'}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('about')}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors shadow-xs"
              >
                Read Mission & Vision
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="border border-slate-300 hover:bg-slate-100 text-slate-800 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Get in Touch
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Gabolekwe Farms */}
      <section className="py-28 max-w-7xl mx-auto px-6 sm:px-12 border-b border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-bold tracking-[0.3em] text-emerald-700 mb-3">
            Why Choose Us
          </h2>
          <h3 className="text-4xl sm:text-5xl font-bold font-serif text-slate-900 mb-4">
            Quality, Reliability & Local Dedication
          </h3>
          <p className="text-slate-600 text-lg font-light">
            Built on core agricultural values, sustainable practices, and dependable local supply.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-200 p-8 shadow-xs">
            <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-serif text-slate-900 mb-3 font-bold">Rigorous Standards</h4>
            <p className="text-xs text-slate-600 font-light leading-relaxed">
              Adherence to Botswana veterinary health guidelines and sustainable farming practices for safe, premium produce.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-8 shadow-xs">
            <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-6">
              <MapPin className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-serif text-slate-900 mb-3 font-bold">Proudly Local Supply</h4>
            <p className="text-xs text-slate-600 font-light leading-relaxed">
              Reliable delivery and fresh supply partnerships with local markets, vendors, and lodges across Gweta and Maun.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-8 shadow-xs">
            <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-6">
              <Cpu className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-serif text-slate-900 mb-3 font-bold">Agricultural Innovation</h4>
            <p className="text-xs text-slate-600 font-light leading-relaxed">
              Integrating modern water-wise irrigation and custom farm management software solutions to optimize agricultural efficiency.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Gallery Preview (from CMS Media Library) */}
      <section className="py-28 max-w-7xl mx-auto px-6 sm:px-12 border-b border-slate-200 bg-white">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <h2 className="text-xs uppercase font-bold tracking-[0.3em] text-emerald-700 mb-3">
              Visual Showcase
            </h2>
            <h3 className="text-4xl font-bold font-serif text-slate-900">
              Gallery Preview
            </h3>
          </div>
          <button
            onClick={() => onNavigate('gallery')}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gallery.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate('gallery')}
              className="aspect-square overflow-hidden border border-slate-200 cursor-pointer group relative shadow-xs"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <span className="text-[10px] text-emerald-300 uppercase tracking-wider block font-bold">{item.category}</span>
                <span className="text-xs text-white font-serif font-bold">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Contact CTA */}
      <section className="py-32 max-w-7xl mx-auto px-6 sm:px-12 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] uppercase tracking-widest font-bold rounded-full">
            <Mail className="w-3.5 h-3.5 text-emerald-700" />
            <span>Connect With Our Team</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-serif text-slate-900 font-bold">
            Ready to Order Produce or Partner With Us?
          </h2>
          <p className="text-slate-600 text-lg font-light leading-relaxed">
            Reach out via phone, WhatsApp, email, or our secure online enquiry system. We look forward to working with you.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href={`tel:${siteConfig.phone ? siteConfig.phone.replace(/[^0-9+]/g, '') : '+26772820542'}`}
              className="px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Call {siteConfig.phone || '+267 72 820 542'}</span>
            </a>
            <a
              href={`https://wa.me/${siteConfig.whatsapp ? siteConfig.whatsapp.replace(/[^0-9]/g, '') : '26772820542'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              <span>WhatsApp</span>
            </a>
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-slate-600" />
              <span>Open Contact Form</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
