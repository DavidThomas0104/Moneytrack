'use client';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>
        {children}
        <Toaster position="bottom-right" toastOptions={{
          duration: 4000,
          style: { background: '#1a2332', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', fontSize: '0.875rem', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' },
          success: { iconTheme: { primary: '#10b981', secondary: '#1a2332' } },
          error: { iconTheme: { primary: '#f43f5e', secondary: '#1a2332' } },
        }} />
      </AppProvider>
    </AuthProvider>
  );
}
