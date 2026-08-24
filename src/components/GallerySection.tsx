import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { X, Calendar, Tag } from 'lucide-react';
import { useCMS } from '../lib/cmsStore';

export const GallerySection: React.FC = () => {
  const { gallery } = useCMS();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Horticulture', 'Livestock', 'Technology', 'Farm'];

  const filteredItems = activeCategory === 'All'
    ? gallery
    : gallery.filter(item => item.category === activeCategory);

  return (
    <div className="bg-[#FAFBF6] text-slate-800 py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] uppercase tracking-widest font-bold mb-6 rounded-full">
            <span>Visual Showcase</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold font-serif text-slate-900 mb-6">
            Farm Gallery
          </h1>
          <p className="text-slate-600 text-xl font-light leading-relaxed">
            Explore glimpses of our greenhouse harvests, pristine livestock, advanced irrigation systems, and smart farm technology in Botswana.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 text-xs uppercase tracking-widest font-bold transition-all ${
                activeCategory === category
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group relative aspect-[4/3] bg-white border border-slate-200 overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 text-[10px] text-emerald-300 uppercase tracking-[0.2em] font-bold mb-2">
                  <Tag className="w-3 h-3" />
                  <span>{item.category}</span>
                </div>
                <h3 className="text-xl font-serif text-white group-hover:text-emerald-300 transition-colors font-bold">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6">
            <div className="relative max-w-4xl w-full bg-white border border-slate-200 p-6 sm:p-10 shadow-2xl">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="aspect-[4/3] overflow-hidden border border-slate-200">
                  <img
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] uppercase tracking-[0.2em] font-bold">
                    <span>{selectedImage.category}</span>
                  </div>
                  <h3 className="text-3xl font-serif text-slate-900 font-bold">{selectedImage.title}</h3>
                  <p className="text-slate-600 text-sm font-light leading-relaxed">
                    {selectedImage.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-4 border-t border-slate-200">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <span>Captured: {selectedImage.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
