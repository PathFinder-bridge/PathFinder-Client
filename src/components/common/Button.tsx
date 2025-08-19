'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'kakao' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
         children,
         variant = 'primary',
         size = 'md',
         isLoading = false,
         leftIcon,
         rightIcon,
         className = '',
         disabled,
         ...props
     }, ref) => {
        const baseClassName = "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

        const variantStyles = {
            primary: "bg-slate-700 hover:bg-slate-800 text-white focus:ring-slate-500",
            secondary: "bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-500",
            kakao: "bg-yellow-400 hover:bg-yellow-500 text-black focus:ring-yellow-500",
            outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500"
        };

        const sizeStyles = {
            sm: "px-3 py-2 text-sm",
            md: "px-4 py-3 text-sm",
            lg: "px-6 py-4 text-base"
        };

        const finalClassName = `${baseClassName} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

        return (
            <button
                ref={ref}
                className={finalClassName}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                ) : leftIcon ? (
                    <span className="mr-2">{leftIcon}</span>
                ) : null}

                {children}

                {rightIcon && !isLoading && (
                    <span className="ml-2">{rightIcon}</span>
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';