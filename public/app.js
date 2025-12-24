/**
 * İnteraktif Okuma Pratiği Uygulaması
 * Web Speech API kullanarak gerçek zamanlı okuma kontrolü yapar
 */

// Constants
const ALERT_AUTO_HIDE_DELAY = 2000; // ms
const CHECK_INTERVAL = 50; // ms - Daha hızlı kontrol için azaltıldı
const RECURSIVE_CHECK_DELAY = 0; // ms - Anında kontrol için
const RECOGNITION_RESTART_DELAY = 300; // ms
const MIN_WORD_LENGTH_FOR_WARNING = 2;
const WORD_MATCH_THRESHOLD = 0.7;

const EXAMPLE_TEXT = "Türkiye, Asya ve Avrupa kıtalarında yer alan güzel bir ülkedir.";

// Türkçe sayı sözlüğü (yazı -> rakam)
const TURKISH_NUMBER_MAP = {
    'sıfır': '0',
    'bir': '1',
    'iki': '2',
    'üç': '3',
    'dört': '4',
    'beş': '5',
    'altı': '6',
    'yedi': '7',
    'sekiz': '8',
    'dokuz': '9',
    'on': '10',
    'yirmi': '20',
    'otuz': '30',
    'kırk': '40',
    'elli': '50',
    'altmış': '60',
    'yetmiş': '70',
    'seksen': '80',
    'doksan': '90',
    'yüz': '100'
};

// Ters sözlük (rakam -> yazı)
const NUMBER_TO_TURKISH = Object.fromEntries(
    Object.entries(TURKISH_NUMBER_MAP).map(([key, value]) => [value, key])
);

// Speech Recognition API'nin yanlış algıladığı kelimeler için alternatif eşleştirme
// API bazen sayıları benzer sesli kelimelerle karıştırıyor
// Önemli: "yıl" hem "üç" hem "beş" hem "bir" için yanlış algılanabiliyor
// "önce" de "bir" için yanlış algılanabiliyor
const NUMBER_ALTERNATIVES = {
    'üç': ['yıl', 'uç', 'üç', 'üc', 'yuc', 'yil', 'yıl'],
    'beş': ['yıl', 'yeş', 'beş', 'bes', 'beş', 'yil', 'yıl'],
    'bir': ['bir', 'ber', 'birr', 'yıl', 'yil', 'önce', 'once', 'bir'],
    'iki': ['iki', 'ikı', 'ik', 'iki'],
    'dört': ['dört', 'dort', 'dort', 'dort'],
    'altı': ['altı', 'alti', 'alt', 'alti'],
    'yedi': ['yedi', 'yedi', 'yed', 'yedi'],
    'sekiz': ['sekiz', 'sekis', 'sek', 'sekiz'],
    'dokuz': ['dokuz', 'dokus', 'dok', 'dokuz'],
    'sıfır': ['sıfır', 'sifir', 'sifr', 'sifir']
};

// Rakamlar için alternatifler (API'nin algılayabileceği tüm varyasyonlar)
const DIGIT_ALTERNATIVES = {
    '3': ['yıl', 'uç', 'üç', 'üc', 'yuc', 'yil', '3', 'üç'],
    '5': ['yıl', 'yeş', 'beş', 'bes', 'beş', 'yil', '5', 'beş'],
    '1': ['bir', 'ber', 'birr', 'yıl', 'yil', 'önce', 'once', '1', 'bir'],
    '2': ['iki', 'ikı', 'ik', '2', 'iki'],
    '4': ['dört', 'dort', 'dort', '4', 'dört'],
    '6': ['altı', 'alti', 'alt', '6', 'altı'],
    '7': ['yedi', 'yedi', 'yed', '7', 'yedi'],
    '8': ['sekiz', 'sekis', 'sek', '8', 'sekiz'],
    '9': ['dokuz', 'dokus', 'dok', '9', 'dokuz'],
    '0': ['sıfır', 'sifir', 'sifr', '0', 'sıfır']
};

// DOM Elements
const elements = {
    originalText: document.getElementById('originalText'),
    useExampleBtn: document.getElementById('useExampleBtn'),
    startReadingBtn: document.getElementById('startReadingBtn'),
    stopReadingBtn: document.getElementById('stopReadingBtn'),
    retryBtn: document.getElementById('retryBtn'),
    textDisplay: document.getElementById('textDisplay'),
    alertMessage: document.getElementById('alertMessage'),
    alertText: document.getElementById('alertText'),
    currentWordEl: document.getElementById('currentWord'),
    progressEl: document.getElementById('progress'),
};

// State
const state = {
    readingRecognition: null,
    isReading: false,
    readingStream: null,
    currentWordIndex: 0,
    textWords: [],
    recognizedWords: [],
    checkInterval: null,
    lastProcessedWordIndex: -1, // Son işlenen kelime index'i
};

/**
 * Metni normalize eder (küçük harfe çevirir, noktalama işaretlerini kaldırır)
 * @param {string} word - Normalize edilecek kelime
 * @returns {string} Normalize edilmiş kelime
 */
function normalizeWord(word) {
    if (!word) return '';
    return word.toLowerCase()
        .replace(/[.,!?;:]/g, '')
        .trim();
}

/**
 * Metni kelimelere ayırır
 * @param {string} text - Kelimelere ayrılacak metin
 * @returns {string[]} Kelime dizisi
 */
function parseText(text) {
    if (!text) return [];
    return text.split(/\s+/).filter(word => word.trim());
}

/**
 * Türkçe sayıyı rakama dönüştürür
 * @param {string} word - Sayı kelimesi (örn: "beş" veya "5")
 * @returns {string} Rakam (örn: "5") veya orijinal kelime
 */
function turkishNumberToDigit(word) {
    if (!word) return word;
    const normalized = normalizeWord(word);
    
    // Rakam zaten ise direkt döndür
    if (/^\d+$/.test(normalized)) {
        return normalized;
    }
    
    // Türkçe sayı sözlüğünde ara
    if (TURKISH_NUMBER_MAP[normalized]) {
        return TURKISH_NUMBER_MAP[normalized];
    }
    
    // Orijinal kelimeyi döndür
    return word;
}

/**
 * Bir kelimenin sayı olup olmadığını kontrol eder
 * @param {string} word - Kontrol edilecek kelime
 * @returns {boolean} Sayı mı?
 */
function isNumber(word) {
    if (!word) return false;
    const normalized = normalizeWord(word);
    
    // Rakam mı?
    if (/^\d+$/.test(normalized)) {
        return true;
    }
    
    // Türkçe sayı mı?
    if (TURKISH_NUMBER_MAP[normalized]) {
        return true;
    }
    
    return false;
}

/**
 * Rakamı Türkçe sayıya dönüştürür
 * @param {string} word - Rakam (örn: "5")
 * @returns {string} Türkçe sayı (örn: "beş") veya orijinal kelime
 */
function digitToTurkishNumber(word) {
    if (!word) return word;
    return NUMBER_TO_TURKISH[word] || word;
}

/**
 * Algılanan kelimenin beklenen sayının alternatifleri arasında olup olmadığını kontrol eder
 * @param {string} expectedWord - Beklenen kelime
 * @param {string} recognizedWord - Algılanan kelime
 * @returns {boolean} Alternatif eşleşme var mı?
 */
function checkNumberAlternatives(expectedWord, recognizedWord) {
    const normalizedExpected = normalizeWord(expectedWord);
    const normalizedRecognized = normalizeWord(recognizedWord);
    
    // Beklenen kelime için alternatifleri topla
    const alternativesSet = new Set();
    
    // Türkçe sayı alternatifleri
    if (NUMBER_ALTERNATIVES[normalizedExpected]) {
        NUMBER_ALTERNATIVES[normalizedExpected].forEach(alt => alternativesSet.add(normalizeWord(alt)));
    }
    
    // Rakam alternatifleri
    if (DIGIT_ALTERNATIVES[normalizedExpected]) {
        DIGIT_ALTERNATIVES[normalizedExpected].forEach(alt => alternativesSet.add(normalizeWord(alt)));
    }
    
    // Sayıya dönüştürülmüş hali için alternatifler
    const expectedAsNumber = turkishNumberToDigit(normalizedExpected);
    
    // Eğer beklenen kelime zaten rakam ise (örn: "3")
    if (expectedAsNumber === normalizedExpected && DIGIT_ALTERNATIVES[expectedAsNumber]) {
        DIGIT_ALTERNATIVES[expectedAsNumber].forEach(alt => alternativesSet.add(normalizeWord(alt)));
        // Türkçe karşılığı için de alternatifler ekle
        const turkishEquivalent = digitToTurkishNumber(expectedAsNumber);
        if (turkishEquivalent && NUMBER_ALTERNATIVES[turkishEquivalent]) {
            NUMBER_ALTERNATIVES[turkishEquivalent].forEach(alt => alternativesSet.add(normalizeWord(alt)));
        }
    }
    
    // Eğer beklenen kelime Türkçe sayı ise (örn: "üç" -> "3")
    if (expectedAsNumber !== normalizedExpected) {
        // Rakam alternatifleri
        if (DIGIT_ALTERNATIVES[expectedAsNumber]) {
            DIGIT_ALTERNATIVES[expectedAsNumber].forEach(alt => alternativesSet.add(normalizeWord(alt)));
        }
        // Türkçe karşılığı için alternatifler
        const turkishEquivalent = digitToTurkishNumber(expectedAsNumber);
        if (turkishEquivalent && NUMBER_ALTERNATIVES[turkishEquivalent]) {
            NUMBER_ALTERNATIVES[turkishEquivalent].forEach(alt => alternativesSet.add(normalizeWord(alt)));
        }
    }
    
    // Alternatifler listesini logla (debug için)
    const alternatives = Array.from(alternativesSet);
    console.log('Alternatifler listesi:', alternatives, 'Algılanan:', normalizedRecognized);
    
    // Alternatifler arasında algılanan kelime var mı?
    return alternatives.some(alt => {
        const normalizedAlt = normalizeWord(alt);
        const matches = normalizedAlt === normalizedRecognized ||
               normalizedRecognized.includes(normalizedAlt) ||
               normalizedAlt.includes(normalizedRecognized);
        if (matches) {
            console.log('Alternatif eşleşme bulundu:', alt, '->', recognizedWord);
        }
        return matches;
    });
}

/**
 * İki kelimenin eşleşip eşleşmediğini kontrol eder (sayıları da destekler)
 * @param {string} expectedWord - Beklenen kelime
 * @param {string} recognizedWord - Algılanan kelime
 * @returns {boolean} Eşleşme durumu
 */
function wordsMatch(expectedWord, recognizedWord) {
    if (!expectedWord || !recognizedWord) return false;
    
    const normalizedExpected = normalizeWord(expectedWord);
    const normalizedRecognized = normalizeWord(recognizedWord);
    
    // Direkt eşleşme kontrolü (en önce kontrol et)
    if (normalizedExpected === normalizedRecognized) {
        return true;
    }
    
    // Sayı dönüşümü ile eşleşme kontrolü
    const expectedAsNumber = turkishNumberToDigit(normalizedExpected);
    const recognizedAsNumber = turkishNumberToDigit(normalizedRecognized);
    
    // Beklenen kelime bir sayı mı?
    const isExpectedNumber = isNumber(normalizedExpected);
    // Algılanan kelime bir sayı mı?
    const isRecognizedNumber = isNumber(normalizedRecognized);
    
    // Sayı karşılaştırması: En az biri sayı ise ve sayı değerleri eşitse
    // Bu durumlar:
    // - üç -> üç (her ikisi de 3'e dönüşür)
    // - üç -> 3 (her ikisi de 3'e dönüşür)
    // - 3 -> üç (her ikisi de 3'e dönüşür)
    // - 3 -> 3 (her ikisi de 3'e dönüşür)
    if (isExpectedNumber || isRecognizedNumber) {
        // En az biri sayı, sayı değerlerini karşılaştır
        if (expectedAsNumber === recognizedAsNumber) {
            return true;
        }
        
        // Alternatif eşleştirme kontrolü (API yanlış algılamış olabilir)
        // Örneğin: "3" bekleniyor, "yıl" algılandı -> alternatif kontrolü
        if (isExpectedNumber) {
            const hasAlternative = checkNumberAlternatives(expectedWord, recognizedWord);
            if (hasAlternative) {
                console.log('Alternatif eşleşme bulundu:', expectedWord, '->', recognizedWord);
                return true;
            } else {
                console.log('Alternatif eşleşme yok. Beklenen:', expectedWord, 'Algılanan:', recognizedWord);
            }
        }
    }
    
    // Normal kelime eşleşmesi (kısmi eşleşmeler) - sadece sayı değilse
    // Sayı olmayan kelimeler için kısmi eşleşme kontrolü
    if (expectedAsNumber === normalizedExpected && recognizedAsNumber === normalizedRecognized) {
        // Her ikisi de sayı değil, normal kelime eşleşmesi
        return normalizedRecognized.includes(normalizedExpected) ||
               normalizedExpected.includes(normalizedRecognized) ||
               normalizedExpected.startsWith(normalizedRecognized) ||
               normalizedRecognized.startsWith(normalizedExpected);
    }
    
    return false;
}

/**
 * Metni görüntüler ve kelime durumlarına göre renklendirir
 */
function displayText() {
    const words = parseText(elements.originalText.value);
    state.textWords = words;
    
    const html = words.map((word, index) => {
        if (index < state.currentWordIndex) {
            return `<span class="word-completed">${word}</span>`;
        }
        if (index === state.currentWordIndex) {
            return `<span class="word-current">${word}</span>`;
        }
        if (index <= state.currentWordIndex + 2) {
            return `<span class="word-upcoming">${word}</span>`;
        }
        return `<span class="word-pending">${word}</span>`;
    }).join(' ');
    
    elements.textDisplay.innerHTML = html;
    updateProgress();
}

/**
 * İlerleme bilgisini günceller
 */
function updateProgress() {
    const { textWords, currentWordIndex } = state;
    
    if (currentWordIndex < textWords.length) {
        const upcomingWords = textWords.slice(currentWordIndex, currentWordIndex + 3).join(' ');
        elements.currentWordEl.textContent = upcomingWords || '-';
    } else {
        elements.currentWordEl.textContent = '-';
    }
    
    elements.progressEl.textContent = `${currentWordIndex} / ${textWords.length}`;
}

/**
 * Uyarı mesajı gösterir
 * @param {string} message - Gösterilecek mesaj
 * @param {boolean} isError - Hata mesajı mı?
 */
function showAlert(message, isError = true) {
    elements.alertText.textContent = message;
    elements.alertMessage.style.display = 'block';
    elements.alertMessage.className = isError 
        ? 'alert-message alert-error' 
        : 'alert-message alert-success';
    
    if (!isError) {
        setTimeout(() => {
            elements.alertMessage.style.display = 'none';
        }, ALERT_AUTO_HIDE_DELAY);
    }
}

/**
 * Uyarı mesajını gizler
 */
function hideAlert() {
    elements.alertMessage.style.display = 'none';
}

/**
 * Kontrol döngüsünü başlatır
 */
function startChecking() {
    if (state.checkInterval) {
        clearInterval(state.checkInterval);
    }
    
    // Daha hızlı kontrol için interval kullan (fallback olarak)
    // Ana kontrol recognition event'lerinde yapılıyor
    state.checkInterval = setInterval(() => {
        if (state.isReading && state.recognizedWords.length > 0) {
            checkRecognizedWords();
        }
    }, CHECK_INTERVAL);
}

/**
 * Kontrol döngüsünü durdurur
 */
function stopChecking() {
    if (state.checkInterval) {
        clearInterval(state.checkInterval);
        state.checkInterval = null;
    }
}

/**
 * Interim kelimeleri kontrol eder (daha hızlı geri bildirim için)
 * @param {string[]} interimWords - Ara sonuç kelimeleri
 */
function checkInterimWords(interimWords) {
    const { isReading, currentWordIndex, textWords } = state;
    
    if (!isReading || currentWordIndex >= textWords.length || interimWords.length === 0) {
        return;
    }
    
    const expectedWord = textWords[currentWordIndex];
    const recognizedWord = interimWords[0];
    const normalizedExpected = normalizeWord(expectedWord);
    const normalizedRecognized = normalizeWord(recognizedWord);
    
    // Çok kısa veya boş kelimeleri görmezden gel (sessizlik durumu)
    if (!normalizedRecognized || normalizedRecognized.length < 2) {
        return;
    }
    
    // Önceki kelimelerden biriyle eşleşiyorsa görmezden gel (tekrar algılama)
    if (isPreviousWord(recognizedWord, currentWordIndex)) {
        return;
    }
    
    // Interim kelimeleri de kontrol et - eşleşiyorsa ve yeterince uzunsa ekle (daha hızlı algılama için)
    if (wordsMatch(expectedWord, recognizedWord) && 
        normalizedRecognized.length >= normalizedExpected.length * 0.85 &&
        normalizedRecognized.length >= 3) {
        // Yeterince eşleşiyor ve güvenilir görünüyor, hemen ekle (final beklemeden)
        state.recognizedWords.push(recognizedWord);
        // Hemen kontrol et
        requestAnimationFrame(() => checkRecognizedWords());
        return;
    }
    
    // Yanlış uyarı sadece gerçekten yanlış ve yeterince uzun kelimeler için ver
    // Sessizlik durumunda (çok kısa kelimeler) uyarı verme
    const minLengthForWarning = Math.max(3, Math.floor(normalizedExpected.length * 0.6));
    if (normalizedRecognized.length >= minLengthForWarning && 
        normalizedRecognized.length >= 3 &&
        !normalizedExpected.includes(normalizedRecognized) &&
        !normalizedRecognized.includes(normalizedExpected)) {
        // Gerçekten yanlış görünüyor ve yeterince uzun
        // Ama interim olduğu için sadece sessizce log, uyarı verme (final bekleyelim)
        console.debug(`Interim mismatch: expected "${expectedWord}", got "${recognizedWord}"`);
    }
}

/**
 * Algılanan kelimenin önceki bir kelimeyle eşleşip eşleşmediğini kontrol eder
 * @param {string} recognizedWord - Algılanan kelime
 * @param {number} currentIndex - Mevcut kelime index'i
 * @returns {boolean} Önceki bir kelimeyle eşleşiyor mu?
 */
function isPreviousWord(recognizedWord, currentIndex) {
    if (currentIndex <= 0) return false;
    
    // Son 3 kelimeyi kontrol et (daha geniş kontrol için)
    const checkRange = Math.min(3, currentIndex);
    for (let i = currentIndex - checkRange; i < currentIndex; i++) {
        if (i >= 0 && wordsMatch(state.textWords[i], recognizedWord)) {
            return true;
        }
    }
    return false;
}

/**
 * Algılanan kelimeleri kontrol eder ve ilerlemeyi yönetir
 */
function checkRecognizedWords() {
    const { isReading, currentWordIndex, textWords, recognizedWords } = state;
    
    if (!isReading || currentWordIndex >= textWords.length || recognizedWords.length === 0) {
        return;
    }
    
    const expectedWord = textWords[currentWordIndex];
    const recognizedWord = recognizedWords[0];
    
    // Boş veya çok kısa kelimeleri görmezden gel (sessizlik durumu)
    const normalizedRecognized = normalizeWord(recognizedWord);
    if (!normalizedRecognized || normalizedRecognized.length < 2) {
        state.recognizedWords.shift();
        // Bir sonraki kelimeyi kontrol et
        if (state.recognizedWords.length > 0) {
            requestAnimationFrame(() => checkRecognizedWords());
        }
        return;
    }
    
    // Önceki kelimelerden biriyle eşleşiyorsa görmezden gel (tekrar algılama)
    if (isPreviousWord(recognizedWord, currentWordIndex)) {
        state.recognizedWords.shift();
        if (state.recognizedWords.length > 0) {
            requestAnimationFrame(() => checkRecognizedWords());
        }
        return;
    }
    
    // Beklenen kelime bir sayı ise ve algılanan kelime sayı değilse, özel mesaj göster
    const normalizedExpected = normalizeWord(expectedWord);
    const expectedAsNumber = turkishNumberToDigit(normalizedExpected);
    const isExpectedNumber = isNumber(normalizedExpected);
    
    // Debug: Sayı kelimeleri için log
    if (isExpectedNumber) {
        const recognizedAsNumber = turkishNumberToDigit(normalizeWord(recognizedWord));
        console.log('Sayı kontrolü - Beklenen:', expectedWord, 'Algılanan:', recognizedWord);
        console.log('Sayı dönüşümü - Beklenen:', expectedAsNumber, 'Algılanan:', recognizedAsNumber);
        console.log('Eşleşme:', expectedAsNumber === recognizedAsNumber);
    }
    
    if (wordsMatch(expectedWord, recognizedWord)) {
        // Doğru kelime - ilerle
        state.currentWordIndex++;
        state.lastProcessedWordIndex = currentWordIndex;
        state.recognizedWords.shift();
        
        displayText();
        hideAlert();
        
        if (state.currentWordIndex >= state.textWords.length) {
            showAlert('🎉 Tebrikler! Metni başarıyla okudunuz!', false);
            stopReading();
            return;
        }
        
        // Bir sonraki kelimeyi de hemen kontrol et (gecikme olmadan)
        if (state.recognizedWords.length > 0 && state.currentWordIndex < state.textWords.length) {
            if (RECURSIVE_CHECK_DELAY > 0) {
                setTimeout(() => checkRecognizedWords(), RECURSIVE_CHECK_DELAY);
            } else {
                // Anında kontrol et (requestAnimationFrame ile browser'ı bloklamadan)
                requestAnimationFrame(() => checkRecognizedWords());
            }
        }
    } else {
        // Yanlış kelime kontrolü
        const normalizedExpected = normalizeWord(expectedWord);
        
        // Eğer beklenen kelime bir sayı ise ve algılanan kelime tamamen alakasızsa
        // (örneğin: "bir" bekleniyor, "yapılan" algılandı), sessizce atla
        if (isExpectedNumber) {
            // Algılanan kelime çok uzunsa veya tamamen farklıysa, sessizce atla
            // API bazen alakasız kelimeler algılayabiliyor
            const isCompletelyUnrelated = 
                normalizedRecognized.length > normalizedExpected.length + 2 ||
                (normalizedRecognized.length >= 5 && !normalizedExpected.includes(normalizedRecognized));
            
            if (isCompletelyUnrelated) {
                // Alakasız kelime, sessizce atla
                state.recognizedWords.shift();
                if (state.recognizedWords.length > 0) {
                    requestAnimationFrame(() => checkRecognizedWords());
                }
                return;
            }
        }
        
        // Gerçekten yanlış algılama - uyarı ver
        const isSignificantlyDifferent = 
            normalizedRecognized.length >= 3 && 
            normalizedExpected.length >= 3 &&
            !normalizedExpected.includes(normalizedRecognized) &&
            !normalizedRecognized.includes(normalizedExpected);
        
        if (isSignificantlyDifferent) {
            // Eğer beklenen kelime bir sayı ise, özel mesaj göster
            if (isExpectedNumber) {
                const turkishNumber = digitToTurkishNumber(expectedAsNumber);
                handleWrongWord(
                    expectedWord, 
                    recognizedWord,
                    `Sayı olarak algılanamadı. "${turkishNumber}" veya "${expectedAsNumber}" olarak söyleyin.`
                );
            } else {
                handleWrongWord(expectedWord, recognizedWord);
            }
        } else {
            // Çok benzer veya kısa, sessizce atla
            state.recognizedWords.shift();
            if (state.recognizedWords.length > 0) {
                requestAnimationFrame(() => checkRecognizedWords());
            }
        }
    }
}

/**
 * Yanlış kelime durumunu yönetir
 * @param {string} expectedWord - Beklenen kelime
 * @param {string} recognizedWord - Algılanan kelime
 * @param {string} customMessage - Özel mesaj (opsiyonel)
 */
function handleWrongWord(expectedWord, recognizedWord, customMessage = null) {
    const message = customMessage || 
        `❌ Yanlış! Beklenen: "${expectedWord}", Okunan: "${recognizedWord}". Lütfen tekrar deneyin.`;
    showAlert(message);
    elements.retryBtn.style.display = 'inline-flex';
    state.recognizedWords = [];
    
    if (state.readingRecognition) {
        state.readingRecognition.stop();
    }
}

/**
 * Speech Recognition sonuçlarını işler
 * @param {SpeechRecognitionEvent} event - Recognition event
 */
function handleRecognitionResult(event) {
    if (!state.isReading) return;
    
    let interimTranscript = '';
    let finalTranscript = '';
    let hasNewFinal = false;
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
            hasNewFinal = true;
        } else {
            interimTranscript += transcript;
        }
    }
    
    // Final kelimeleri ekle
    if (finalTranscript) {
        const finalWords = finalTranscript.trim()
            .split(/\s+/)
            .map(word => normalizeWord(word))
            .filter(word => word);
        state.recognizedWords = [...state.recognizedWords, ...finalWords];
    }
    
    // Interim kelimeleri kontrol et (final yoksa ve anlamlı bir transcript varsa)
    if (interimTranscript && !hasNewFinal && interimTranscript.trim().length > 2) {
        const interimWords = interimTranscript.trim()
            .split(/\s+/)
            .map(word => normalizeWord(word))
            .filter(word => word && word.length >= 2); // Çok kısa kelimeleri filtrele
        
        if (interimWords.length > 0) {
            checkInterimWords(interimWords);
        }
    }
    
    // Final result varsa hemen kontrol et (interval beklemeden)
    if (hasNewFinal) {
        requestAnimationFrame(() => checkRecognizedWords());
    }
    
    displayText();
}

/**
 * Speech Recognition hatalarını yönetir
 * @param {SpeechRecognitionErrorEvent} event - Error event
 */
function handleRecognitionError(event) {
    // Sessizlik durumunu (no-speech) görmezden gel
    if (event.error === 'no-speech') {
        return;
    }
    
    console.error('Okuma pratiği hatası:', event.error);
    
    if (event.error === 'not-allowed') {
        alert('Mikrofon erişimi gerekli! Lütfen tarayıcı ayarlarından izin verin.');
        stopReading();
    }
}

/**
 * Speech Recognition sonlandığında çağrılır
 */
function handleRecognitionEnd() {
    if (state.isReading && state.readingRecognition) {
        try {
            state.readingRecognition.start();
        } catch (error) {
            // Zaten çalışıyorsa veya başka bir hata varsa sessizce devam et
            console.debug('Recognition restart attempt failed:', error);
        }
    }
}

/**
 * Speech Recognition API'sini başlatır
 */
function initializeSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        console.warn('Speech Recognition API bu tarayıcıda desteklenmiyor');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    state.readingRecognition = new SpeechRecognition();
    
    state.readingRecognition.lang = 'tr-TR';
    state.readingRecognition.continuous = true;
    state.readingRecognition.interimResults = true;
    
    state.readingRecognition.onresult = handleRecognitionResult;
    state.readingRecognition.onerror = handleRecognitionError;
    state.readingRecognition.onend = handleRecognitionEnd;
}

/**
 * Okumayı başlatır
 */
async function startReading() {
    const text = elements.originalText.value.trim();
    
    if (!text) {
        alert('Lütfen önce okumak istediğiniz metni girin!');
        return;
    }
    
    const words = parseText(text);
    if (words.length === 0) {
        alert('Lütfen geçerli bir metin girin!');
        return;
    }
    
    try {
        state.textWords = words;
        state.currentWordIndex = 0;
        state.recognizedWords = [];
        state.lastProcessedWordIndex = -1;
        displayText();
        
        state.readingStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        state.isReading = true;
        
        updateButtonStates();
        hideAlert();
        
        if (state.readingRecognition) {
            state.readingRecognition.start();
        }
        
        startChecking();
    } catch (error) {
        console.error('Mikrofon erişimi hatası:', error);
        alert('Mikrofon erişimi gerekli! Lütfen tarayıcı ayarlarından izin verin.');
        state.isReading = false;
    }
}

/**
 * Okumayı durdurur
 */
function stopReading() {
    stopChecking();
    
    if (state.readingRecognition && state.isReading) {
        state.readingRecognition.stop();
    }
    
    if (state.readingStream) {
        state.readingStream.getTracks().forEach(track => track.stop());
        state.readingStream = null;
    }
    
    state.isReading = false;
    state.currentWordIndex = 0;
    state.recognizedWords = [];
    state.lastProcessedWordIndex = -1;
    
    updateButtonStates(true);
    hideAlert();
    displayText();
}

/**
 * Tekrar deneme işlemini başlatır
 */
function retryReading() {
    if (!state.isReading || state.currentWordIndex >= state.textWords.length) {
        return;
    }
    
    state.recognizedWords = [];
    hideAlert();
    elements.retryBtn.style.display = 'none';
    
    if (state.readingRecognition) {
        try {
            state.readingRecognition.stop();
            setTimeout(() => {
                if (state.isReading && state.readingRecognition) {
                    state.readingRecognition.start();
                }
            }, RECOGNITION_RESTART_DELAY);
        } catch (error) {
            console.error('Recognition restart error:', error);
        }
    }
}

/**
 * Buton durumlarını günceller
 * @param {boolean} isStopped - Durdurulmuş durumda mı?
 */
function updateButtonStates(isStopped = false) {
    if (isStopped) {
        elements.startReadingBtn.disabled = false;
        elements.stopReadingBtn.disabled = true;
        elements.retryBtn.style.display = 'none';
        elements.originalText.disabled = false;
    } else {
        elements.startReadingBtn.disabled = true;
        elements.stopReadingBtn.disabled = false;
        elements.retryBtn.style.display = 'none';
        elements.originalText.disabled = true;
    }
}

/**
 * Örnek metni yükler
 */
function loadExampleText() {
    elements.originalText.value = EXAMPLE_TEXT;
    displayText();
}

/**
 * Metin değiştiğinde çağrılır
 */
function handleTextChange() {
    if (!state.isReading) {
        state.currentWordIndex = 0;
        state.lastProcessedWordIndex = -1;
        displayText();
    }
}

// Event Listeners
elements.useExampleBtn.addEventListener('click', loadExampleText);
elements.originalText.addEventListener('input', handleTextChange);
elements.startReadingBtn.addEventListener('click', startReading);
elements.stopReadingBtn.addEventListener('click', stopReading);
elements.retryBtn.addEventListener('click', retryReading);

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    initializeSpeechRecognition();
    displayText();
});
