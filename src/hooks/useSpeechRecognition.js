/**
 * React hook for Web Speech API integration
 * Handles speech recognition initialization, events, and state management
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { normalizeWord } from '../utils/textUtils.js';
import { extractNumberFromWord } from '../utils/numberUtils.js';
import { CONFIG } from '../config/speechConfig.js';

/**
 * Custom hook for speech recognition
 * @param {Object} options - Configuration options
 * @param {string} options.lang - Language code (default: 'tr-TR')
 * @param {boolean} options.continuous - Continuous recognition (default: true)
 * @param {boolean} options.interimResults - Include interim results (default: true)
 * @param {Function} options.onResult - Callback for recognition results
 * @param {Function} options.onError - Callback for errors
 * @param {Function} options.onFreeSpeech - Callback for free speech tracking
 * @returns {Object} Speech recognition state and controls
 */
export function useSpeechRecognition({
    lang = 'tr-TR',
    continuous = true,
    interimResults = true,
    onResult = null,
    onError = null,
    onFreeSpeech = null,
} = {}) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interim, setInterim] = useState('');
    const [error, setError] = useState(null);
    const [isSupported, setIsSupported] = useState(false);

    const recognitionRef = useRef(null);
    const allRecognizedTextRef = useRef('');
    const lastInterimTextRef = useRef('');
    const isListeningRef = useRef(false); // Ref to track listening state for onend handler
    const restartTimeoutRef = useRef(null); // Track restart timeout to prevent multiple restarts
    const isStartingRef = useRef(false); // Track if we're currently starting to prevent race conditions
    const isManualRestartRef = useRef(false); // Track if restart is manual to prevent auto-restart conflict

    // Initialize speech recognition
    useEffect(() => {
        // Check browser support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setIsSupported(false);
            setError('Speech Recognition API is not supported in this browser');
            return;
        }

        setIsSupported(true);

        // Create recognition instance
        const recognition = new SpeechRecognition();
        recognition.lang = lang;
        recognition.continuous = continuous;
        recognition.interimResults = interimResults;

        // Handle recognition results
        recognition.onresult = (event) => {
            console.log('[SpeechRecognition] onresult event triggered, resultIndex:', event.resultIndex, 'results length:', event.results.length);
            let interimTranscript = '';
            let finalTranscript = '';
            let hasNewFinal = false;
            let hasAnyFinal = false;

            // Process all results
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                const isFinal = event.results[i].isFinal;
                console.log('[SpeechRecognition] Result', i, ':', transcript, 'isFinal:', isFinal);
                if (isFinal) {
                    finalTranscript += transcript + ' ';
                    hasNewFinal = true;
                    hasAnyFinal = true;
                } else {
                    interimTranscript += transcript;
                }
            }
            
            // If we have any final results, prioritize them over interim
            if (hasAnyFinal) {
                interimTranscript = ''; // Clear interim when we have final results
            }

            // Update free speech tracking
            if (onFreeSpeech) {
                if (finalTranscript) {
                    // Remove previous interim from free speech
                    if (lastInterimTextRef.current) {
                        const currentText = allRecognizedTextRef.current;
                        const lastInterimIndex = currentText.lastIndexOf(`[${lastInterimTextRef.current}]`);
                        if (lastInterimIndex !== -1) {
                            allRecognizedTextRef.current = currentText.substring(0, lastInterimIndex).trim();
                        }
                        lastInterimTextRef.current = '';
                    }
                    // Add final text
                    allRecognizedTextRef.current += (allRecognizedTextRef.current ? ' ' : '') + finalTranscript.trim();
                    onFreeSpeech(allRecognizedTextRef.current, true);
                } else if (interimTranscript && interimTranscript.trim().length > 2) {
                    // Update interim text
                    if (lastInterimTextRef.current) {
                        const currentText = allRecognizedTextRef.current;
                        const lastInterimIndex = currentText.lastIndexOf(`[${lastInterimTextRef.current}]`);
                        if (lastInterimIndex !== -1) {
                            allRecognizedTextRef.current = currentText.substring(0, lastInterimIndex).trim();
                        }
                    }
                    lastInterimTextRef.current = interimTranscript.trim();
                    allRecognizedTextRef.current += (allRecognizedTextRef.current ? ' ' : '') + `[${interimTranscript.trim()}]`;
                    onFreeSpeech(allRecognizedTextRef.current, false);
                }
            }

            // Process final transcript into words
            // IMPORTANT: If we have final results, process them even if finalTranscript is empty
            // Use interimTranscript if finalTranscript is empty but we have final results
            const processedWords = [];
            const textToProcess = finalTranscript || (hasAnyFinal ? interimTranscript : '');
            
            if (textToProcess) {
                const words = textToProcess.trim().split(/\s+/);
                
                for (const word of words) {
                    const normalized = normalizeWord(word);
                    if (!normalized) continue;

                    const extractedNumber = extractNumberFromWord(normalized);
                    if (extractedNumber && extractedNumber !== normalized) {
                        processedWords.push(extractedNumber);
                        
                        let remaining = normalized.substring(extractedNumber.length).trim();
                        remaining = remaining.replace(/^\s+|\s+$/g, '').replace(/^\d+/, '');

                        while (remaining && remaining.length >= 2) {
                            const nextExtracted = extractNumberFromWord(remaining);
                            if (nextExtracted && nextExtracted !== remaining) {
                                processedWords.push(nextExtracted);
                                remaining = remaining.substring(nextExtracted.length).trim();
                            } else {
                                processedWords.push(remaining);
                                break;
                            }
                        }
                    } else {
                        processedWords.push(normalized);
                    }
                }
            }

            // Update state
            setTranscript(prev => {
                const newTranscript = (prev + ' ' + finalTranscript).trim();
                return newTranscript;
            });
            setInterim(interimTranscript);

            // Call onResult callback with processed words
            // ALWAYS process final words - they are the source of truth
            // Process even if finalTranscript is empty but we have final results
            if (onResult && hasAnyFinal && processedWords.length > 0) {
                console.log('[Speech Recognition] Processed words (final):', processedWords, 'from text:', textToProcess);
                onResult({
                    finalTranscript: finalTranscript || interimTranscript,
                    interimTranscript,
                    processedWords,
                    hasNewFinal: true,
                });
            }
            
            // Process interim results ONLY if no final results and only for the last word
            // This reduces duplicate processing
            if (onResult && !hasNewFinal && !hasAnyFinal && interimTranscript && interimTranscript.trim().length >= CONFIG.INTERIM_MIN_LENGTH) {
                const interimWords = interimTranscript.trim().split(/\s+/);
                // Only process the last interim word if it's complete enough
                const lastInterimWord = interimWords[interimWords.length - 1];
                if (lastInterimWord && lastInterimWord.length >= CONFIG.INTERIM_MIN_LENGTH) {
                    const normalizedInterim = normalizeWord(lastInterimWord);
                    if (normalizedInterim && normalizedInterim.length >= CONFIG.INTERIM_MIN_LENGTH) {
                        // Process interim word for faster checking (but mark as interim)
                        const interimProcessedWords = [];
                        const extractedNumber = extractNumberFromWord(normalizedInterim);
                        if (extractedNumber && extractedNumber !== normalizedInterim) {
                            interimProcessedWords.push(extractedNumber);
                        } else {
                            interimProcessedWords.push(normalizedInterim);
                        }
                        
                        // Only send interim if it's a new word (not already processed)
                        if (interimProcessedWords.length > 0) {
                            console.log('[Speech Recognition] Processed words (interim):', interimProcessedWords);
                            onResult({
                                finalTranscript: '',
                                interimTranscript,
                                processedWords: interimProcessedWords,
                                hasNewFinal: false,
                                isInterim: true,
                            });
                        }
                    }
                }
            }
        };

        // Handle errors
        recognition.onerror = (event) => {
            // Ignore common non-critical errors
            if (event.error === 'no-speech') {
                return; // Ignore no-speech errors (user just not speaking)
            }
            
            if (event.error === 'aborted') {
                // Aborted errors are usually intentional (stop/restart)
                console.debug('Recognition aborted (likely intentional)');
                return;
            }

            console.error('Speech recognition error:', event.error);
            
            // Only set error for critical issues
            if (event.error === 'not-allowed') {
                setError('Microphone access is required! Please allow access in browser settings.');
            } else if (event.error === 'service-not-allowed') {
                setError('Speech recognition service is not available. Please check your browser settings.');
            } else if (event.error === 'network') {
                setError('Network error. Please check your internet connection.');
            } else if (event.error === 'audio-capture') {
                setError('No microphone found. Please connect a microphone.');
            } else {
                // For other errors, don't set error state (might be temporary)
                console.warn('Speech recognition warning:', event.error);
            }

            if (onError) {
                onError(event);
            }
        };

        // Handle recognition end
        recognition.onend = () => {
            const wasListening = isListeningRef.current;
            const isManualRestart = isManualRestartRef.current;
            setIsListening(false);
            isListeningRef.current = false;
            isStartingRef.current = false;
            
            // Clear any pending restart timeout
            if (restartTimeoutRef.current) {
                clearTimeout(restartTimeoutRef.current);
                restartTimeoutRef.current = null;
            }
            
            // If this is a manual restart, don't auto-restart (manual restart will handle it)
            if (isManualRestart) {
                console.log('[SpeechRecognition] Manual restart in progress, skipping auto-restart');
                isManualRestartRef.current = false; // Reset flag
                return;
            }
            
            // Auto-restart if was listening (for continuous mode)
            // Use the value before setting to false to avoid closure issues
            if (wasListening && recognitionRef.current) {
                // Add a delay before restarting to avoid rapid restart loops
                restartTimeoutRef.current = setTimeout(() => {
                    // Check if we should still restart (user might have stopped it)
                    if (recognitionRef.current && !isListeningRef.current && !isStartingRef.current) {
                        try {
                            isStartingRef.current = true;
                            recognitionRef.current.start();
                            isListeningRef.current = true;
                            setIsListening(true);
                            restartTimeoutRef.current = null;
                        } catch (err) {
                            console.debug('Recognition restart attempt failed:', err);
                            isStartingRef.current = false;
                            // If error is "already started", just update state
                            if (err.message && err.message.includes('already started')) {
                                isListeningRef.current = true;
                                setIsListening(true);
                            }
                        }
                    }
                }, CONFIG.RECOGNITION_RESTART_DELAY); // Use config delay
            }
        };

        recognitionRef.current = recognition;

        // Cleanup
        return () => {
            // Clear any pending restart
            if (restartTimeoutRef.current) {
                clearTimeout(restartTimeoutRef.current);
                restartTimeoutRef.current = null;
            }
            
            if (recognitionRef.current) {
                try {
                    isListeningRef.current = false;
                    isStartingRef.current = false;
                    recognitionRef.current.stop();
                } catch (err) {
                    // Ignore errors during cleanup
                }
            }
        };
    }, [lang, continuous, interimResults, onResult, onError, onFreeSpeech, isListening]);

    // Start recognition
    const start = useCallback(async () => {
        console.log('[SpeechRecognition] start() called');
        
        if (!isSupported || !recognitionRef.current) {
            console.error('[SpeechRecognition] Not supported or not initialized');
            setError('Speech recognition is not supported or not initialized');
            return false;
        }

        // If already listening, don't start again
        if (isListeningRef.current) {
            console.debug('[SpeechRecognition] Already listening, skipping start...');
            return true;
        }

        // Prevent multiple simultaneous start attempts
        // But allow retry after a short delay if previous attempt failed
        if (isStartingRef.current) {
            console.debug('[SpeechRecognition] Already starting, waiting a bit...');
            // Wait a bit and check again
            await new Promise(resolve => setTimeout(resolve, 100));
            if (isListeningRef.current) {
                console.debug('[SpeechRecognition] Now listening after wait');
                return true;
            }
            if (isStartingRef.current) {
                console.warn('[SpeechRecognition] Still starting, skipping duplicate call');
                return false;
            }
        }

        try {
            console.log('[SpeechRecognition] Setting isStartingRef to true');
            isStartingRef.current = true;
            
            // Request microphone permission
            console.log('[SpeechRecognition] Requesting microphone permission...');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log('[SpeechRecognition] Microphone permission granted');
            stream.getTracks().forEach(track => track.stop()); // Stop immediately, we just needed permission

            // Check if recognition is still available
            if (!recognitionRef.current) {
                console.error('[SpeechRecognition] Recognition ref is null after permission');
                isStartingRef.current = false;
                return false;
            }

            // Try to start recognition
            console.log('[SpeechRecognition] Starting recognition...');
            try {
                recognitionRef.current.start();
                console.log('[SpeechRecognition] Recognition started successfully');
                isListeningRef.current = true;
                setIsListening(true);
                setError(null);
                isStartingRef.current = false;
                return true;
            } catch (startErr) {
                console.error('[SpeechRecognition] Error starting recognition:', startErr);
                // If already started, that's okay - just update state
                if (startErr.message && startErr.message.includes('already started')) {
                    console.debug('[SpeechRecognition] Recognition already started, updating state...');
                    isListeningRef.current = true;
                    setIsListening(true);
                    setError(null);
                    isStartingRef.current = false;
                    return true;
                }
                throw startErr; // Re-throw other errors
            }
        } catch (err) {
            console.error('[SpeechRecognition] Failed to start speech recognition:', err);
            isStartingRef.current = false;
            isListeningRef.current = false;
            setIsListening(false);
            
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setError('Microphone access is required! Please allow access in browser settings.');
            } else if (err.name === 'NotFoundError') {
                setError('No microphone found. Please connect a microphone.');
            } else {
                setError('Failed to access microphone. Please check permissions.');
            }
            return false;
        }
    }, [isSupported]);

    // Stop recognition
    const stop = useCallback(() => {
        // Clear any pending restart
        if (restartTimeoutRef.current) {
            clearTimeout(restartTimeoutRef.current);
            restartTimeoutRef.current = null;
        }
        
        isListeningRef.current = false;
        isStartingRef.current = false;
        
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (err) {
                // Ignore "not started" errors - that's fine
                if (err.message && !err.message.includes('not started')) {
                    console.error('Error stopping recognition:', err);
                }
            }
        }
        setIsListening(false);
    }, []);

    // Restart recognition
    const restart = useCallback(async () => {
        console.log('[SpeechRecognition] Restart called - manual restart');
        console.log('[SpeechRecognition] Current state - isListening:', isListeningRef.current, 'isStarting:', isStartingRef.current);
        
        isManualRestartRef.current = true; // Set flag to prevent auto-restart conflict
        
        // Stop recognition
        console.log('[SpeechRecognition] Stopping recognition...');
        stop();
        
        // Wait for stop to complete and state to update
        await new Promise(resolve => setTimeout(resolve, CONFIG.RECOGNITION_RESTART_DELAY + 150));
        
        // Verify we're stopped
        if (isListeningRef.current) {
            console.warn('[SpeechRecognition] Still listening after stop, forcing stop again');
            isListeningRef.current = false;
            setIsListening(false);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Start recognition
        console.log('[SpeechRecognition] Starting recognition after restart...');
        console.log('[SpeechRecognition] State before start - isListening:', isListeningRef.current, 'isStarting:', isStartingRef.current);
        
        const success = await start();
        
        console.log('[SpeechRecognition] Start result:', success);
        console.log('[SpeechRecognition] State after start - isListening:', isListeningRef.current, 'isStarting:', isStartingRef.current);
        
        if (success) {
            console.log('[SpeechRecognition] Restart successful, recognition should be listening now');
            // Double-check state
            if (!isListeningRef.current) {
                console.warn('[SpeechRecognition] State mismatch - start() returned true but isListeningRef is false');
                // Force update
                isListeningRef.current = true;
                setIsListening(true);
            }
        } else {
            console.error('[SpeechRecognition] Restart failed - start() returned false');
        }
        
        isManualRestartRef.current = false; // Reset flag after start
        return success;
    }, [stop, start]);

    // Clear transcript
    const clearTranscript = useCallback(() => {
        setTranscript('');
        setInterim('');
        allRecognizedTextRef.current = '';
        lastInterimTextRef.current = '';
    }, []);

    return {
        isListening,
        transcript,
        interim,
        error,
        isSupported,
        start,
        stop,
        restart,
        clearTranscript,
    };
}

