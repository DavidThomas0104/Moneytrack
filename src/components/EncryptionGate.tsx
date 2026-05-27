'use client';

import { useAuth } from '@/context/AuthContext';
import { useCrypto } from '@/context/CryptoContext';

interface EncryptionGateProps {
  children: React.ReactNode;
}

/**
 * EncryptionGate sits between CryptoProvider and AppProvider.
 * Encryption is now tied to the login password — no separate modals.
 * This gate just ensures we wait for crypto to initialize before rendering.
 */
export default function EncryptionGate({ children }: EncryptionGateProps) {
  const { user, loading: authLoading } = useAuth();
  const { isLoading: cryptoLoading } = useCrypto();

  // Show nothing while auth or crypto are initializing (prevents flash)
  if (authLoading || (user && cryptoLoading)) {
    return null;
  }

  return <>{children}</>;
}
