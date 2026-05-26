'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { User, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { toast.error('Please fill in all fields'); return; }
    if (password !== confirm) { toast.error('Passwords do not match'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await signUp(email, password, name);
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Sign up failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1, animation: 'scaleIn 0.3s ease' }}>
      <div style={{ background: 'rgba(26,35,50,0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '44px 36px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>💰</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 6 }}>Create Account</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Start tracking your finances</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Input label="Display Name" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" icon={<User size={18} />} />
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" icon={<Mail size={18} />} />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" icon={<Lock size={18} />} />
          <Input label="Confirm Password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" icon={<Lock size={18} />} />
          <Button type="submit" fullWidth loading={loading} size="lg">Create Account</Button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.85rem', color: '#64748b' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#a78bfa', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
