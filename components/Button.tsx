import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  disabled,
  ...props 
}) => {
  const baseStyles = "font-bold uppercase tracking-wider transition-all duration-100 ease-in-out border-2 active:translate-y-1 active:translate-x-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none font-mono";
  
  const variants = {
    primary: "bg-[#E91E63] text-white border-white hover:bg-[#C2185B] shadow-[4px_4px_0px_0px_#FFFFFF]",
    secondary: "bg-[#FFFF00] text-black border-white hover:bg-[#FFD600] shadow-[4px_4px_0px_0px_#FFFFFF]",
    outline: "bg-transparent text-white border-white hover:bg-white hover:text-black shadow-[4px_4px_0px_0px_#FFFFFF]",
    danger: "bg-red-600 text-white border-white hover:bg-red-700 shadow-[4px_4px_0px_0px_#FFFFFF]"
  };

  const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-6 py-2 text-sm",
    lg: "px-8 py-4 text-base"
  };

  return (
    <button 
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;