'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import {
  deriveKey,
  generateDataKey,
  generateSalt,
  wrapDataKey,
  unwrapDataKey,
  exportKeyToBase64,
  importKeyFromBase64,
} from '@/lib/crypto';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EncryptionMeta {
  salt: string;
  wrappedKey: string;
  iv: string;
  createdAt: string;
}

interface CryptoContextValue {
  dataKey: CryptoKey | null;
  isEncryptionEnabled: boolean;
  isLoading: boolean;
  isLocked: boolean;
  setPassword: (password: string) => void;
  lockEncryption: () => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const CryptoContext = createContext<CryptoContextValue | undefined>(undefined);

const SESSION_KEY_NAME = 'or_session_key';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function bufToB64(buf: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < buf.byteLength; i++) binary += String.fromCharCode(buf[i]);
  return btoa(binary);
}
function b64ToBuf(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function CryptoProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [dataKey, setDataKey] = useState<CryptoKey | null>(null);
  const [encMeta, setEncMeta] = useState<EncryptionMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [metaLoaded, setMetaLoaded] = useState(false);
  const pendingPassword = useRef<string | null>(null);

  // Track whether we previously had a logged-in user.
  // This lets us distinguish a genuine sign-out (user goes null AFTER being set)
  // from the initial page-load null state BEFORE Firebase restores the session.
  // We must NOT clear sessionStorage in the second case or the saved key is lost.
  const didHaveUser = useRef(false);

  // -----------------------------------------------------------------------
  // Load encryption metadata when user changes
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!user) {
      // Only wipe the session key on a REAL sign-out, not the initial null
      // that occurs while Firebase is resolving the auth session on refresh.
      if (didHaveUser.current) {
        sessionStorage.removeItem(SESSION_KEY_NAME);
      }
      didHaveUser.current = false;
      setDataKey(null);
      setEncMeta(null);
      setIsLoading(false);
      setMetaLoaded(false);
      pendingPassword.current = null;
      return;
    }

    didHaveUser.current = true;

    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        // 1. Try restoring the key from sessionStorage first (page refresh case).
        //    sessionStorage persists across refreshes but is cleared when the tab closes.
        const sessionKeyB64 = sessionStorage.getItem(SESSION_KEY_NAME);
        if (sessionKeyB64) {
          try {
            const restoredKey = await importKeyFromBase64(sessionKeyB64);
            if (!cancelled) setDataKey(restoredKey);
          } catch {
            // Corrupted entry — remove it and fall through to password-based unlock
            sessionStorage.removeItem(SESSION_KEY_NAME);
          }
        }

        // 2. Always load encryption metadata from Firestore
        const snap = await getDoc(doc(db, 'users', user.uid, 'settings', 'encryption'));
        if (!cancelled) {
          setEncMeta(snap.exists() ? (snap.data() as EncryptionMeta) : null);
          setMetaLoaded(true);
        }
      } catch (err) {
        console.error('Failed to load encryption metadata:', err);
        if (!cancelled) setMetaLoaded(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user]);

  // -----------------------------------------------------------------------
  // Auto setup/unlock when password + user + metadata are all ready
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!user || !metaLoaded || !pendingPassword.current || dataKey) return;

    const password = pendingPassword.current;

    (async () => {
      setIsLoading(true);
      try {
        if (encMeta) {
          // Existing user — unlock with login password
          const salt = b64ToBuf(encMeta.salt);
          const wrappingKey = await deriveKey(password, salt);
          const key = await unwrapDataKey(encMeta.wrappedKey, encMeta.iv, wrappingKey);
          // Save to sessionStorage so refreshes don't need re-login
          const keyB64 = await exportKeyToBase64(key);
          sessionStorage.setItem(SESSION_KEY_NAME, keyB64);
          setDataKey(key);
        } else {
          // New user — first-time encryption setup
          const salt = generateSalt();
          const wrappingKey = await deriveKey(password, salt);
          const newDataKey = await generateDataKey();
          const { wrappedKey, iv } = await wrapDataKey(newDataKey, wrappingKey);
          const meta: EncryptionMeta = {
            salt: bufToB64(salt),
            wrappedKey,
            iv,
            createdAt: new Date().toISOString(),
          };
          await setDoc(doc(db, 'users', user.uid, 'settings', 'encryption'), meta);
          const keyB64 = await exportKeyToBase64(newDataKey);
          sessionStorage.setItem(SESSION_KEY_NAME, keyB64);
          setEncMeta(meta);
          setDataKey(newDataKey);
        }
      } catch (err) {
        console.error('Auto encryption setup/unlock failed:', err);
      } finally {
        pendingPassword.current = null;
        setIsLoading(false);
      }
    })();
  }, [user, metaLoaded, encMeta, dataKey]);

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------
  const setPassword = useCallback((password: string) => {
    pendingPassword.current = password;
  }, []);

  const lockEncryption = useCallback(() => {
    setDataKey(null);
    pendingPassword.current = null;
    sessionStorage.removeItem(SESSION_KEY_NAME);
  }, []);

  const value: CryptoContextValue = {
    dataKey,
    isEncryptionEnabled: !!encMeta,
    isLoading,
    isLocked: !!encMeta && !dataKey,
    setPassword,
    lockEncryption,
  };

  return <CryptoContext.Provider value={value}>{children}</CryptoContext.Provider>;
}

export function useCrypto(): CryptoContextValue {
  const ctx = useContext(CryptoContext);
  if (!ctx) throw new Error('useCrypto must be used within CryptoProvider');
  return ctx;
}
