'use client';

import { useState, useId } from 'react';
import styles from './Input.module.css';

interface InputProps {
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  icon?: React.ReactNode;
}

export default function Input({ label, type = 'text', value, onChange, error, placeholder, icon }: InputProps) {
  const [focused, setFocused] = useState(false);
  const id = useId();
  const hasValue = value !== '' && value !== undefined && value !== null;

  const wrapperClass = [
    styles.wrapper,
    error ? styles.hasError : '',
  ].filter(Boolean).join(' ');

  const labelClass = [
    styles.label,
    icon ? styles.labelWithIcon : '',
    (focused || hasValue) ? styles.floated : '',
  ].filter(Boolean).join(' ');

  const inputClass = [
    styles.input,
    icon ? styles.withIcon : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={focused ? placeholder : ' '}
        className={inputClass}
        autoComplete="off"
      />
      <label htmlFor={id} className={labelClass}>{label}</label>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}