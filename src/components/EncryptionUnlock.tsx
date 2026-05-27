'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useCrypto } from '@/context/CryptoContext';
import styles from './EncryptionSetup.module.css';

export default function EncryptionUnlock() {
  const { unlockEncryption } = useCrypto();
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || loading) return;
    setError('');
    setLoading(true);
    try {
      await unlockEncryption(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wrong password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <Lock size={40} />
        </div>
        <h2 className={styles.title}>Unlock Your Data</h2>
        <p className={styles.subtitle}>
          Enter your encryption password to decrypt your financial data.
          This is separate from your login password.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Encryption Password</label>
            <div className={styles.inputWrap}>
              <input
                type={showPw ? 'text' : 'password'}
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your encryption password"
                autoFocus
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPw(!showPw)}
                tabIndex={-1}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <div className={styles.errorBox}>{error}</div>}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!password || loading}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              <>
                <Lock size={18} />
                Unlock
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
