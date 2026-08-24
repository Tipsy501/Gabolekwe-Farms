import React, { useEffect } from 'react';
import { useCMS } from '../lib/cmsStore';

interface SEOHeadProps {
  currentSection: string;
  selectedNewsId?: string | null;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ currentSection, selectedNewsId }) => {
  const { siteConfig, news, photos } = useCMS();

  useEffect(() => {
    // Determine dynamic title, description, image, and canonical URL based on section/article
    let pageTitle = siteConfig.seoTitle || 'Gabolekwe Farms — Agricultural Excellence in Gweta, Botswana';
    let metaDescription = siteConfig.seoDescription || 'Gabolekwe Farms is a commercial agricultural enterprise in Gweta, Botswana specializing in fresh horticulture produce, commercial beef products, irrigation design, and farm management technology.';
    let ogImage = photos[0] || siteConfig.aboutImage || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80';
    let currentUrl = window.location.origin + window.location.pathname + (currentSection === 'home' ? '' : `#${currentSection}`);

    const activeArticle = selectedNewsId ? news.find(n => n.id === selectedNewsId || n.slug === selectedNewsId) : null;

    if (activeArticle) {
      currentUrl = `${window.location.origin}/#news/${activeArticle.slug || activeArticle.id}`;
    }

    switch (currentSection) {
      case 'home':
        pageTitle = siteConfig.seoTitle || 'Gabolekwe Farms — Agricultural Excellence in Gweta, Botswana';
        metaDescription = siteConfig.seoDescription || 'Gabolekwe Farms is a commercial agricultural enterprise in Gweta, Botswana specializing in fresh horticulture produce, commercial beef products, irrigation design, and farm management technology.';
        break;
      case 'about':
        pageTitle = 'About Us — Gabolekwe Farms | Commercial Agriculture Gweta';
        metaDescription = 'Learn about Gabolekwe Farms in Gweta, Botswana. Dedicated to sustainable livestock, animal feed, fresh vegetables, and advancing local food security.';
        ogImage = siteConfig.aboutImage || ogImage;
        break;
      case 'services':
        pageTitle = 'Services — Gabolekwe Farms | Horticulture, Beef, Irrigation & Tech';
        metaDescription = 'Explore services by Gabolekwe Farms: commercial horticulture produce, beef products & livestock, custom irrigation system design, and agricultural software development.';
        break;
      case 'horticulture':
        pageTitle = 'Fresh Horticulture Produce — Gabolekwe Farms Gweta Botswana';
        metaDescription = 'Fresh vegetables grown in Gweta, Botswana: cabbages, tomatoes, spinach, rape, chomolia, and green peppers by Gabolekwe Farms for local vendors, markets, and lodges.';
        ogImage = 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=1200&q=80';
        break;
      case 'beef':
        pageTitle = 'Premium Beef & Livestock — Gabolekwe Farms Botswana';
        metaDescription = 'Quality Botswana beef products and commercial livestock from Gabolekwe Farms. High-standard beef cuts, cattle, and goats from Gweta, Central District.';
        ogImage = 'https://images.unsplash.com/photo-1545936856-d713c23945a8?auto=format&fit=crop&w=1200&q=80';
        break;
      case 'gallery':
        pageTitle = 'Farm Gallery — Gabolekwe Farms Gweta Botswana';
        metaDescription = 'View high-resolution photos of Gabolekwe Farms in Gweta, Botswana — horticulture fields, commercial livestock, irrigation systems, and farm operations.';
        break;
      case 'news':
        if (activeArticle) {
          pageTitle = activeArticle.seoTitle || `${activeArticle.title} — Gabolekwe Farms News`;
          metaDescription = activeArticle.seoDescription || activeArticle.excerpt || metaDescription;
          if (activeArticle.image) ogImage = activeArticle.image;
        } else {
          pageTitle = 'Latest News & Agricultural Updates — Gabolekwe Farms';
          metaDescription = 'Read agricultural updates, farming insights, harvest announcements, and community news from Gabolekwe Farms in Gweta, Botswana.';
        }
        break;
      case 'contact':
        pageTitle = 'Contact Us — Gabolekwe Farms Gweta Botswana';
        metaDescription = 'Get in touch with Gabolekwe Farms in Gweta, Botswana. Call +267 72 820 542 or +267 74 061 099, email gabolekwefarms@gmail.com, or chat on WhatsApp.';
        break;
      default:
        break;
    }

    // Update document title
    document.title = pageTitle;

    // Helper function to update or create meta tags
    const setMetaTag = (selector: string, attrName: string, attrVal: string, contentVal: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentVal);
    };

    // Update standard meta tags
    setMetaTag('meta[name="description"]', 'name', 'description', metaDescription);

    // Update Open Graph meta tags (Facebook, WhatsApp)
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Gabolekwe Farms');
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', pageTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', metaDescription);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', currentUrl);

    // Update Twitter card meta tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', pageTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', metaDescription);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

    // Update Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // Update Favicon if provided
    if (siteConfig.faviconUrl) {
      let favicon = document.querySelector('link[rel="icon"]');
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.setAttribute('rel', 'icon');
        document.head.appendChild(favicon);
      }
      favicon.setAttribute('href', siteConfig.faviconUrl);
    }

    // Inject Schema.org LocalBusiness & AgriculturalBusiness JSON-LD
    const jsonLdData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'AgriculturalBusiness',
          '@id': `${window.location.origin}/#organization`,
          'name': siteConfig.siteName || 'Gabolekwe Farms',
          'url': window.location.origin,
          'logo': siteConfig.logoUrl || siteConfig.aboutImage || ogImage,
          'image': ogImage,
          'description': metaDescription,
          'telephone': '+26772820542',
          'email': siteConfig.email || 'gabolekwefarms@gmail.com',
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': 'Gweta',
            'addressRegion': 'Central District',
            'addressCountry': 'BW'
          },
          'geo': {
            '@type': 'GeoCoordinates',
            'latitude': -20.2186,
            'longitude': 25.2632
          },
          'areaServed': [
            'Gweta',
            'Maun',
            'Boteti District',
            'Central District',
            'Botswana'
          ],
          'sameAs': [
            siteConfig.facebook || 'https://www.facebook.com/gabolekwefarms'
          ]
        },
        {
          '@type': 'WebSite',
          '@id': `${window.location.origin}/#website`,
          'url': window.location.origin,
          'name': 'Gabolekwe Farms',
          'description': 'Botswana agricultural enterprise in Gweta specializing in fresh horticulture produce, beef products, irrigation systems, and farm technology.',
          'publisher': {
            '@id': `${window.location.origin}/#organization`
          }
        }
      ]
    };

    let scriptTag = document.getElementById('gabolekwe-jsonld');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'gabolekwe-jsonld';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(jsonLdData);

  }, [currentSection, selectedNewsId, siteConfig, news, photos]);

  return null;
};
