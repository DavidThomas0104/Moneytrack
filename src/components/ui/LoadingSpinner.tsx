'use client';

import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = { sm: 24, md: 40, lg: 56 };

export default function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  const px = sizeMap[size];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: px, height: px, border: '3px solid rgba(124,58,237,0.2)', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
}