/**
 * Word matching logic with Turkish number support
 */

import { normalizeWord, calculateSimilarity } from './textUtils.js';
import { turkishNumberToDigit, isNumber, extractNumberFromWord } from './numberUtils.js';
import { CONFIG } from '../config/speechConfig.js';

/**
 * Checks if two words match (supports numbers)
 * @param {string} expectedWord - Expected word
 * @param {string} recognizedWord - Recognized word
 * @returns {boolean} Match status
 */
export function wordsMatch(expectedWord, recognizedWord) {
    if (!expectedWord || !recognizedWord) return false;
    
    const normalizedExpected = normalizeWord(expectedWord);
    const normalizedRecognized = normalizeWord(recognizedWord);
    
    // Direct match check (check first)
    if (normalizedExpected === normalizedRecognized) {
        console.log(`[Word Matcher] Direct match: "${normalizedExpected}" === "${normalizedRecognized}"`);
        return true;
    }
    
    // Debug: Log what we're comparing (only for non-matching words to reduce noise)
    // console.log(`[Word Matcher] Comparing: "${expectedWord}" (norm: "${normalizedExpected}") <-> "${recognizedWord}" (norm: "${normalizedRecognized}")`);
    
    // IMPORTANT: Check prefix match BEFORE number check
    // This handles cases like "on" (recognized) -> "ona" (expected)
    // where speech recognition cuts off the last letter
    if (normalizedExpected.startsWith(normalizedRecognized) && 
        normalizedRecognized.length >= 2 && 
        normalizedExpected.length - normalizedRecognized.length <= 2) {
        console.log(`[Word Matcher] Prefix match (before number check): "${normalizedExpected}" starts with "${normalizedRecognized}"`);
        return true;
    }
    
    // Number conversion match check
    const expectedAsNumber = turkishNumberToDigit(normalizedExpected);
    const recognizedAsNumber = turkishNumberToDigit(normalizedRecognized);
    
    // Is expected word a number?
    const isExpectedNumber = isNumber(normalizedExpected);
    // Is recognized word a number?
    const isRecognizedNumber = isNumber(normalizedRecognized);
    
    // Number comparison: If at least one is a number and number values are equal
    if (isExpectedNumber || isRecognizedNumber) {
        // At least one is a number, compare number values
        if (expectedAsNumber === recognizedAsNumber) {
            return true;
        }
        
        // If expected word is a number and recognized word contains number + other words
        // Example: "üç" expected, "üçyıl" or "üç yıl" recognized
        if (isExpectedNumber) {
            const extractedNumber = extractNumberFromWord(recognizedWord);
            if (extractedNumber) {
                const extractedAsNumber = turkishNumberToDigit(extractedNumber);
                if (expectedAsNumber === extractedAsNumber) {
                    console.log('Number combination match found:', expectedWord, '->', recognizedWord, '(extracted number:', extractedNumber, ')');
                    return true;
                }
            }
        }
    }
    
    // Normal word matching (partial matches) - only if not a number
    // If neither is a number, do normal word matching
    if (!isExpectedNumber && !isRecognizedNumber) {
        // Both are not numbers, normal word matching
        
        // STRICT: Only allow prefix match if recognized word is a prefix of expected
        // This handles cases like "on" -> "ona" where speech recognition cuts off last letter
        // But NOT cases like "yürümeyi" -> "gezmeyi" (completely different words)
        if (normalizedExpected.startsWith(normalizedRecognized) && 
            normalizedRecognized.length >= 2 && 
            normalizedExpected.length - normalizedRecognized.length <= 2) {
            console.log(`[Word Matcher] Prefix match: "${normalizedExpected}" starts with "${normalizedRecognized}"`);
            return true;
        }
        
        // STRICT: Only allow if recognized word contains expected word (for compound words)
        // Example: "üçyıl" contains "üç" - but only if expected is short (3-4 chars)
        if (normalizedRecognized.includes(normalizedExpected) && 
            normalizedExpected.length >= 3 && 
            normalizedExpected.length <= 4) {
            console.log(`[Word Matcher] Inclusion match: "${normalizedRecognized}" contains "${normalizedExpected}"`);
            return true;
        }
        
        // NO FUZZY MATCHING - Only exact or prefix matches allowed
        // This prevents false matches like "gezmeyi" vs "yürümeyi"
        // User must say the correct word or a valid prefix
    }
    
    return false;
}

