import React from 'react';
import { Sprout, Beef, Droplets, Cpu, CheckCircle, ArrowRight } from 'lucide-react';
import { useCMS } from '../lib/cmsStore';

interface ServicesSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onNavigate }) => {
  const { services } = useCMS();

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sprout': return <Sprout className="w-6 h-6 text-emerald-700" />;
      case 'Beef': return <Beef className="w-6 h-6 text-emerald-700" />;
      case 'Droplets': return <Droplets className="w-6 h-6 text-emerald-700" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-emerald-700" />;
      default: return <Sprout className="w-6 h-6 text-emerald-700" />;
    }
  };

  return (
    <div className="bg-[#FAFBF6] text-slate-800 py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] uppercase tracking-widest font-bold mb-6 rounded-full">
            <span>Comprehensive Solutions</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold font-serif text-slate-900 mb-6">
            Our Core Services
          </h1>
          <p className="text-slate-600 text-xl font-light leading-relaxed">
            Delivering excellence across crop cultivation, livestock breeding, advanced irrigation engineering, and digital farm management.
          </p>
        </div>

        {/* Services Detailed List */}
        <div className="space-y-16">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center bg-white border border-slate-200 p-10 sm:p-16 shadow-sm ${
                index % 2 === 1 ? 'lg:grid-flow-dense' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-6">
                  {getServiceIcon(service.iconName)}
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 mb-4 font-bold">
                  {service.title}
                </h2>
                <p className="text-slate-700 font-light leading-relaxed mb-6 text-base">
                  {service.fullDesc || service.shortDesc}
                </p>

                <div className="space-y-3 mb-8">
                  {service.benefits?.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
                      <span className="text-sm text-slate-700 font-light">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-700 font-bold block mb-1">Key Highlight</span>
                    <span className="text-xs text-slate-800 font-medium">{service.keyFeature}</span>
                  </div>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 shadow-xs"
                  >
                    <span>Inquire Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                <div className="aspect-[4/3] overflow-hidden border border-slate-200 shadow-sm">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover hover:scale-102 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
