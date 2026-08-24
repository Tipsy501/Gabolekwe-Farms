import React from 'react';
import { ShieldCheck, Award, MapPin, Target, Eye, HeartHandshake, Sprout, Beef, ArrowRight } from 'lucide-react';
import { useCMS } from '../lib/cmsStore';

interface AboutSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigate }) => {
  const { siteConfig } = useCMS();

  return (
    <div className="bg-[#FAFBF6] text-slate-800 py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] uppercase tracking-widest font-bold mb-6 rounded-full">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>Gweta, Botswana</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold font-serif text-slate-900 mb-6">
            {siteConfig.aboutTitle || 'About Gabolekwe Farms'}
          </h1>
          <p className="text-slate-600 text-xl font-light leading-relaxed">
            {siteConfig.aboutSubtitle || 'A proud Botswana agricultural enterprise dedicated to sustainable livestock production, animal feed, and fresh horticultural produce.'}
          </p>
        </div>

        {/* Our Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-28">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 font-bold">
              Our Story in Gweta, Botswana
            </h2>
            <p className="text-slate-700 font-light leading-relaxed text-lg">
              {siteConfig.aboutHistory || 'Based in Gweta, Botswana, Gabolekwe Farms is a commercial agricultural enterprise engaged in cattle and goat production, animal feed cultivation, and diverse horticulture. We proudly supply fresh vegetables and quality livestock to local markets, vendors, and lodges in Gweta, Maun, and surrounding areas.'}
            </p>
            <p className="text-slate-600 font-light leading-relaxed">
              We combine traditional livestock husbandry with modern agricultural practices and farm management technology to support food security and rural agricultural development in Botswana.
            </p>
            <div className="pt-4">
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-3 bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-4 text-xs uppercase tracking-widest font-bold transition-colors shadow-xs"
              >
                <span>Partner With Us</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square overflow-hidden border border-slate-200 shadow-lg bg-white p-2">
              <img
                src={siteConfig.aboutImage || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80"}
                alt="Gabolekwe Farms Operations"
                className="w-full h-full object-cover shadow-sm"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-28">
          <div className="bg-white border border-slate-200 p-10 relative overflow-hidden shadow-xs">
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-6">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-serif text-slate-900 mb-4 font-bold">Our Vision</h3>
            <p className="text-slate-600 leading-relaxed text-base font-light">
              {siteConfig.aboutVision || 'To be a trusted commercial agricultural enterprise in Botswana, advancing food security, sustainable livestock management, and agricultural innovation.'}
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-10 relative overflow-hidden shadow-xs">
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-serif text-slate-900 mb-4 font-bold">Our Mission</h3>
            <p className="text-slate-600 leading-relaxed text-base font-light">
              {siteConfig.aboutMission || 'To sustainably produce quality beef, livestock, and fresh vegetables while supplying local markets, vendors, and lodges with reliable agricultural produce.'}
            </p>
          </div>
        </div>

        {/* What We Do Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-28">
          <div className="bg-white border border-slate-200 p-8 flex items-start gap-6 shadow-xs">
            <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-2xl font-serif text-slate-900 mb-2 font-bold">Horticultural Excellence</h4>
              <p className="text-sm text-slate-600 font-light leading-relaxed">
                Cultivating cabbage, tomatoes, spinach, rape, chomolia, and green pepper with efficient water management for local markets and lodges.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-8 flex items-start gap-6 shadow-xs">
            <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <Beef className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-2xl font-serif text-slate-900 mb-2 font-bold">Beef & Livestock Production</h4>
              <p className="text-sm text-slate-600 font-light leading-relaxed">
                Raising cattle and goats with proper animal husbandry and supporting on-site animal feed cultivation to meet regional demand.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-white border border-slate-200 p-10 sm:p-16 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold tracking-[0.3em] text-emerald-700 mb-3">
              Guiding Principles
            </h2>
            <h3 className="text-4xl font-serif text-slate-900 font-bold">
              Our Commitment to Responsibility
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#FAFBF6] border border-slate-200">
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-6">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-2xl font-serif text-slate-900 mb-3 font-bold">Quality & Reliability</h4>
              <p className="text-slate-600 text-sm leading-relaxed font-light">
                Committed to consistent produce quality, strict veterinary standards, and dependable supply for our customers.
              </p>
            </div>
            <div className="p-8 bg-[#FAFBF6] border border-slate-200">
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-6">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="text-2xl font-serif text-slate-900 mb-3 font-bold">Community & Local Focus</h4>
              <p className="text-slate-600 text-sm leading-relaxed font-light">
                Proudly based in Gweta, supporting local food security, employment, and regional trade partnerships.
              </p>
            </div>
            <div className="p-8 bg-[#FAFBF6] border border-slate-200">
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-6">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-2xl font-serif text-slate-900 mb-3 font-bold">Agricultural Technology</h4>
              <p className="text-slate-600 text-sm leading-relaxed font-light">
                Developing practical farm management software and irrigation solutions to enhance efficiency and resource management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
