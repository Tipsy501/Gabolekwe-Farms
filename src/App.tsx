import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSlideshow } from './components/HeroSlideshow';
import { HomeSection } from './components/HomeSection';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { HorticultureSection } from './components/HorticultureSection';
import { BeefProductsSection } from './components/BeefProductsSection';
import { GallerySection } from './components/GallerySection';
import { NewsSection } from './components/NewsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CMSProvider, useCMS } from './lib/cmsStore';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { WhatsAppButton } from './components/WhatsAppButton';
import { SEOHead } from './components/SEOHead';

function MainApp() {
  const [currentSection, setCurrentSection] = useState<string>(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#news') || hash.startsWith('#news/')) return 'news';
    if (hash && hash !== '#admin') return hash.replace('#', '');
    return 'home';
  });
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#news/')) {
      return hash.replace('#news/', '');
    }
    return null;
  });
  const { isAdminLoggedIn } = useCMS();

  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    return window.location.pathname.startsWith('/admin') || window.location.hash === '#admin';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash;
      const isAdmin = window.location.pathname.startsWith('/admin') || hash === '#admin';
      setIsAdminRoute(isAdmin);

      if (hash.startsWith('#news/')) {
        setCurrentSection('news');
        setSelectedNewsId(hash.replace('#news/', ''));
      } else if (hash === '#news') {
        setCurrentSection('news');
        setSelectedNewsId(null);
      } else if (hash && !isAdmin) {
        const section = hash.replace('#', '');
        setCurrentSection(section);
        setSelectedNewsId(null);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleNavigate = (sectionId: string) => {
    setCurrentSection(sectionId);
    setSelectedNewsId(null);
    if (isAdminRoute) {
      window.history.pushState({}, '', `/#${sectionId}`);
      setIsAdminRoute(false);
    } else {
      window.history.pushState({}, '', `/#${sectionId}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectNews = (articleSlugOrId: string) => {
    setSelectedNewsId(articleSlugOrId);
  };

  if (isAdminRoute) {
    if (isAdminLoggedIn) {
      return <AdminDashboard />;
    }
    return (
      <AdminLoginModal
        onExit={() => {
          window.history.pushState({}, '', '/');
          setIsAdminRoute(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0C0A] text-[#F8F9FA] flex flex-col font-sans selection:bg-[#A4C293] selection:text-[#0A0C0A]">
      {/* Dynamic SEO & Social Share Head Manager */}
      <SEOHead currentSection={currentSection} selectedNewsId={selectedNewsId} />

      {/* Sticky Navbar */}
      <Navbar 
        currentSection={currentSection} 
        onNavigate={handleNavigate} 
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentSection === 'home' && (
          <>
            <HeroSlideshow onNavigate={handleNavigate} />
            <HomeSection onNavigate={handleNavigate} onSelectNews={handleSelectNews} />
          </>
        )}

        {currentSection === 'about' && <AboutSection />}

        {currentSection === 'services' && <ServicesSection onNavigate={handleNavigate} />}

        {currentSection === 'horticulture' && <HorticultureSection onNavigate={handleNavigate} />}

        {currentSection === 'beef' && <BeefProductsSection onNavigate={handleNavigate} />}

        {currentSection === 'gallery' && <GallerySection />}

        {currentSection === 'news' && <NewsSection selectedArticleId={selectedNewsId} />}

        {currentSection === 'contact' && <ContactSection />}
      </main>

      {/* Professional Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <CMSProvider>
      <MainApp />
    </CMSProvider>
  );
}
