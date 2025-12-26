/**
 * Text utility functions for normalization and parsing
 */

/**
 * Normalizes text (converts to lowercase, removes punctuation)
 * @param {string} word - Word to normalize
 * @returns {string} Normalized word
 */
export function normalizeWord(word) {
    if (!word) return '';
    return word.toLowerCase()
        .replace(/[.,!?;:'"()\[\]{}]/g, '') // Remove all punctuation marks
        .replace(/\s+/g, ' ') // Convert multiple spaces to single space
        .trim();
}

/**
 * Splits text into words
 * @param {string} text - Text to split into words
 * @returns {string[]} Array of words
 */
export function parseText(text) {
    if (!text) return [];
    return text.split(/\s+/).filter(word => word.trim());
}

/**
 * Calculates similarity ratio between two words (simplified)
 * @param {string} word1 - First word
 * @param {string} word2 - Second word
 * @returns {number} Similarity ratio (0-1)
 */
export function calculateSimilarity(word1, word2) {
    if (!word1 || !word2) return 0;
    if (word1 === word2) return 1;
    
    const longer = word1.length > word2.length ? word1 : word2;
    const shorter = word1.length > word2.length ? word2 : word1;
    
    // Very different lengths result in low similarity
    if (longer.length === 0) return 1;
    if (longer.length - shorter.length > longer.length * 0.5) return 0;
    
    // Calculate common character count
    let commonChars = 0;
    const shorterChars = shorter.split('');
    const longerChars = longer.split('');
    
    for (let i = 0; i < shorter.length; i++) {
        if (longerChars.includes(shorterChars[i])) {
            commonChars++;
            const index = longerChars.indexOf(shorterChars[i]);
            longerChars.splice(index, 1);
        }
    }
    
    // Similarity = common characters / total characters
    return commonChars / longer.length;
}

