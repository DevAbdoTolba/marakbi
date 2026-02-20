/**
 * Shared validation utilities for Egyptian phone numbers and email addresses.
 */

// Egyptian phone: +20 / 0020 / 20 / 0 followed by 10/11/12/15 then 8 digits
const EGYPT_PHONE_REGEX = /^(\+20|0020|20|0)(1[0125]\d{8})$/;

// Standard email pattern
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validates an Egyptian phone number.
 * Accepts formats: +201xxxxxxxxx, 00201xxxxxxxxx, 201xxxxxxxxx, 01xxxxxxxxx
 * Valid operator prefixes: 10, 11, 12, 15
 */
export function validateEgyptianPhone(phone: string): boolean {
    if (!phone) return false;
    const cleaned = phone.replace(/[\s\-()]/g, '');
    return EGYPT_PHONE_REGEX.test(cleaned);
}

/**
 * Validates an email address format.
 */
export function validateEmail(email: string): boolean {
    if (!email) return false;
    return EMAIL_REGEX.test(email.trim());
}

// Error message constants
export const VALIDATION_MESSAGES = {
    INVALID_PHONE: 'Please enter a valid Egyptian phone number (e.g. 01012345678)',
    INVALID_EMAIL: 'Please enter a valid email address',
    REQUIRED_PHONE: 'Phone number is required',
    REQUIRED_EMAIL: 'Email is required',
} as const;
