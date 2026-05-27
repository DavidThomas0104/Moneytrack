'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { useCrypto } from '@/context/CryptoContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { CURRENCIES } from '@/types';
import { Shield, ShieldCheck, Lock, UserCircle, Save, AlertTriangle, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { settings, updateSettings } = useApp();
  const { isEncryptionEnabled, lockEncryption } = useCrypto();
  const [displayName, setDisplayName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setDisplayName(settings.displayName || '');
      setCurrency(settings.currency || 'USD');
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try { await updateSettings({ displayName, currency }); }
    finally { setSaving(false); }
  };

  const handleSignOut = async () => {
    lockEncryption();
    await signOut();
  };

  return (
    <div className="animate-fadeIn space-y-8 max-w-2xl pb-8">

      {/* Profile Settings */}
      <section>
        <h2 className="flex items-center gap-2 text-on-surface font-bold text-lg mb-4">
          <UserCircle size={20} className="text-primary" />
          Profile Settings
        </h2>

        <div className="rounded-xl p-6 space-y-5 border border-white/5" style={{background: 'linear-gradient(135deg, rgba(163,116,255,0.08) 0%, rgba(21,18,27,0.6) 50%, rgba(21,18,27,0) 100%)'}}>
          {/* Display Name + Account Email side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold tracking-[0.15em] text-on-surface-variant uppercase">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="px-4 py-3 rounded-lg text-on-surface text-sm focus:outline-none focus:border-primary/60 transition-colors border border-white/8" style={{background: 'rgba(255,255,255,0.05)'}}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold tracking-[0.15em] text-on-surface-variant uppercase">Account Email</label>
              <div className="px-4 py-3 rounded-lg text-on-surface-variant text-sm select-none border border-white/8" style={{background: 'rgba(255,255,255,0.03)'}}>
                {user?.email}
              </div>
            </div>
          </div>

          {/* Currency full-width */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-[0.15em] text-on-surface-variant uppercase">Currency</label>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-on-surface text-sm focus:outline-none focus:border-primary/60 transition-colors appearance-none cursor-pointer border border-white/8" style={{background: 'rgba(255,255,255,0.05)'}}
            >
              {CURRENCIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Save Button */}
          <div className="pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-primary text-on-primary font-bold rounded-full px-6 py-2.5 text-sm soft-press transition-opacity hover:opacity-80 disabled:opacity-50 shadow-[0_0_18px_rgba(163,116,255,0.35)]"
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </section>

      {/* Account Session */}
      <section>
        <h2 className="flex items-center gap-2 text-[#ffb347] font-bold text-lg mb-4">
          <AlertTriangle size={20} className="text-[#ffb347]" />
          Account Session
        </h2>

        <div className="rounded-xl p-6 border border-white/5" style={{background: 'linear-gradient(135deg, rgba(21,18,27,0) 0%, rgba(163,116,255,0.06) 100%)'}}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-on-surface font-bold text-sm mb-1">Sign out</p>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Disconnect your current session.{' '}
                <span className="text-primary">All your local data will remain synced.</span>
              </p>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 bg-surface-container-high border border-white/10 text-on-surface font-bold rounded-lg px-5 py-2.5 text-sm soft-press transition-all hover:border-error/40 hover:text-error shrink-0"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* Encryption Status */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', maxWidth: 500, borderColor: isEncryptionEnabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)' }}>
        <h3 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: isEncryptionEnabled ? '#10b981' : 'var(--color-text-secondary)' }}>
          {isEncryptionEnabled ? <ShieldCheck size={20} /> : <Shield size={20} />}
          Data Encryption
        </h3>
        {isEncryptionEnabled ? (
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '8px',
              fontSize: '0.8rem',
              color: '#34d399',
              fontWeight: 600,
              marginBottom: '12px',
            }}>
              <Lock size={14} />
              Encryption Active
            </div>
            <p style={{ fontSize: '0.83rem', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
              Your financial data is encrypted with AES-256-GCM before being sent to the database.
              Even with database access, your data appears as unreadable ciphertext.
            </p>
          </div>
        ) : (
          <p style={{ fontSize: '0.83rem', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
            Data encryption is not enabled. Your data is protected by Firebase Security Rules
            but is stored in plaintext in the database.
          </p>
        )}
      </div>

      <div className="glass-card" style={{ padding: '24px', maxWidth: 500, borderColor: 'rgba(244,63,94,0.2)' }}>
        <h3 style={{ marginBottom: '12px', color: 'var(--color-expense)' }}>Danger Zone</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>Sign out of your account.</p>
        <Button variant="danger" onClick={handleSignOut}>Sign Out</Button>
      </div>
    </div>
  );
}
