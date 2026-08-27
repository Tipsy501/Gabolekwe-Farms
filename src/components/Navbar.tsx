import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useCMS } from '../lib/cmsStore';
import { FarmLogo } from './FarmLogo';

interface NavbarProps {
  currentSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentSection, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { siteConfig } = useCMS();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'horticulture', label: 'Horticulture' },
    { id: 'beef', label: 'Beef' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'news', label: 'News' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-4 border-b border-slate-200'
          : 'bg-white/90 backdrop-blur-sm py-6 border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <FarmLogo />
            <div className="flex flex-col">
              <span className="text-2xl font-serif tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors font-bold">
                {siteConfig.siteName || 'Gabolekwe Farms'}
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-emerald-700 mt-[-2px]">
                Botswana Agriculture
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-bold text-slate-700">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`transition-colors pb-1 ${
                  currentSection === link.id
                    ? 'border-b-2 border-emerald-700 text-emerald-800'
                    : 'text-slate-600 hover:text-emerald-700'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => onNavigate('contact')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 text-xs uppercase tracking-widest font-bold transition-colors shadow-xs"
            >
              Get in Touch
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-800 p-2 border border-slate-200 bg-slate-50 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-xl px-6 py-8 transition-all">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 text-xs uppercase tracking-[0.2em] font-bold transition-colors ${
                  currentSection === link.id
                    ? 'text-emerald-700 border-l-2 border-emerald-700 pl-3'
                    : 'text-slate-700 hover:text-emerald-700'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-6 mt-4 border-t border-slate-200 flex flex-col gap-4">
              <button
                onClick={() => {
                  onNavigate('contact');
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-emerald-700 text-white py-3 text-xs uppercase tracking-widest font-bold text-center hover:bg-emerald-800 transition-colors shadow-xs"
              >
                Get in Touch
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
