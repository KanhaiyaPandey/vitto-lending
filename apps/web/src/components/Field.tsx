import React from 'react';

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export function Field({ label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-mono font-medium text-muted uppercase tracking-widest">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 font-mono">{error}</p>}
    </div>
  );
}

const inputClass =
  'border border-border bg-white rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition placeholder:text-gray-300';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function Input({ hasError, className = '', ...props }: InputProps) {
  return (
    <input
      className={`${inputClass} ${hasError ? 'border-red-400' : ''} ${className}`}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export function Select({ hasError, className = '', children, ...props }: SelectProps) {
  return (
    <select
      className={`${inputClass} ${hasError ? 'border-red-400' : ''} ${className} appearance-none`}
      {...props}
    >
      {children}
    </select>
  );
}
