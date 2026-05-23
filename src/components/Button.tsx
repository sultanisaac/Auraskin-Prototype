import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
}

export const Button = ({ children, variant = 'primary', className = '', ...props }: ButtonProps) => {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-md px-6 py-3";
  const variants = {
    primary: "bg-primary text-white hover:bg-opacity-90 shadow-lg hover:shadow-xl",
    secondary: "bg-secondary text-white hover:bg-opacity-90 shadow-md",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-primary hover:bg-primary/10"
  };
  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};
