import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { useCMS } from '../lib/cmsStore';

interface HeroSlideshowProps {
  onNavigate: (sectionId: string) => void;
}

export const HeroSlideshow: React.FC<HeroSlideshowProps> = ({ onNavigate }) => {
  const { slides } = useCMS();
  const activeSlides = slides.filter(s => s.status !== 'Draft');
  const displaySlides = activeSlides.length > 0 ? activeSlides : slides;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || displaySlides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displaySlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying, displaySlides.length]);

  if (!displaySlides || displaySlides.length === 0) return null;

  const currentSlide = displaySlides[currentIndex % displaySlides.length];
  const nextSlide = displaySlides[(currentIndex + 1) % displaySlides.length];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displaySlides.length);
  };

  return (
    <section className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-slate-900 text-white">
      {/* Background with crossfade */}
      {displaySlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ transitionProperty: 'opacity, transform', transitionDuration: '1200ms' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/50 to-slate-950/30 z-10" />
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center opacity-90 z-0"
            referrerPolicy="no-referrer"
          />
        </div>
      ))}

      {/* Vertical Foundation Indicator (Left) */}
      <div className="absolute left-12 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-12">
        <div className="w-[1px] h-32 bg-white/30 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 w-full bg-emerald-400 transition-all duration-500" 
            style={{ height: `${((currentIndex + 1) / slides.length) * 100}%` }}
          />
        </div>
        <span className="text-[10px] uppercase tracking-[0.5em] opacity-60 font-bold [writing-mode:vertical-rl] rotate-180 text-white">
          The Foundation
        </span>
      </div>

      {/* Main Content Container */}
      <div className="relative z-25 max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 w-full pt-24">
        <div className="max-w-3xl">
          <span className="text-emerald-400 font-serif italic text-xl sm:text-2xl mb-4 block font-medium">
            0{currentIndex + 1} &mdash; {currentSlide.badge || 'Heritage in Growth'}
          </span>
          <h1 className="text-5xl sm:text-7xl font-serif leading-[1.05] mb-4 tracking-tight text-white font-bold">
            {currentSlide.title}
          </h1>
          {currentSlide.subtitle && (
            <p className="text-emerald-300 text-lg sm:text-2xl font-serif italic mb-6">
              {currentSlide.subtitle}
            </p>
          )}
          <p className="text-base sm:text-lg font-light leading-relaxed opacity-90 max-w-lg mb-10 text-slate-200">
            {currentSlide.description}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate(currentSlide.ctaLink || 'services')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 text-xs uppercase tracking-widest font-bold transition-colors shadow-lg"
            >
              {currentSlide.ctaText || 'Explore Services'}
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="border border-white/40 hover:bg-white/10 px-10 py-4 text-xs uppercase tracking-widest font-bold transition-colors text-white"
            >
              Partner with Us
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Left: Slide Numbers */}
      <div className="absolute bottom-12 left-6 sm:left-12 lg:left-24 z-30 hidden sm:flex gap-8">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIndex(index)}
            className={`flex flex-col gap-1 text-left transition-opacity ${
              index === currentIndex ? 'opacity-100' : 'opacity-40 hover:opacity-80'
            }`}
          >
            <span className="text-3xl sm:text-[40px] font-serif leading-none text-white font-bold">
              0{index + 1}
            </span>
            <div className={`w-12 h-[2px] transition-colors ${index === currentIndex ? 'bg-emerald-400' : 'bg-white/50'}`} />
          </button>
        ))}
      </div>

      {/* Bottom Right: Next Slide Preview & Controls */}
      <div className="absolute bottom-12 right-6 sm:right-12 z-30 flex items-end gap-12">
        <div className="hidden md:flex flex-col gap-2 text-right">
          <span className="text-[10px] uppercase tracking-widest font-bold opacity-60 text-white">Next Slide</span>
          <span className="text-xl font-serif italic text-emerald-300">{nextSlide?.title}</span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors text-white bg-slate-900/40"
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={handlePrev}
            className="w-12 h-12 border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors text-white bg-slate-900/40"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-12 h-12 border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors text-white bg-slate-900/40"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
