'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { useCrypto } from '@/context/CryptoContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { CURRENCIES } from '@/types';
import { Shield, ShieldCheck, Lock } from 'lucide-react';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { settings, updateSettings } = useApp();
  const { isEncryptionEnabled, lockEncryption } = useCrypto();
  const [displayName, setDisplayName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) { setDisplayName(settings.displayName || ''); setCurrency(settings.currency || 'USD'); }
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
    <div>
      <div className="page-header"><h1>Settings</h1></div>
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', maxWidth: 500 }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--color-text-secondary)' }}>Profile</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Display Name" value={displayName} onChange={e => setDisplayName(e.target.value)} />
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Email: {user?.email}</div>
          <Select label="Currency" value={currency} onChange={e => setCurrency(e.target.value)} options={CURRENCIES.map(c => ({ value: c.value, label: c.label }))} />
          <Button onClick={handleSave} loading={saving}>Save Changes</Button>
        </div>
      </div>

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
