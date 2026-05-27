'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
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
  salt: string;        // Base64 salt for PBKDF2
  wrappedKey: string;  // Base64 AES-GCM wrapped data key
  iv: string;          // Base64 IV used to wrap the data key
  createdAt: string;
}

interface CryptoContextValue {
  /** The data encryption key — null if not set up or locked. */
  dataKey: CryptoKey | null;
  /** Whether the user has encryption enabled (metadata exists in Firestore). */
  isEncryptionEnabled: boolean;
  /** Whether encryption state is still loading from Firestore. */
  isLoading: boolean;
  /** Whether the vault is locked (key not in memory). */
  isLocked: boolean;
  /** First-time encryption setup: create key, wrap it, store in Firestore. */
  setupEncryption: (password: string) => Promise<void>;
  /** Unlock encryption on a returning session / new device. */
  unlockEncryption: (password: string) => Promise<void>;
  /** Lock (clear key from memory). Called on sign-out. */
  lockEncryption: () => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const CryptoContext = createContext<CryptoContextValue | undefined>(undefined);

// ---------------------------------------------------------------------------
// Helpers — convert Uint8Array <-> Base64 for Firestore storage
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

  // Firestore path for encryption metadata
  const encDocRef = user ? doc(db, 'users', user.uid, 'settings', 'encryption') : null;

  // -----------------------------------------------------------------------
  // Load encryption metadata on auth change
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!user) {
      setDataKey(null);
      setEncMeta(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const snap = await getDoc(doc(db, 'users', user.uid, 'settings', 'encryption'));
        if (!cancelled) {
          if (snap.exists()) {
            setEncMeta(snap.data() as EncryptionMeta);
          } else {
            setEncMeta(null);
          }
        }
      } catch (err) {
        console.error('Failed to load encryption metadata:', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user]);

  // -----------------------------------------------------------------------
  // Lock on sign-out
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!user) {
      setDataKey(null);
    }
  }, [user]);

  // -----------------------------------------------------------------------
  // First-time setup
  // -----------------------------------------------------------------------
  const setupEncryption = useCallback(async (password: string) => {
    if (!user || !encDocRef) throw new Error('Must be signed in');

    // 1. Generate a random salt
    const salt = generateSalt();

    // 2. Derive a wrapping key from the password
    const wrappingKey = await deriveKey(password, salt);

    // 3. Generate a random data key (used for actual data encryption)
    const newDataKey = await generateDataKey();

    // 4. Wrap the data key with the wrapping key
    const { wrappedKey, iv } = await wrapDataKey(newDataKey, wrappingKey);

    // 5. Store the metadata in Firestore (salt + wrapped key + IV)
    const meta: EncryptionMeta = {
      salt: bufToB64(salt),
      wrappedKey,
      iv,
      createdAt: new Date().toISOString(),
    };
    await setDoc(encDocRef, meta);

    setEncMeta(meta);
    setDataKey(newDataKey);
  }, [user, encDocRef]);

  // -----------------------------------------------------------------------
  // Unlock (returning session / new device)
  // -----------------------------------------------------------------------
  const unlockEncryption = useCallback(async (password: string) => {
    if (!encMeta) throw new Error('Encryption not set up');

    // 1. Derive the wrapping key from the password + stored salt
    const salt = b64ToBuf(encMeta.salt);
    const wrappingKey = await deriveKey(password, salt);

    // 2. Unwrap the data key
    try {
      const key = await unwrapDataKey(encMeta.wrappedKey, encMeta.iv, wrappingKey);
      setDataKey(key);
    } catch {
      throw new Error('Wrong encryption password');
    }
  }, [encMeta]);

  // -----------------------------------------------------------------------
  // Lock
  // -----------------------------------------------------------------------
  const lockEncryption = useCallback(() => {
    setDataKey(null);
  }, []);

  // -----------------------------------------------------------------------
  // Value
  // -----------------------------------------------------------------------
  const value: CryptoContextValue = {
    dataKey,
    isEncryptionEnabled: !!encMeta,
    isLoading,
    isLocked: !!encMeta && !dataKey,
    setupEncryption,
    unlockEncryption,
    lockEncryption,
  };

  return <CryptoContext.Provider value={value}>{children}</CryptoContext.Provider>;
}

export function useCrypto(): CryptoContextValue {
  const ctx = useContext(CryptoContext);
  if (!ctx) throw new Error('useCrypto must be used within CryptoProvider');
  return ctx;
}
