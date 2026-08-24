import React, { useState } from 'react';
import { useCMS } from '../lib/cmsStore';
import { Lock, Mail, AlertCircle, ShieldCheck, ArrowLeft } from 'lucide-react';

interface AdminLoginModalProps {
  onSuccess?: () => void;
  onExit?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onSuccess, onExit }) => {
  const { loginAdmin, loginWithGoogle, registerAdmin } = useCMS();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isRegistering) {
        await registerAdmin(email, password);
      } else {
        await loginAdmin(email, password);
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleBackToSite = () => {
    if (onExit) {
      onExit();
    } else {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C0A] text-[#F8F9FA] flex flex-col items-center justify-center p-6 relative">
      <button
        onClick={handleBackToSite}
        className="absolute top-8 left-8 text-xs font-bold uppercase tracking-widest text-[#F8F9FA]/60 hover:text-[#A4C293] transition-colors flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Public Website</span>
      </button>

      <div className="relative max-w-md w-full bg-[#0E120E] border border-white/20 p-8 sm:p-10 shadow-2xl rounded-xl space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-white/5 border border-white/10 text-[#A4C293] flex items-center justify-center mx-auto mb-4 rounded-lg">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-serif text-[#F8F9FA] mb-1 font-bold">Administrator Access</h2>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#A4C293] font-bold">
            Gabolekwe Farms CMS
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-3 rounded-lg leading-relaxed">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="w-full bg-white text-slate-900 hover:bg-slate-100 py-3.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-3 border border-slate-300 shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>{googleLoading ? 'Signing in with Google...' : 'Sign In with Google'}</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/10 w-full"></div>
          <span className="bg-[#0E120E] px-3 text-[10px] uppercase font-bold text-white/40 tracking-widest absolute">
            Or with Email
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#F8F9FA]/70 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-white/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/60 border border-white/10 pl-10 pr-4 py-3 text-sm text-[#F8F9FA] placeholder-white/30 focus:outline-none focus:border-[#A4C293] rounded-lg"
                placeholder="topogabolekwe@gmail.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#F8F9FA]/70 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-white/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/60 border border-white/10 pl-10 pr-4 py-3 text-sm text-[#F8F9FA] placeholder-white/30 focus:outline-none focus:border-[#A4C293] rounded-lg"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-[#A4C293] hover:bg-white text-[#0A0C0A] py-3.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-sm mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : isRegistering ? 'Create Admin Account' : 'Sign In with Email'}</span>
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setIsRegistering(!isRegistering);
              }}
              className="text-xs text-[#F8F9FA]/60 hover:text-[#A4C293] transition-colors underline underline-offset-4"
            >
              {isRegistering ? 'Already have an admin account? Sign in' : 'Need to register a new admin email? Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

