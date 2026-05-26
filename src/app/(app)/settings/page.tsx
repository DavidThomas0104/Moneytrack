'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { CURRENCIES } from '@/types';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { settings, updateSettings } = useApp();
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
      <div className="glass-card" style={{ padding: '24px', maxWidth: 500, borderColor: 'rgba(244,63,94,0.2)' }}>
        <h3 style={{ marginBottom: '12px', color: 'var(--color-expense)' }}>Danger Zone</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>Sign out of your account.</p>
        <Button variant="danger" onClick={() => signOut()}>Sign Out</Button>
      </div>
    </div>
  );
}
