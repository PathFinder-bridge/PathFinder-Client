import { useState, useCallback } from 'react';

interface ValidationRule {
    validator: (value: any) => boolean | { isValid: boolean; message?: string };
    message?: string;
}

interface FormValidationConfig {
    [fieldName: string]: ValidationRule;
}

interface ValidationResult {
    [fieldName: string]: string | null;
}

export const useFormValidation = (config: FormValidationConfig) => {
    const [errors, setErrors] = useState<ValidationResult>({});

    const validateField = useCallback((fieldName: string, value: any): string | null => {
        const rule = config[fieldName];
        if (!rule) return null;

        const result = rule.validator(value);

        if (typeof result === 'boolean') {
            return result ? null : (rule.message || '유효하지 않은 값입니다.');
        } else {
            return result.isValid ? null : (result.message || rule.message || '유효하지 않은 값입니다.');
        }
    }, [config]);

    const validateForm = useCallback((formData: Record<string, any>): boolean => {
        const newErrors: ValidationResult = {};
        let isValid = true;

        Object.keys(config).forEach(fieldName => {
            const error = validateField(fieldName, formData[fieldName]);
            newErrors[fieldName] = error;
            if (error) isValid = false;
        });

        setErrors(newErrors);
        return isValid;
    }, [config, validateField]);

    const validateSingleField = useCallback((fieldName: string, value: any) => {
        const error = validateField(fieldName, value);
        setErrors(prev => ({ ...prev, [fieldName]: error }));
        return !error;
    }, [validateField]);

    const clearErrors = useCallback(() => {
        setErrors({});
    }, []);

    const clearFieldError = useCallback((fieldName: string) => {
        setErrors(prev => ({ ...prev, [fieldName]: null }));
    }, []);

    return {
        errors,
        validateForm,
        validateSingleField,
        clearErrors,
        clearFieldError
    };
};