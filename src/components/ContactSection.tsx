import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle, 
  Facebook, 
  MessageSquare, 
  Compass, 
  ExternalLink,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { useCMS } from '../lib/cmsStore';

export const ContactSection: React.FC = () => {
  const { siteConfig, submitEnquiry } = useCMS();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    service: 'Horticulture Produce',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<typeof formData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Business hours handling: display fallback if no hours configured
  const displayHours = siteConfig.hours && siteConfig.hours.trim() 
    ? siteConfig.hours 
    : 'Contact us for availability';

  // Format Facebook URL for display
  const facebookDisplay = siteConfig.facebook
    ? siteConfig.facebook.replace(/^https?:\/\/(www\.)?/, '')
    : 'facebook.com/gabolekwefarms';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message || !formData.phone) return;
    setIsSubmitting(true);
    try {
      await submitEnquiry({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        subject: formData.subject || `${formData.service} Enquiry`,
        service: formData.service,
        message: formData.message
      });
      setSubmittedData({ ...formData });
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting enquiry:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAFBF6] text-slate-800 min-h-screen py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-[11px] uppercase tracking-widest font-bold mb-6 rounded-full shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>Gweta, Botswana</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold font-serif text-slate-900 mb-6 tracking-tight">
            Get in Touch with Gabolekwe Farms
          </h1>
          <p className="text-slate-600 text-lg sm:text-xl font-light leading-relaxed">
            Have questions about horticultural produce, bulk beef orders, irrigation system designs, or agricultural software? Send us a message or contact our Gweta team directly.
          </p>
        </div>

        {/* Top Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Primary Phone Card */}
          <div className="bg-white border border-slate-200 p-8 shadow-xs hover:border-emerald-500/50 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-[0.2em] mb-2">Direct Phone Support</h3>
              <div className="space-y-1 text-slate-700 font-medium text-base">
                {(siteConfig.phone || '+267 72 820 542 / +267 74 061 099').split('/').map((pNum, idx) => {
                  const cleanNum = pNum.trim();
                  const telLink = cleanNum.replace(/[^0-9+]/g, '');
                  return (
                    <a key={idx} href={`tel:${telLink}`} className="block hover:text-emerald-700 transition-colors font-bold">
                      {cleanNum}
                    </a>
                  );
                })}
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100 font-light">
              Speak directly with farm management and produce dispatch in Gweta.
            </p>
          </div>

          {/* Email Card */}
          <div className="bg-white border border-slate-200 p-8 shadow-xs hover:border-emerald-500/50 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-[0.2em] mb-2">Official Email</h3>
              <a 
                href={`mailto:${siteConfig.email || 'gabolekwefarms@gmail.com'}`} 
                className="text-base font-bold text-slate-800 hover:text-emerald-700 transition-colors break-all block"
              >
                {siteConfig.email || 'gabolekwefarms@gmail.com'}
              </a>
            </div>
            <p className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100 font-light">
              Send purchase orders, RFQs, or formal inquiries directly to our inbox.
            </p>
          </div>

          {/* WhatsApp Direct Chat Card */}
          <div className="bg-emerald-900 text-white p-8 shadow-sm transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-[#25D366] text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                <MessageSquare className="w-6 h-6 fill-current" />
              </div>
              <h3 className="text-xs font-bold text-emerald-200 uppercase tracking-[0.2em] mb-2">Instant WhatsApp Chat</h3>
              <p className="text-xl font-bold font-serif text-white mb-2">
                {siteConfig.whatsapp || '+267 74 061 099'}
              </p>
            </div>
            <a
              href={`https://wa.me/${siteConfig.whatsapp ? siteConfig.whatsapp.replace(/[^0-9]/g, '') : '26774061099'}?text=Hello%20Gabolekwe%20Farms,%20I%20would%20like%20to%20make%20an%20enquiry.`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 pt-4 border-t border-emerald-800/80 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#25D366] hover:text-white transition-colors"
            >
              <span>Chat on WhatsApp Now</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Main Content Layout: Info Sidebar + Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Left Column: Editable Contact Information & Business Hours */}
          <div className="space-y-8">
            <div className="bg-white border border-slate-200 p-8 sm:p-10 shadow-xs space-y-8">
              <h3 className="text-2xl font-serif text-slate-900 font-bold border-b border-slate-100 pb-4">
                Contact Details
              </h3>

              <div className="space-y-6">
                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] mb-1">Location</h4>
                    <p className="text-slate-700 text-sm font-light">
                      {siteConfig.address || 'Gweta, Botswana'}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] mb-1">Phone Numbers</h4>
                    <p className="text-slate-700 text-sm font-light leading-relaxed">
                      {(siteConfig.phone || '+267 72 820 542 / +267 74 061 099').split('/').map((pNum, idx) => {
                        const cleanNum = pNum.trim();
                        const telLink = cleanNum.replace(/[^0-9+]/g, '');
                        return (
                          <a key={idx} href={`tel:${telLink}`} className="hover:text-emerald-700 transition-colors block">
                            {cleanNum}
                          </a>
                        );
                      })}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] mb-1">Email Address</h4>
                    <p className="text-slate-700 text-sm font-light">
                      <a href={`mailto:${siteConfig.email || 'gabolekwefarms@gmail.com'}`} className="hover:text-emerald-700 transition-colors">
                        {siteConfig.email || 'gabolekwefarms@gmail.com'}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Facebook */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Facebook className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] mb-1">Facebook Page</h4>
                    <p className="text-slate-700 text-sm font-light">
                      <a 
                        href={siteConfig.facebook || 'https://www.facebook.com/gabolekwefarms'} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-emerald-700 transition-colors underline flex items-center gap-1.5"
                      >
                        <span>{facebookDisplay}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-4 pt-2 border-t border-slate-100">
                  <div className="w-10 h-10 bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] mb-1">Business Hours</h4>
                    <p className="text-slate-700 text-sm font-medium leading-relaxed">
                      {displayHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Farm Supply & Delivery Highlights */}
            <div className="bg-slate-900 text-white p-8 space-y-4">
              <div className="flex items-center gap-3 text-emerald-400">
                <Truck className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Regional Dispatch</span>
              </div>
              <h4 className="text-lg font-serif font-bold text-slate-100">Gweta, Maun & Surrounding Lodges</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                We organize fresh produce harvests and beef product deliveries daily for markets, safari lodges, vendors, and community buyers in Gweta and northern Botswana.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-2 bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
            {submitted ? (
              <div className="text-center py-16 space-y-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center mx-auto rounded-full">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-serif text-slate-900 font-bold">Enquiry Submitted Successfully</h3>
                <p className="text-slate-600 max-w-md mx-auto text-sm font-light leading-relaxed">
                  Thank you for reaching out to Gabolekwe Farms, <strong className="text-slate-900">{submittedData?.name}</strong>. Your message regarding <span className="font-semibold text-emerald-800">{submittedData?.service}</span> has been securely saved to our database. Our farm team will review your enquiry and respond promptly.
                </p>

                <div className="bg-[#FAFBF6] border border-slate-200 p-6 text-left max-w-lg mx-auto text-xs space-y-2 text-slate-700 font-mono">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500 uppercase font-bold">Ref Subject:</span>
                    <span className="font-bold">{submittedData?.subject || 'General Enquiry'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500 uppercase font-bold">Email:</span>
                    <span>{submittedData?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 uppercase font-bold">Phone:</span>
                    <span>{submittedData?.phone}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSubmitted(false);
                    setSubmittedData(null);
                    setFormData({ name: '', phone: '', email: '', subject: '', service: 'Horticulture Produce', message: '' });
                  }}
                  className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-serif text-slate-900 font-bold mb-2">Send Us an Enquiry</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
                    Fill out the form below and your enquiry will be routed directly to our team.
                  </p>
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Mompati Gabolekwe"
                      className="w-full bg-[#FAFBF6] border border-slate-300 px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +267 72 820 542"
                      className="w-full bg-[#FAFBF6] border border-slate-300 px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Email & Service */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. buyer@example.com"
                      className="w-full bg-[#FAFBF6] border border-slate-300 px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-700 mb-2">
                      Service Enquiry *
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full bg-[#FAFBF6] border border-slate-300 px-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors font-medium"
                    >
                      <option value="Horticulture Produce">Horticulture Produce (Vegetables, Crops)</option>
                      <option value="Beef Products / Livestock">Beef Products & Livestock Sales</option>
                      <option value="Irrigation System Design & Consultation">Irrigation System Design & Consultation</option>
                      <option value="Farm Management Application Development">Farm Management Software Development</option>
                      <option value="General Enquiry">General Enquiry / Partnerships</option>
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Bulk Cabbage Order for Maun Market"
                    className="w-full bg-[#FAFBF6] border border-slate-300 px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-700 mb-2">
                    Message Details *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide specific details about your produce requirements, order quantities, preferred delivery dates, or project specifications..."
                    className="w-full bg-[#FAFBF6] border border-slate-300 p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-900 text-white px-10 py-4 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Enquiry...' : 'Submit Enquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Map & Location Section */}
        <div className="bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">
                <Compass className="w-4 h-4" />
                <span>Location & Farm Gateway</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif text-slate-900 font-bold">
                Gweta, Central District, Botswana
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Gateway to Makgadikgadi Agricultural Region</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Interactive Map Embed */}
            <div className="lg:col-span-2 relative aspect-video sm:aspect-auto sm:h-[380px] bg-slate-100 border border-slate-200 overflow-hidden">
              <iframe
                src="https://maps.google.com/maps?q=Gabolekwe+Farms,+Gweta,+Botswana&t=k&z=17&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Gabolekwe Farms Exact Location Map"
                className="w-full h-full"
              ></iframe>
            </div>

            {/* Map Directions & Regional Notes */}
            <div className="space-y-6 bg-[#FAFBF6] border border-slate-200 p-8 h-full flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-serif font-bold text-slate-900 mb-3">
                  Farm Access & Regional Reach
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-light mb-4">
                  Situated along the main Maun-Nata transit corridor in Gweta, Gabolekwe Farms is strategically positioned for rapid fresh produce distribution across Boteti, Maun safari lodges, and northern Botswana markets.
                </p>
                
                <ul className="space-y-3 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                    <span><strong>Gweta Dispatch Hub:</strong> Local pickup available</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                    <span><strong>Maun Supply Line:</strong> Regular lodge & vendor deliveries</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                    <span><strong>Boteti District:</strong> Commercial agricultural produce</span>
                  </li>
                </ul>
              </div>

              <a
                href="https://maps.google.com/?q=Gabolekwe+Farms,+Gweta,+Botswana"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-widest transition-colors"
              >
                <span>Open Exact Location in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
