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
  /** Store the login password so encryption auto-initializes after auth. */
  setPassword: (password: string) => void;
  lockEncryption: () => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const CryptoContext = createContext<CryptoContextValue | undefined>(undefined);

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

  // -----------------------------------------------------------------------
  // Load encryption metadata when user changes
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!user) {
      setDataKey(null);
      setEncMeta(null);
      setIsLoading(false);
      setMetaLoaded(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
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
          // Existing user — unlock
          const salt = b64ToBuf(encMeta.salt);
          const wrappingKey = await deriveKey(password, salt);
          const key = await unwrapDataKey(encMeta.wrappedKey, encMeta.iv, wrappingKey);
          setDataKey(key);
        } else {
          // New user — first-time setup
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
  // Clear key on sign-out
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!user) {
      setDataKey(null);
      pendingPassword.current = null;
    }
  }, [user]);

  // -----------------------------------------------------------------------
  // Public: store password (called from login/signup pages before auth)
  // -----------------------------------------------------------------------
  const setPassword = useCallback((password: string) => {
    pendingPassword.current = password;
  }, []);

  const lockEncryption = useCallback(() => {
    setDataKey(null);
    pendingPassword.current = null;
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
