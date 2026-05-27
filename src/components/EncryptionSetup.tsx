'use client';

import { useState } from 'react';
import { Shield, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useCrypto } from '@/context/CryptoContext';
import styles from './EncryptionSetup.module.css';

export default function EncryptionSetup() {
  const { setupEncryption } = useCrypto();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const strength = getStrength(password);
  const canSubmit = password.length >= 8 && password === confirm && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError('');
    setLoading(true);
    try {
      await setupEncryption(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Setup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <Shield size={40} />
        </div>
        <h2 className={styles.title}>Set Up Encryption</h2>
        <p className={styles.subtitle}>
          Create a separate encryption password to protect your financial data.
          All sensitive information will be encrypted before it leaves your browser.
        </p>

        <div className={styles.warning}>
          <AlertTriangle size={18} />
          <span>
            <strong>Remember this password!</strong> If you forget it, your encrypted data
            cannot be recovered. This is separate from your login password.
          </span>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Encryption Password</label>
            <div className={styles.inputWrap}>
              <input
                type={showPw ? 'text' : 'password'}
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                minLength={8}
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
            {password.length > 0 && (
              <div className={styles.strengthBar}>
                <div
                  className={styles.strengthFill}
                  style={{
                    width: `${strength.percent}%`,
                    background: strength.color,
                  }}
                />
              </div>
            )}
            {password.length > 0 && (
              <span className={styles.strengthLabel} style={{ color: strength.color }}>
                {strength.label}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Confirm Password</label>
            <input
              type={showPw ? 'text' : 'password'}
              className={styles.input}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter your password"
            />
            {confirm.length > 0 && confirm !== password && (
              <span className={styles.errorText}>Passwords do not match</span>
            )}
          </div>

          {error && <div className={styles.errorBox}>{error}</div>}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!canSubmit}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              <>
                <Shield size={18} />
                Enable Encryption
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function getStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { percent: 20, label: 'Weak', color: '#f43f5e' };
  if (score <= 2) return { percent: 40, label: 'Fair', color: '#f97316' };
  if (score <= 3) return { percent: 60, label: 'Good', color: '#eab308' };
  if (score <= 4) return { percent: 80, label: 'Strong', color: '#10b981' };
  return { percent: 100, label: 'Very Strong', color: '#06b6d4' };
}
