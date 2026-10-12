import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  X, 
  CheckCircle2, 
  Sparkles, 
  KeyRound,
  Mail,
  AlertCircle
} from 'lucide-react';
import { BMFUser } from '../types/bmf';
import { isSuperAdminEmail, normalizeEmail } from '../utils/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: BMFUser) => void;
  initialEmail?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  initialEmail 
}) => {
  const [authTab, setAuthTab] = useState<'google' | 'password'>('google');
  
  // Google sign in states
  const [googleEmail, setGoogleEmail] = useState(initialEmail || '');
  const [googleName, setGoogleName] = useState('');
  const [googlePassword, setGooglePassword] = useState('');
  const [showGooglePassword, setShowGooglePassword] = useState(false); // HIDE password by default
  const [googleError, setGoogleError] = useState('');
  const [isVerifyingGoogle, setIsVerifyingGoogle] = useState(false);

  // Private Family Key sign in states
  const [memberName, setMemberName] = useState('');
  const [familyKeyPassword, setFamilyKeyPassword] = useState('');
  const [showFamilyPassword, setShowFamilyPassword] = useState(false); // HIDE password by default
  const [passwordError, setPasswordError] = useState('');
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);

  if (!isOpen) return null;

  // Handle Google Gmail Login with required password @23conri@
  const handleGoogleSignIn = (targetEmail?: string, targetName?: string) => {
    setGoogleError('');
    const emailToUse = targetEmail || googleEmail.trim();

    if (!emailToUse) {
      setGoogleError('Please enter or select a Gmail address.');
      return;
    }

    const trimmedPass = googlePassword.trim();
    if (!trimmedPass) {
      setGoogleError('Please enter the required Google entrance password.');
      return;
    }

    // Required password for Google Gmail entrance: @23conri@
    if (trimmedPass.toLowerCase() !== '@23conri@'.toLowerCase()) {
      setGoogleError('Invalid entrance password for Google Gmail. Access denied.');
      return;
    }

    const normalized = normalizeEmail(emailToUse);
    const derivedName = targetName || googleName.trim() || normalized.split('@')[0].replace('.', ' ');
    const displayName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);

    setIsVerifyingGoogle(true);

    setTimeout(() => {
      setIsVerifyingGoogle(false);
      const isSuper = isSuperAdminEmail(normalized);

      const user: BMFUser = {
        id: `usr-${Date.now()}`,
        name: isSuper ? `${displayName} (Super Admin)` : displayName,
        email: normalized,
        role: isSuper ? 'super_admin' : 'member',
        authMethod: 'google',
        verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      onLoginSuccess(user);
      onClose();
    }, 600);
  };

  // Handle Private Family Key Login with required password @BMF2026@
  const handlePasswordSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    const trimmedName = memberName.trim();
    const trimmedPass = familyKeyPassword.trim();

    if (!trimmedName) {
      setPasswordError('Please provide your member name or family code.');
      return;
    }

    if (!trimmedPass) {
      setPasswordError('Please enter the private family key password.');
      return;
    }

    // Required password for Private Family Key: @BMF2026@
    const validFamilyPasswords = ['@BMF2026@', '@bmf2026@', 'BMF2026'];
    const isPassValid = validFamilyPasswords.some(
      p => p.toUpperCase() === trimmedPass.toUpperCase()
    );

    if (!isPassValid) {
      setPasswordError('Invalid private family key password.');
      return;
    }

    setIsVerifyingPassword(true);

    setTimeout(() => {
      setIsVerifyingPassword(false);
      const lowerName = trimmedName.toLowerCase();
      const isSuper = lowerName.includes('concoituze') || lowerName.includes('concorde');
      const assignedEmail = isSuper 
        ? (lowerName.includes('concoituze') ? 'concoituze@gmail.com' : 'concorderuhungande@gmail.com')
        : `${trimmedName.toLowerCase().replace(/\s+/g, '')}@bmf.member`;

      const user: BMFUser = {
        id: `usr-${Date.now()}`,
        name: isSuper ? `${trimmedName} (Super Admin)` : trimmedName,
        email: assignedEmail,
        role: isSuper ? 'super_admin' : 'member',
        authMethod: 'password',
        verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      onLoginSuccess(user);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all">
      <div 
        className="relative w-full max-w-lg bg-[#061234] border-2 border-amber-500/70 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(245,158,11,0.25)] p-6 md:p-8 text-white animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-[#071740] border border-blue-900/80 text-blue-300 hover:text-amber-400 hover:border-amber-500/60 flex items-center justify-center transition-all"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Crest Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-950 border-2 border-amber-500 flex items-center justify-center mb-3 shadow-lg shadow-black/60">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-2xl font-black tracking-wide text-white font-display">
            B M F Member Entrance
          </h2>
          <p className="text-xs text-blue-200 mt-1">
            The Best Mate Family · Est. 2021 · <span className="text-amber-400 italic font-semibold">&ldquo;Our love never fail&rdquo;</span>
          </p>
        </div>

        {/* Method Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-[#03091e] border border-blue-900 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setAuthTab('google');
              setGoogleError('');
              setPasswordError('');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
              authTab === 'google' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' 
                : 'text-blue-300 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4 text-amber-400" />
            Google Gmail Entrance
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthTab('password');
              setGoogleError('');
              setPasswordError('');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
              authTab === 'password' 
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md' 
                : 'text-blue-300 hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4" />
            Private Family Key
          </button>
        </div>

        {authTab === 'google' ? (
          <div>
            <div className="p-3 mb-4 rounded-xl bg-blue-950/60 border border-blue-800 text-xs text-blue-200 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Google Gmail Security Protection</strong>
                <span>All users must provide the Google entrance password. Super Admin access is granted to </span>
                <span className="text-amber-300 font-mono font-semibold">concoituze@gmail.com</span>
                <span> &amp; </span>
                <span className="text-amber-300 font-mono font-semibold">concorderuhungande@gmail.com</span>.
              </div>
            </div>

            {googleError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-950/80 border border-rose-600 text-xs text-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{googleError}</span>
              </div>
            )}

            {/* Quick 1-Click Verification for Authorized Admins */}
            <div className="space-y-2 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 block">
                Quick Select Account:
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setGoogleEmail('concoituze@gmail.com');
                    setGoogleName('Concoituze');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    googleEmail === 'concoituze@gmail.com'
                      ? 'bg-amber-500/20 border-amber-400 text-white'
                      : 'bg-[#071740] border-blue-900 text-blue-200 hover:border-amber-400'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center gap-1.5 text-white">
                    <span className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 font-black text-[11px] flex items-center justify-center">C</span>
                    concoituze@gmail.com
                  </div>
                  <span className="text-[10px] text-amber-300 font-semibold mt-0.5 block">Super Admin (Founder)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setGoogleEmail('concorderuhungande@gmail.com');
                    setGoogleName('Concorde Ruhungande');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    googleEmail === 'concorderuhungande@gmail.com'
                      ? 'bg-amber-500/20 border-amber-400 text-white'
                      : 'bg-[#071740] border-blue-900 text-blue-200 hover:border-amber-400'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center gap-1.5 text-white">
                    <span className="w-5 h-5 rounded-md bg-amber-400 text-slate-950 font-black text-[11px] flex items-center justify-center">CR</span>
                    concorderuhungande@gmail.com
                  </div>
                  <span className="text-[10px] text-amber-300 font-semibold mt-0.5 block">Super Admin (Lead)</span>
                </button>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleGoogleSignIn(); }} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-blue-300 mb-1">
                  Gmail Address
                </label>
                <input
                  type="email"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full bg-[#03091e] border border-blue-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-blue-400/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-blue-300 mb-1">
                  Display Name (Optional)
                </label>
                <input
                  type="text"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  placeholder="e.g. David / Grace / Samuel"
                  className="w-full bg-[#03091e] border border-blue-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-blue-400/50 focus:border-amber-400 outline-none transition-all"
                />
              </div>

              {/* Password for Google Gmail Entrance (Masked/Hidden) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                    Google Gmail Security Password
                  </label>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Hidden Mode
                  </span>
                </div>
                
                <div className="relative">
                  <input
                    type={showGooglePassword ? 'text' : 'password'}
                    value={googlePassword}
                    onChange={(e) => setGooglePassword(e.target.value)}
                    placeholder="Enter security password..."
                    className="w-full bg-[#03091e] border border-blue-800 rounded-xl px-3.5 py-2.5 pr-11 text-sm text-white placeholder-blue-400/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all tracking-wider"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGooglePassword(!showGooglePassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-amber-400 transition-colors p-1"
                    title={showGooglePassword ? 'Hide password' : 'Show password'}
                    aria-label="Toggle password visibility"
                  >
                    {showGooglePassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-blue-300 mt-1">
                  Password is automatically hidden while you type.
                </p>
              </div>

              <button
                type="submit"
                disabled={isVerifyingGoogle}
                className="w-full mt-3 py-3 px-4 bg-gradient-to-r from-blue-600 via-blue-500 to-amber-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-950 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifyingGoogle ? (
                  <span>Verifying Google Gmail Security...</span>
                ) : (
                  <>
                    <Mail className="w-4 h-4 text-amber-300" />
                    <span>Authorize with Google Gmail</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div>
            {/* Private Family Key Login Form */}
            <div className="p-3 mb-4 rounded-xl bg-blue-950/40 border border-blue-900/60 text-xs text-blue-200 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Enter your member code/name and the private family key password.</span>
            </div>

            {passwordError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-950/80 border border-rose-600 text-xs text-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSignIn} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-blue-300 mb-1">
                  Member Name or Code
                </label>
                <input
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="e.g. David / Grace / Concoituze"
                  className="w-full bg-[#03091e] border border-blue-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-blue-400/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all"
                  required
                />
              </div>

              {/* Masked Password Field with Eye Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                    Private Family Key Password
                  </label>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Hidden Mode
                  </span>
                </div>
                
                <div className="relative">
                  <input
                    type={showFamilyPassword ? 'text' : 'password'}
                    value={familyKeyPassword}
                    onChange={(e) => setFamilyKeyPassword(e.target.value)}
                    placeholder="Enter private family key password..."
                    className="w-full bg-[#03091e] border border-blue-800 rounded-xl px-3.5 py-2.5 pr-11 text-sm text-white placeholder-blue-400/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all tracking-wider"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowFamilyPassword(!showFamilyPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-amber-400 transition-colors p-1"
                    title={showFamilyPassword ? 'Hide password' : 'Show password'}
                    aria-label="Toggle password visibility"
                  >
                    {showFamilyPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-blue-300 mt-1">
                  Password remains concealed while typing.
                </p>
              </div>

              <button
                type="submit"
                disabled={isVerifyingPassword}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-950 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isVerifyingPassword ? (
                  <span>Verifying Private Key...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Verify Key &amp; Enter Lounge</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-blue-900/60 text-center">
          <p className="text-[11px] text-blue-300">
            BMF Foundation Community · <span className="text-amber-400 font-semibold">&ldquo;Our love never fail&rdquo;</span>
          </p>
        </div>
      </div>
    </div>
  );
};
