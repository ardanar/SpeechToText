import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useWordChecker } from '../hooks/useWordChecker'
import { parseText } from '../utils/textUtils'

// ===== MAIN COMPONENT =====

const ReadingScreen = () => {
    const navigate = useNavigate()

    // Text data
    const textData = {
        id: '1',
        title: 'Ormandaki Macera - Bölüm 3',
        difficulty: 'Seviye 2',
        category: 'Masal',
        content: `Bir zamanlar, uzak diyarlarda yaşayan küçük bir tavşan vardı. Bu tavşan, diğer tavşanlardan biraz farklıydı çünkü kulakları çok uzundu. Herkes ona "Uzun Kulak" derdi. Uzun Kulak, ormanda gezmeyi ve yeni yerler keşfetmeyi çok severdi.`
    }

    const expectedWords = parseText(textData.content)

    // Main state
    const [isPaused, setIsPaused] = useState(false)
    const [seconds, setSeconds] = useState(0)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [toast, setToast] = useState(null)
    const [freeSpeechText, setFreeSpeechText] = useState('')
    const [isStarting, setIsStarting] = useState(false) // Prevent multiple clicks
    const [isStopping, setIsStopping] = useState(false) // Prevent multiple clicks

    // Refs
    const timerRef = useRef(null)
    const hasStartedOnceRef = useRef(false) // Track if session has ever been started

    // Free speech tracking callback
    const handleFreeSpeech = (text, isFinal) => {
        setFreeSpeechText(text)
    }

    // Refs for callbacks
    const wordCheckerRef = useRef(null)
    const speechRecognitionRef = useRef(null)

    // Speech Recognition Hook
    const speechRecognition = useSpeechRecognition({
        onResult: (result) => {
            console.log('[ReadingScreen] Received result:', result);
            if (result.processedWords && result.processedWords.length > 0) {
                console.log('[ReadingScreen] Calling checkWords with:', result.processedWords);
                if (wordCheckerRef.current) {
                    wordCheckerRef.current.checkWords(result.processedWords)
                }
            }
        },
        onError: (error) => {
            console.error('Speech recognition error:', error)
            showToast('Mikrofon hatası', 'error')
        },
        onFreeSpeech: handleFreeSpeech,
    })

    // Update ref
    speechRecognitionRef.current = speechRecognition

    // Word Checker Hook
    const wordChecker = useWordChecker(expectedWords, {
        onComplete: () => {
            showToast('🎉 Tebrikler! Metni başarıyla okudunuz!', 'success')
            stopSession()
        },
        onError: (error) => {
            // Error is shown visually with red color - no toast needed
            // Recognition continues listening so user can correct the mistake
            console.log(`[ReadingScreen] Word error: Expected "${error.expectedWord}", got "${error.recognizedWord}"`);
        },
    })

    // Update ref
    wordCheckerRef.current = wordChecker

    // Find sentence start for retry
    const findSentenceStart = (index) => {
        if (index <= 0) return 0
        let i = index
        while (i > 0) {
            const prevWord = expectedWords[i - 1]
            if (/[.!?]$/.test(prevWord)) break
            i--
        }
        return i
    }

    // Toast notification
    const showToast = (message, type = 'info') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3500)
        if (window.Notification && Notification.permission === 'granted') {
            try { new Notification(message) } catch (e) { /* */ }
        } else if (window.Notification && Notification.permission !== 'denied') {
            Notification.requestPermission().then((perm) => {
                if (perm === 'granted') {
                    try { new Notification(message) } catch (e) { /* */ }
                }
            })
        }
    }

    // Timer effect
    useEffect(() => {
        if (speechRecognition.isListening && !isPaused) {
            timerRef.current = window.setInterval(() => {
                setSeconds(prev => prev + 1)
            }, 1000)
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current)
                timerRef.current = null
            }
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
    }, [speechRecognition.isListening, isPaused])

    // Start or resume session
    const startSession = async () => {
        // If already listening, don't start again
        if (speechRecognition.isListening) {
            console.debug('[ReadingScreen] Already listening, skipping start...')
            return
        }

        // If we are in the middle of stopping, bekle ve tekrar dene
        if (isStopping) {
            console.debug('[ReadingScreen] Currently stopping, will not start immediately')
            return
        }

        setIsPaused(false)

        const isFreshStart =
            !hasStartedOnceRef.current &&
            wordChecker.currentWordIndex === 0 &&
            !wordChecker.errorIndex &&
            seconds === 0

        // === 1) İlk başlatma: tüm sistemi kur, mikrofon izni al ===
        if (isFreshStart) {
            console.log('[ReadingScreen] Fresh start - resetting everything')

            // Prevent multiple simultaneous calls only for first start
            if (isStarting) {
                console.debug('[ReadingScreen] Already starting (fresh), skipping...')
                return
            }

            setIsStarting(true)

            try {
                setSeconds(0)
                wordChecker.clearError()
                speechRecognition.clearTranscript()

                if (!speechRecognition.isSupported) {
                    console.error('[ReadingScreen] Speech recognition not supported')
                    showToast('Tarayıcınız STT desteklemiyor', 'error')
                    return
                }

                console.log('[ReadingScreen] Calling speechRecognition.start() for the first time...')
                const success = await speechRecognition.start()
                console.log('[ReadingScreen] speechRecognition.start() result:', success)

                if (!success) {
                    console.error('[ReadingScreen] Failed to start recognition')
                    showToast('Mikrofon başlatılamadı. Lütfen mikrofon iznini kontrol edin.', 'error')
                } else {
                    console.log('[ReadingScreen] Successfully started recognition')
                    hasStartedOnceRef.current = true
                }
            } catch (error) {
                console.error('[ReadingScreen] Error starting session:', error)
                showToast(`Başlatma hatası: ${error.message || 'Bilinmeyen hata'}`, 'error')
            } finally {
                console.log('[ReadingScreen] Setting isStarting to false (fresh start)')
                setIsStarting(false)
            }

            return
        }

        // === 2) Sonraki başlatmalar: Play / Pause gibi davransın ===
        console.log('[ReadingScreen] Resume start - using restart() like play button')

        // Prevent multiple simultaneous calls for resume
        if (isStarting) {
            console.debug('[ReadingScreen] Already starting (resume), skipping...')
            return
        }

        setIsStarting(true)

        try {
            // Hata varsa, sadece hatayı temizle, ilerleme korunur
            if (wordChecker.errorIndex !== null) {
                console.log('[ReadingScreen] Clearing error before resume')
                wordChecker.clearError()
            }

            // Daha önce en az bir kez başladıysak, güvenli restart kullan
            if (hasStartedOnceRef.current) {
                console.log('[ReadingScreen] Using restart() for resume')
                console.log('[ReadingScreen] State before restart - isListening:', speechRecognition.isListening)
                
                const success = await speechRecognition.restart()
                
                console.log('[ReadingScreen] Restart result:', success)
                console.log('[ReadingScreen] State after restart - isListening:', speechRecognition.isListening)
                
                // Wait a bit for state to update
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Check state again
                if (speechRecognition.isListening) {
                    console.log('[ReadingScreen] Restart successful, recognition is listening')
                    // Ensure wordChecker ref is updated
                    wordCheckerRef.current = wordChecker
                } else {
                    console.warn('[ReadingScreen] Restart returned success but isListening is false, retrying...')
                    // Retry once
                    const retrySuccess = await speechRecognition.start()
                    if (retrySuccess) {
                        console.log('[ReadingScreen] Retry successful')
                        wordCheckerRef.current = wordChecker
                    } else {
                        console.error('[ReadingScreen] Retry also failed')
                        showToast('Mikrofon tekrar başlatılamadı.', 'error')
                    }
                }
            } else {
                // Güvenlik için: beklenmedik durumlarda yine de start() dene
                console.log('[ReadingScreen] Fallback: using start() for resume')
                const success = await speechRecognition.start()
                if (success) {
                    hasStartedOnceRef.current = true
                } else {
                    showToast('Mikrofon tekrar başlatılamadı.', 'error')
                }
            }
        } catch (error) {
            console.error('[ReadingScreen] Error resuming session:', error)
            showToast('Devam etme hatası', 'error')
        } finally {
            setIsStarting(false)
        }
    }

    /*
        console.log('[ReadingScreen] Starting session...')
        setIsStarting(true)

        try {
            setIsPaused(false)

            const isFreshStart =
                !hasStartedOnceRef.current &&
                wordChecker.currentWordIndex === 0 &&
                !wordChecker.errorIndex &&
                seconds === 0

            // Only on very first start: her şeyi sıfırla
            if (isFreshStart) {
                console.log('[ReadingScreen] Fresh start - resetting everything')
                setSeconds(0)
                wordChecker.clearError()
                speechRecognition.clearTranscript()
            } else if (wordChecker.errorIndex) {
                // Hata varsa ve kullanıcı yeniden başlatıyorsa sadece hatayı temizle
                console.log('[ReadingScreen] Resuming after error - clearing error')
                wordChecker.clearError()
            }

            if (!speechRecognition.isSupported) {
                console.error('[ReadingScreen] Speech recognition not supported')
                showToast('Tarayıcınız STT desteklemiyor', 'error')
                setIsStarting(false)
                return
            }

            console.log('[ReadingScreen] Calling speechRecognition.start()...')
            const success = await speechRecognition.start()
            console.log('[ReadingScreen] speechRecognition.start() result:', success)
            
            if (!success) {
                console.error('[ReadingScreen] Failed to start recognition')
                showToast('Mikrofon başlatılamadı. Lütfen mikrofon iznini kontrol edin.', 'error')
            } else {
                console.log('[ReadingScreen] Successfully started recognition')
                hasStartedOnceRef.current = true
            }
        } catch (error) {
            console.error('[ReadingScreen] Error starting session:', error)
            showToast(`Başlatma hatası: ${error.message || 'Bilinmeyen hata'}`, 'error')
        } finally {
            console.log('[ReadingScreen] Setting isStarting to false')
            setIsStarting(false)
        }
    }
    */

    // Stop session
    const stopSession = () => {
        // Prevent multiple simultaneous calls
        if (isStopping || isStarting) {
            console.debug('Already stopping/starting, skipping...');
            return;
        }

        setIsStopping(true);
        
        try {
            speechRecognition.stop();
            setIsPaused(true);
        } catch (error) {
            console.error('Error stopping session:', error);
        } finally {
            setIsStopping(false);
        }
    }

    // Finish reading and go to results
    const handleFinish = async () => {
        stopSession()
        setIsAnalyzing(true)

        const wordCount = wordChecker.currentWordIndex
        const errorCount = expectedWords.length - wordCount
        const accuracy = Math.round((wordCount / expectedWords.length) * 100)
        const wpm = seconds > 0 ? Math.round((wordCount / (seconds / 60))) : 0

        setTimeout(() => {
            setIsAnalyzing(false)
            navigate('/student/result', {
                state: {
                    textId: textData.id,
                    durationSeconds: seconds,
                    wordCount,
                    errorCount: Math.max(0, errorCount),
                    wpm,
                    accuracy,
                    aiFeedback: accuracy > 90 ? 'Muhteşem! Neredeyse hiç hata yok.' : accuracy > 70 ? 'Çok iyi! Biraz daha pratik yapabilirsin.' : 'Harika deneme, pratikle daha iyi olacaksın!',
                    timestamp: new Date().toISOString()
                }
            })
        }, 1500)
    }

    // Retry from sentence start
    const retrySentence = async () => {
        // Prevent multiple simultaneous calls
        if (isStarting || isStopping) {
            console.debug('Already starting/stopping, skipping retry...');
            return;
        }

        setIsStarting(true);
        
        try {
            const startOfSentence = findSentenceStart(wordChecker.currentWordIndex);
            wordChecker.retryFromIndex(startOfSentence);
            wordChecker.clearError();
            speechRecognition.clearTranscript();
            setSeconds(0);
            
            // Use restart method which handles stop/start properly
            if (speechRecognition.isListening) {
                speechRecognition.restart();
            } else {
                await startSession();
            }
        } catch (error) {
            console.error('Error retrying sentence:', error);
            showToast('Yeniden başlatma hatası', 'error');
        } finally {
            setIsStarting(false);
        }
    }

    // Current time parts
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60

    // Word-by-word rendering with colors
    const renderWords = () => {
        return expectedWords.map((word, idx) => {
            let bgClass = ''
            
            // Check if this word has an error
            const hasError = wordChecker.errorIndex === idx
            
            if (idx < wordChecker.currentWordIndex) {
                // Matched words: green (completed and correct)
                bgClass = 'bg-green-200 dark:bg-green-700 text-green-900 dark:text-green-100'
            } else if (idx === wordChecker.currentWordIndex) {
                // Current word: red if error, blue ring if no error
                if (hasError) {
                    bgClass = 'bg-red-200 dark:bg-red-700 text-red-900 dark:text-red-100 ring-2 ring-red-500 font-bold'
                } else {
                    bgClass = 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30 font-bold'
                }
            } else if (hasError) {
                // Error word (shouldn't happen but just in case)
                bgClass = 'bg-red-200 dark:bg-red-700 text-red-900 dark:text-red-100'
            } else {
                // Pending words: gray
                bgClass = 'text-slate-400 dark:text-slate-500'
            }

            return (
                <span
                    key={idx}
                    className={`inline-block px-2 py-1 mx-1 my-1 rounded-lg font-medium transition-all duration-300 ${bgClass}`}
                >
                    {word}
                </span>
            )
        })
    }

    // Progress percentage
    const progress = wordChecker.progress

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden">

            {/* Main Container */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-6 shadow-sm">
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                ← Geri
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold">{textData.title}</h1>
                                <p className="text-sm text-slate-500">{textData.difficulty} • {textData.category}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${speechRecognition.isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></div>
                            <span className="text-sm">{speechRecognition.isListening ? 'Dinleniyor...' : 'Hazır'}</span>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 flex gap-6 p-8 overflow-hidden">
                    {/* Reading Section */}
                    <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="text-xl leading-relaxed text-center">
                                {renderWords()}
                            </div>
                            {speechRecognition.transcript && (
                                <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">Tanınan:</p>
                                    <p className="text-lg">{speechRecognition.transcript} <span className="text-slate-400">{speechRecognition.interim}</span></p>
                                </div>
                            )}
                            
                            {/* Free Speech Output */}
                            {freeSpeechText && (
                                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-xs font-bold text-slate-500 uppercase">Tüm Algılanan Konuşmalar</p>
                                        <button
                                            onClick={() => {
                                                speechRecognition.clearTranscript()
                                                setFreeSpeechText('')
                                            }}
                                            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                        >
                                            Temizle
                                        </button>
                                    </div>
                                    <textarea
                                        readOnly
                                        value={freeSpeechText}
                                        className="w-full min-h-[80px] p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm resize-none"
                                        placeholder="Buraya örnek metin dışında konuştuğunuz tüm kelimeler yazılacak..."
                                    />
                                </div>
                            )}
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 bg-slate-200 dark:bg-slate-800">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Stats Sidebar */}
                    <div className="w-80 flex flex-col gap-4">
                        {/* Timer */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-4">Geçen Süre</p>
                            <div className="flex justify-center gap-3">
                                <div className="flex flex-col items-center">
                                    <div className="bg-slate-100 dark:bg-slate-800 w-16 h-20 rounded-2xl flex items-center justify-center">
                                        <span className="text-3xl font-bold">{minutes.toString().padStart(2, '0')}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">Dakika</p>
                                </div>
                                <div className="text-3xl font-bold text-slate-300 py-6">:</div>
                                <div className="flex flex-col items-center">
                                    <div className="bg-slate-100 dark:bg-slate-800 w-16 h-20 rounded-2xl flex items-center justify-center">
                                        <span className="text-3xl font-bold">{secs.toString().padStart(2, '0')}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">Saniye</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-4">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Doğru</p>
                                <p className="text-3xl font-bold text-green-600">{wordChecker.currentWordIndex}</p>
                                <p className="text-xs text-slate-500 mt-1">Kelime</p>
                            </div>
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-4">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Hata</p>
                                <p className="text-3xl font-bold text-red-600">{Math.max(0, expectedWords.length - wordChecker.currentWordIndex)}</p>
                                <p className="text-xs text-slate-500 mt-1">Kelime</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-4">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Hız</p>
                            <p className="text-3xl font-bold text-purple-600">{seconds > 0 ? Math.round((wordChecker.currentWordIndex / (seconds / 60))) : 0}</p>
                            <p className="text-xs text-slate-500 mt-1">Kelime/Dakika</p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-3 mt-auto">
                            {!speechRecognition.isListening ? (
                                <button
                                    onClick={startSession}
                                    disabled={!speechRecognition.isSupported || isStarting || isStopping}
                                    className="w-full h-20 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-3xl shadow-lg transition-all active:scale-95 flex items-center justify-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isStarting ? '⏳ Başlatılıyor...' : (wordChecker.currentWordIndex > 0 || hasStartedOnceRef.current) ? '▶️ Okumaya Devam Et' : '🎤 Okumaya Başla'}
                                </button>
                            ) : (
                                <button
                                    onClick={stopSession}
                                    disabled={isStopping || isStarting}
                                    className="w-full h-20 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-3xl shadow-lg transition-all active:scale-95 flex items-center justify-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isStopping ? '⏳ Durduruluyor...' : '⏹ Okumayı Durdur'}
                                </button>
                            )}
                            <button
                                onClick={handleFinish}
                                disabled={isAnalyzing || isStarting || isStopping}
                                className="w-full h-16 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-3xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAnalyzing ? 'İşleniyor...' : '✓ Seansı Bitir'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-40 px-6 py-4 rounded-2xl shadow-lg text-white font-medium ${
                    toast.type === 'error' ? 'bg-red-600' :
                    toast.type === 'success' ? 'bg-green-600' :
                    'bg-slate-800'
                }`}>
                    {toast.message}
                </div>
            )}
        </div>
    )
}

export default ReadingScreen
