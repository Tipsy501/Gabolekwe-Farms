import React from 'react';
import { Sprout, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import { useCMS } from '../lib/cmsStore';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { siteConfig } = useCMS();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              {siteConfig.logoUrl ? (
                <img src={siteConfig.logoUrl} alt="Gabolekwe Farms Logo" className="w-10 h-10 object-contain" />
              ) : (
                <div className="w-10 h-10 bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Sprout className="w-5 h-5" />
                </div>
              )}
              <div>
                <span className="block text-lg font-serif text-white tracking-wide font-bold">
                  Gabolekwe Farms
                </span>
                <span className="block text-[10px] text-emerald-400 tracking-[0.2em] uppercase font-bold">
                  Botswana Agriculture
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-light">
              Growing quality, building agriculture. Supplying premium horticulture, world-class Botswana beef, advanced irrigation solutions, and smart farm technology.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[10px] uppercase tracking-[0.2em] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Botswana Agricultural Certified</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-6">Navigation</h4>
            <ul className="space-y-3 text-sm font-light">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-emerald-400 transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-emerald-400 transition-colors">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('beef')} className="hover:text-emerald-400 transition-colors">
                  Beef Products
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-6">Divisions</h4>
            <ul className="space-y-3 text-sm font-light">
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-emerald-400 transition-colors">
                  Horticulture
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('beef')} className="hover:text-emerald-400 transition-colors">
                  Beef Sales
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-emerald-400 transition-colors">
                  Irrigation Systems
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-emerald-400 transition-colors">
                  AgTech Software
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-6">Contact Us</h4>
            <ul className="space-y-3 text-sm text-slate-400 font-light">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{siteConfig.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{siteConfig.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{siteConfig.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 uppercase tracking-widest font-semibold gap-4">
          <p>© {new Date().getFullYear()} Gabolekwe Farms (Pty) Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <button
              onClick={() => {
                window.location.hash = 'admin';
              }}
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors font-bold normal-case tracking-wider"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Access</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
