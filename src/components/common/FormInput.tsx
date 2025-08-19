'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string | null;
    helperText?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, helperText, className = '', ...props }, ref) => {
        const baseClassName = "w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors";
        const errorClassName = error
            ? "border-red-300 focus:ring-red-500"
            : "border-gray-300 focus:ring-blue-500";

        const inputClassName = `${baseClassName} ${errorClassName} ${className}`;

        return (
            <div className="space-y-1">
                {label && (
                    <label className="block text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={inputClassName}
                    {...props}
                />
                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}
                {helperText && !error && (
                    <p className="text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

FormInput.displayName = 'FormInput';