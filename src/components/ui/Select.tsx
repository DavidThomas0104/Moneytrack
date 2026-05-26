'use client';

import { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Select.module.css';

interface SelectOption { value: string; label: string; }

interface SelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  error?: string;
}

export default function Select({ label, value, onChange, options, error }: SelectProps) {
  const id = useId();
  const wrapperClass = [styles.wrapper, error ? styles.hasError : ''].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      <div className={styles.selectWrapper}>
        <select id={id} value={value} onChange={onChange} className={styles.select}>
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown size={16} className={styles.chevron} />
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}