/**
 * React hook for word-by-word checking and matching
 * Handles word matching logic, progress tracking, and error management
 */

import { useState, useCallback, useRef } from 'react';
import { normalizeWord } from '../utils/textUtils.js';
import { turkishNumberToDigit, isNumber, extractNumberFromWord, digitToTurkishNumber } from '../utils/numberUtils.js';
import { wordsMatch } from '../utils/wordMatcher.js';
import { CONFIG } from '../config/speechConfig.js';

/**
 * Custom hook for word checking
 * @param {string[]} expectedWords - Array of expected words to match
 * @param {Object} options - Configuration options
 * @param {Function} options.onComplete - Callback when all words are matched
 * @param {Function} options.onError - Callback when word mismatch occurs
 * @returns {Object} Word checking state and controls
 */
export function useWordChecker(expectedWords = [], {
    onComplete = null,
    onError = null,
} = {}) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [matchedWords, setMatchedWords] = useState([]);
    const [errorIndex, setErrorIndex] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isComplete, setIsComplete] = useState(false);

    const recognizedWordsRef = useRef([]);
    const lastProcessedWordIndexRef = useRef(-1);
    const currentWordIndexRef = useRef(0); // Ref to track current index for closure issues
    const errorIndexRef = useRef(null); // Ref to track error index for closure issues
    const processingBatchRef = useRef(0); // Track batch processing to prevent stack overflow

    /**
     * Checks if recognized word matches a previous word (to prevent repetition)
     * BUT: If the expected word at current index is the same, it's not a repetition - it's correct!
     */
    const isPreviousWord = useCallback((recognizedWord, currentIdx) => {
        if (currentIdx <= 0) return false;

        // First check: Is the recognized word the same as the expected word at current index?
        // If yes, it's not a repetition - it's the correct word!
        const expectedWord = expectedWords[currentIdx];
        if (wordsMatch(expectedWord, recognizedWord)) {
            return false; // Not a repetition, it's the correct word
        }

        // Second check: Does it match a previous word (and NOT the current expected word)?
        const checkRange = Math.min(3, currentIdx);
        for (let i = currentIdx - checkRange; i < currentIdx; i++) {
            if (i >= 0 && wordsMatch(expectedWords[i], recognizedWord)) {
                // Make sure it's not the same as current expected word
                if (!wordsMatch(expectedWord, recognizedWord)) {
                    return true; // It's a repetition of a previous word
                }
            }
        }
        return false;
    }, [expectedWords]);

    /**
     * Handles word mismatch
     */
    const handleWrongWord = useCallback((expectedWord, recognizedWord, customMessage = null, wordIndex = null) => {
        const message = customMessage ||
            `❌ Yanlış! Beklenen: "${expectedWord}", Okunan: "${recognizedWord}". Lütfen tekrar deneyin.`;
        
        const errorIdx = wordIndex !== null ? wordIndex : currentWordIndexRef.current;
        errorIndexRef.current = errorIdx;
        setErrorMessage(message);
        setErrorIndex(errorIdx);
        recognizedWordsRef.current = [];

        if (onError) {
            onError({
                expectedWord,
                recognizedWord,
                index: errorIdx,
                message,
            });
        }
    }, [onError]);

    /**
     * Checks recognized words against expected words
     */
    const checkWords = useCallback((newRecognizedWords) => {
        if (!newRecognizedWords || newRecognizedWords.length === 0) return;

        // Add new words to recognized words list
        recognizedWordsRef.current = [...recognizedWordsRef.current, ...newRecognizedWords];
        
        console.log('[Word Checker] New words added. Total recognized words:', recognizedWordsRef.current.length);
        console.log('[Word Checker] Current word index:', currentWordIndexRef.current);
        console.log('[Word Checker] Error index:', errorIndexRef.current);

        // Process words
        const processNextWord = () => {
            // Use ref to get current index (avoids closure issues)
            const currentIdx = currentWordIndexRef.current;
            
            if (currentIdx >= expectedWords.length || recognizedWordsRef.current.length === 0) {
                processingBatchRef.current = 0; // Reset batch counter
                return;
            }

            // Prevent stack overflow - limit batch processing
            if (processingBatchRef.current >= CONFIG.MAX_BATCH_PROCESSING) {
                processingBatchRef.current = 0;
                // Use setTimeout with minimal delay to allow other operations
                setTimeout(processNextWord, 0);
                return;
            }
            processingBatchRef.current++;
            
            // If there's an error, still try to process words (user might be correcting)
            // Don't skip processing just because there's an error
            // Error will be cleared automatically when word matches

            const expectedWord = expectedWords[currentIdx];
            const recognizedWord = recognizedWordsRef.current[0];

            const normalizedRecognized = normalizeWord(recognizedWord);
            if (!normalizedRecognized || normalizedRecognized.length < 2) {
                recognizedWordsRef.current.shift();
                if (recognizedWordsRef.current.length > 0) {
                    // Direct call for faster processing
                    processNextWord();
                } else {
                    processingBatchRef.current = 0;
                }
                return;
            }

            const normalizedExpected = normalizeWord(expectedWord);
            
            // IMPORTANT: Check match FIRST before checking repetition
            // If the recognized word matches the current expected word, it's correct, not a repetition!
            const matchResult = wordsMatch(expectedWord, recognizedWord);
            
            // Only check for repetition if it doesn't match the current word
            if (!matchResult) {
                const isRepetition = isPreviousWord(recognizedWord, currentIdx);
                if (isRepetition) {
                    console.log(`[Word Checker] Skipping repetition: "${recognizedWord}" at index ${currentIdx} (expected: "${expectedWord}")`);
                    recognizedWordsRef.current.shift();
                    if (recognizedWordsRef.current.length > 0) {
                        // Direct call for faster processing
                        processNextWord();
                    } else {
                        processingBatchRef.current = 0;
                    }
                    return;
                }
            }
            const expectedAsNumber = turkishNumberToDigit(normalizedExpected);
            const isExpectedNumber = isNumber(normalizedExpected);

            // Special case: Number expected, but next words detected
            if (isExpectedNumber && currentIdx < expectedWords.length - 1) {
                const nextWords = expectedWords.slice(currentIdx + 1, Math.min(currentIdx + 4, expectedWords.length));
                const nextWordsNormalized = nextWords.map(w => normalizeWord(w));

                if (nextWordsNormalized.includes(normalizedRecognized)) {
                    // Look for number in recognized words
                    for (let i = 0; i < recognizedWordsRef.current.length && i < 10; i++) {
                        const laterWord = recognizedWordsRef.current[i];
                        const normalizedLater = normalizeWord(laterWord);
                        const laterAsNumber = turkishNumberToDigit(normalizedLater);

                        if (isNumber(normalizedLater) && laterAsNumber === expectedAsNumber) {
                            // Found the number, remove words before it
                            for (let j = 0; j < i; j++) {
                                recognizedWordsRef.current.shift();
                            }
                            return;
                        }

                        const extractedNumber = extractNumberFromWord(normalizedLater);
                        if (extractedNumber) {
                            const extractedAsNumber = turkishNumberToDigit(extractedNumber);
                            if (extractedAsNumber === expectedAsNumber) {
                                for (let j = 0; j < i; j++) {
                                    recognizedWordsRef.current.shift();
                                }
                                recognizedWordsRef.current[0] = extractedNumber;
                                const remaining = normalizedLater.substring(extractedNumber.length).trim();
                                if (remaining && remaining.length >= 2) {
                                    recognizedWordsRef.current.splice(1, 0, remaining);
                                }
                                return;
                            }
                        }
                    }

                    recognizedWordsRef.current.shift();
                    if (recognizedWordsRef.current.length > 0) {
                        // Direct call for faster processing
                        processNextWord();
                    } else {
                        processingBatchRef.current = 0;
                    }
                    return;
                }
            }

            // Special case: Word after number
            if (!isExpectedNumber && currentIdx > 0) {
                const previousWord = expectedWords[currentIdx - 1];
                const isPreviousNumber = isNumber(normalizeWord(previousWord));

                if (isPreviousNumber) {
                    if (normalizedRecognized.includes(normalizedExpected) ||
                        normalizedExpected.includes(normalizedRecognized)) {
                        // Match found
                        const newIndex = currentIdx + 1;
                        currentWordIndexRef.current = newIndex;
                        setCurrentWordIndex(newIndex);
                        setMatchedWords(prev => [...prev, expectedWord]);
                        lastProcessedWordIndexRef.current = currentIdx;
                        recognizedWordsRef.current.shift();
                        
                        // Clear error state if there was an error (user corrected it)
                        if (errorIndexRef.current !== null && errorIndexRef.current === currentIdx) {
                            errorIndexRef.current = null;
                            setErrorIndex(null);
                            setErrorMessage(null);
                            console.log('[Word Checker] Error cleared - user corrected the word');
                        }

                        if (newIndex >= expectedWords.length) {
                            setIsComplete(true);
                            if (onComplete) {
                                onComplete();
                            }
                            return;
                        }

                        if (recognizedWordsRef.current.length > 0) {
                            // Direct call for faster processing
                            processNextWord();
                        } else {
                            processingBatchRef.current = 0;
                        }
                        return;
                    }
                }
            }

            // matchResult already calculated above, use it here
            console.log(`[Word Checker] Index: ${currentIdx}, Expected: "${expectedWord}" (normalized: "${normalizeWord(expectedWord)}"), Recognized: "${recognizedWord}" (normalized: "${normalizeWord(recognizedWord)}"), Match: ${matchResult}`);
            console.log(`[Word Checker] Error index: ${errorIndexRef.current}, Current index: ${currentIdx}`);

            if (matchResult) {
                // Match found - advance
                const newIndex = currentIdx + 1;
                currentWordIndexRef.current = newIndex;
                setCurrentWordIndex(newIndex);
                setMatchedWords(prev => [...prev, expectedWord]);
                lastProcessedWordIndexRef.current = currentIdx;
                recognizedWordsRef.current.shift();
                
                // Clear error state if there was an error (user corrected it)
                // Always clear error when word matches - user has corrected it
                if (errorIndexRef.current !== null) {
                    console.log(`[Word Checker] Error cleared - word matched! Error was at index ${errorIndexRef.current}, matched at index ${currentIdx}`);
                    errorIndexRef.current = null;
                    setErrorIndex(null);
                    setErrorMessage(null);
                }

                // Check if complete
                if (newIndex >= expectedWords.length) {
                    setIsComplete(true);
                    if (onComplete) {
                        onComplete();
                    }
                    return;
                }

                // Process next word if available - direct call for immediate processing
                if (recognizedWordsRef.current.length > 0) {
                    if (CONFIG.RECURSIVE_CHECK_DELAY > 0) {
                        setTimeout(processNextWord, CONFIG.RECURSIVE_CHECK_DELAY);
                    } else {
                        // Direct call for faster processing
                        processNextWord();
                    }
                } else {
                    processingBatchRef.current = 0;
                }
            } else {
                // No match - check if it's a significant error
                // First, check if recognized word might match a future word (skip ahead)
                // This handles cases where speech recognition gets words out of order
                let foundFutureMatch = false;
                const lookAheadRange = Math.min(5, expectedWords.length - currentIdx - 1);
                
                for (let i = 1; i <= lookAheadRange; i++) {
                    const futureWordIndex = currentIdx + i;
                    if (futureWordIndex < expectedWords.length) {
                        const futureWord = expectedWords[futureWordIndex];
                        if (wordsMatch(futureWord, recognizedWord)) {
                            console.log(`[Word Checker] Found future match: "${recognizedWord}" matches future word "${futureWord}" at index ${futureWordIndex}`);
                            // Skip this word and continue - it will be matched later
                            recognizedWordsRef.current.shift();
                            if (recognizedWordsRef.current.length > 0) {
                                // Direct call for faster processing
                                processNextWord();
                            } else {
                                processingBatchRef.current = 0;
                            }
                            foundFutureMatch = true;
                            break;
                        }
                    }
                }
                
                if (foundFutureMatch) {
                    return;
                }
                
                // No future match found - check if it's a significant error
                if (isExpectedNumber) {
                    const isCompletelyUnrelated =
                        normalizedRecognized.length > normalizedExpected.length + 2 ||
                        (normalizedRecognized.length >= 5 && !normalizedExpected.includes(normalizedRecognized));

                    if (isCompletelyUnrelated) {
                        recognizedWordsRef.current.shift();
                        if (recognizedWordsRef.current.length > 0) {
                            // Direct call for faster processing
                            processNextWord();
                        } else {
                            processingBatchRef.current = 0;
                        }
                        return;
                    }
                }

                const isSignificantlyDifferent =
                    normalizedRecognized.length >= 3 &&
                    normalizedExpected.length >= 3 &&
                    !normalizedExpected.includes(normalizedRecognized) &&
                    !normalizedRecognized.includes(normalizedExpected) &&
                    !normalizedExpected.startsWith(normalizedRecognized) &&
                    !normalizedRecognized.startsWith(normalizedExpected);

                if (isSignificantlyDifferent) {
                    if (isExpectedNumber) {
                        const turkishNumber = digitToTurkishNumber(expectedAsNumber);
                        handleWrongWord(
                            expectedWord,
                            recognizedWord,
                            `Sayı olarak algılanamadı. "${turkishNumber}" veya "${expectedAsNumber}" olarak söyleyin.`,
                            currentIdx
                        );
                    } else {
                        handleWrongWord(expectedWord, recognizedWord, null, currentIdx);
                    }
                } else {
                    // Not significantly different, skip and continue
                    recognizedWordsRef.current.shift();
                    if (recognizedWordsRef.current.length > 0) {
                        // Direct call for faster processing
                        processNextWord();
                    } else {
                        processingBatchRef.current = 0;
                    }
                }
            }
        };

        // Reset batch counter before starting
        processingBatchRef.current = 0;
        processNextWord();
    }, [expectedWords, isPreviousWord, handleWrongWord, onComplete]);

    /**
     * Reset word checker state
     */
    const reset = useCallback(() => {
        currentWordIndexRef.current = 0;
        errorIndexRef.current = null;
        processingBatchRef.current = 0;
        setCurrentWordIndex(0);
        setMatchedWords([]);
        setErrorIndex(null);
        setErrorMessage(null);
        setIsComplete(false);
        recognizedWordsRef.current = [];
        lastProcessedWordIndexRef.current = -1;
    }, []);

    /**
     * Clear error state
     */
    const clearError = useCallback(() => {
        errorIndexRef.current = null;
        processingBatchRef.current = 0;
        setErrorIndex(null);
        setErrorMessage(null);
        recognizedWordsRef.current = [];
    }, []);

    /**
     * Retry from a specific index
     */
    const retryFromIndex = useCallback((index) => {
        currentWordIndexRef.current = index;
        processingBatchRef.current = 0;
        setCurrentWordIndex(index);
        errorIndexRef.current = null;
        setErrorIndex(null);
        setErrorMessage(null);
        recognizedWordsRef.current = [];
        lastProcessedWordIndexRef.current = index - 1;
    }, []);

    return {
        currentWordIndex,
        matchedWords,
        errorIndex,
        errorMessage,
        isComplete,
        progress: expectedWords.length > 0 ? ((currentWordIndex) / expectedWords.length) * 100 : 0,
        checkWords,
        reset,
        clearError,
        retryFromIndex,
    };
}

