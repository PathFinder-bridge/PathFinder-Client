import { useState, useCallback } from 'react';

// 유효성 검사 함수들
export const validators = {
    email: (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    password: (password: string): { isValid: boolean; message?: string } => {
        if (password.length < 8) {
            return { isValid: false, message: '비밀번호는 8자 이상이어야 합니다.' };
        }

        if (password.length > 20) {
            return { isValid: false, message: '비밀번호는 20자 이하여야 합니다.' };
        }

        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return {
                isValid: false,
                message: '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.'
            };
        }

        return { isValid: true };
    },

    verificationCode: (code: string): boolean => {
        const codeRegex = /^[0-9]{6}$/;
        return codeRegex.test(code);
    },

    nickname: (nickname: string): { isValid: boolean; message?: string } => {
        if (!nickname.trim()) {
            return { isValid: false, message: '이름을 입력해주세요.' };
        }

        if (nickname.length < 2) {
            return { isValid: false, message: '이름은 2자 이상이어야 합니다.' };
        }

        if (nickname.length > 10) {
            return { isValid: false, message: '이름은 10자 이하여야 합니다.' };
        }

        return { isValid: true };
    }
};

// useFormValidation 훅
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