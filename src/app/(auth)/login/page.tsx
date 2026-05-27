'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCrypto } from '@/context/CryptoContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Mail, Lock, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { setPassword: setCryptoPassword } = useCrypto();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      // Store password for encryption before auth (CryptoContext picks it up after user loads)
      setCryptoPassword(password);
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Sign in failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden" style={{background: '#15121b'}}>
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none" style={{background: 'rgba(163,116,255,0.12)'}} />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none" style={{background: 'rgba(163,116,255,0.07)'}} />

      <div className="w-full max-w-md px-4 relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-5">
            <TrendingUp size={28} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-2">Smart Money Tracker</h1>
          <p className="text-on-surface-variant text-sm">Sign in to your financial journal</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 border border-white/5" style={{background: 'linear-gradient(135deg, rgba(163,116,255,0.08) 0%, rgba(21,18,27,0.9) 60%, rgba(21,18,27,0.95) 100%)'}}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-[0.15em] text-on-surface-variant uppercase">Email</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/8 transition-colors" style={{background: 'rgba(255,255,255,0.05)'}}>
                <Mail size={16} className="text-on-surface-variant shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent text-on-surface text-sm outline-none placeholder:text-on-surface-variant/30"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-[0.15em] text-on-surface-variant uppercase">Password</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/8 transition-colors" style={{background: 'rgba(255,255,255,0.05)'}}>
                <Lock size={16} className="text-on-surface-variant shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="flex-1 bg-transparent text-on-surface text-sm outline-none placeholder:text-on-surface-variant/30"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm soft-press transition-opacity hover:opacity-90 disabled:opacity-50 mt-1 shadow-[0_0_20px_rgba(163,116,255,0.35)]"
              style={{background: 'linear-gradient(135deg, #7c3aed, #a78bfa)'}}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-on-surface-variant">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary font-semibold hover:opacity-80 transition-opacity">Sign up</Link>
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-6 text-[10px] font-bold tracking-[0.12em] text-on-surface-variant/40 uppercase">
          <span className="flex items-center gap-1.5"><ShieldCheck size={11} /> Secure</span>
          <span className="opacity-30">·</span>
          <span className="flex items-center gap-1.5"><Zap size={11} /> Real-time sync</span>
          <span className="opacity-30">·</span>
          <span className="flex items-center gap-1.5"><TrendingUp size={11} /> Smart insights</span>
        </div>
      </div>
    </div>
  );
}
