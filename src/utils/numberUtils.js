/**
 * Number processing and conversions for Turkish numbers
 */

import { TURKISH_NUMBER_MAP, NUMBER_TO_TURKISH } from '../config/speechConfig.js';
import { normalizeWord } from './textUtils.js';

/**
 * Converts Turkish number word to digit
 * @param {string} word - Number word (e.g., "beş" or "5")
 * @returns {string} Digit (e.g., "5") or original word
 */
export function turkishNumberToDigit(word) {
    if (!word) return word;
    const normalized = normalizeWord(word);
    
    // If already a digit, return directly
    if (/^\d+$/.test(normalized)) {
        return normalized;
    }
    
    // Search in Turkish number dictionary
    if (TURKISH_NUMBER_MAP[normalized]) {
        return TURKISH_NUMBER_MAP[normalized];
    }
    
    // Return normalized word (not original) to ensure consistency
    return normalized;
}

/**
 * Checks if a word is a number
 * @param {string} word - Word to check
 * @returns {boolean} Is it a number?
 */
export function isNumber(word) {
    if (!word) return false;
    const normalized = normalizeWord(word);
    
    // Is it a digit?
    if (/^\d+$/.test(normalized)) {
        return true;
    }
    
    // Is it a Turkish number?
    if (TURKISH_NUMBER_MAP[normalized]) {
        return true;
    }
    
    return false;
}

/**
 * Converts digit to Turkish number word
 * @param {string} word - Digit (e.g., "5")
 * @returns {string} Turkish number (e.g., "beş") or original word
 */
export function digitToTurkishNumber(word) {
    if (!word) return word;
    return NUMBER_TO_TURKISH[word] || word;
}

/**
 * Extracts number part from recognized word (e.g., "üçyıl" -> "üç")
 * @param {string} recognizedWord - Recognized word
 * @returns {string|null} Number part or null
 */
export function extractNumberFromWord(recognizedWord) {
    if (!recognizedWord) return null;
    
    const normalized = normalizeWord(recognizedWord);
    
    // First check if it's a direct number
    if (isNumber(normalized)) {
        return normalized;
    }
    
    // Check for Turkish number prefixes
    // Examples: "üçyıl", "üç yıl", "3yıl", "3 yıl"
    // Check in length order to find longest match
    const numberMatches = [];
    
    for (const [turkishNum, digit] of Object.entries(TURKISH_NUMBER_MAP)) {
        // Does it start with Turkish number?
        if (normalized.startsWith(turkishNum)) {
            const remaining = normalized.substring(turkishNum.length);
            // If remaining part is empty or starts with space/word
            if (remaining.length === 0 || remaining.trim().length === 0 || /^[a-zğüşıöç]/.test(remaining.trim())) {
                numberMatches.push({ number: turkishNum, length: turkishNum.length });
            }
        }
        
        // Does it start with digit?
        if (normalized.startsWith(digit)) {
            const remaining = normalized.substring(digit.length);
            // If remaining part is empty or starts with space/word
            if (remaining.length === 0 || remaining.trim().length === 0 || /^[a-zğüşıöç]/.test(remaining.trim())) {
                numberMatches.push({ number: digit, length: digit.length });
            }
        }
    }
    
    // Return longest match (for more specific matching)
    if (numberMatches.length > 0) {
        numberMatches.sort((a, b) => b.length - a.length);
        return numberMatches[0].number;
    }
    
    return null;
}

