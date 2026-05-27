'use client';

import { useAuth } from '@/context/AuthContext';
import { useCrypto } from '@/context/CryptoContext';
import EncryptionSetup from '@/components/EncryptionSetup';
import EncryptionUnlock from '@/components/EncryptionUnlock';

interface EncryptionGateProps {
  children: React.ReactNode;
}

/**
 * EncryptionGate sits between CryptoProvider and AppProvider.
 * - If user is logged in and hasn't set up encryption => shows EncryptionSetup modal.
 * - If user is logged in and encryption is locked => shows EncryptionUnlock modal.
 * - Otherwise => renders children normally.
 */
export default function EncryptionGate({ children }: EncryptionGateProps) {
  const { user, loading: authLoading } = useAuth();
  const { isEncryptionEnabled, isLocked, isLoading: cryptoLoading } = useCrypto();

  // Don't block during auth or crypto loading
  if (authLoading || cryptoLoading) {
    return <>{children}</>;
  }

  // Not logged in — let the auth pages render
  if (!user) {
    return <>{children}</>;
  }

  // Logged in, no encryption set up — prompt to set up
  if (!isEncryptionEnabled) {
    return <EncryptionSetup />;
  }

  // Logged in, encryption enabled but locked — prompt to unlock
  if (isLocked) {
    return <EncryptionUnlock />;
  }

  // Encryption unlocked — render the app normally
  return <>{children}</>;
}
