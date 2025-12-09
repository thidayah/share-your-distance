import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
  
  const variants = {
    primary: 'bg-zinc-100 text-white hover:bg-zinc-100 focus:ring-zinc-100 shadow-lg hover:shadow-xl transform hover:scale-105',
    secondary: 'bg-secondary-100 text-white hover:bg-secondary-300 focus:ring-secondary-100 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-zinc-100 text-zinc-100 hover:bg-zinc-100 hover:text-zinc-900 focus:ring-zinc-100',
    ghost: 'text-zinc-100 hover:bg-zinc-50 focus:ring-zinc-100'
  };
  // const variants = {
  //   primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-lg hover:shadow-xl transform hover:scale-105',
  //   secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500 shadow-lg hover:shadow-xl',
  //   outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white focus:ring-primary-500',
  //   ghost: 'text-primary-500 hover:bg-primary-50 focus:ring-primary-500'
  // };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-4 py-2 text-sm md:px-6 md:py-3 md:text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${widthClass}
        ${className}
        ${isLoading ? 'opacity-70 cursor-wait' : ''}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}