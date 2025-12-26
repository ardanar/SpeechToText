/**
 * Speech recognition configuration and constants
 */

export const CONFIG = {
    ALERT_AUTO_HIDE_DELAY: 2000, // ms
    CHECK_INTERVAL: 10, // ms - Very fast control for immediate response
    RECURSIVE_CHECK_DELAY: 0, // ms - Instant check
    RECOGNITION_RESTART_DELAY: 300, // ms
    MIN_WORD_LENGTH_FOR_WARNING: 2,
    WORD_MATCH_THRESHOLD: 0.7, // Similarity threshold for fuzzy matching
    MAX_BATCH_PROCESSING: 50, // Maximum words to process in one batch (prevent stack overflow)
    INTERIM_MIN_LENGTH: 3, // Minimum length for interim results to be processed
};

// Example text for testing
export const EXAMPLE_TEXT = "Gagavuz kuşunun gagası gerdandan sarkar, ger ger gerilen gergefin gültası Galata'dan galat gergedana gül atar.";

// Turkish number dictionary (word -> digit)
export const TURKISH_NUMBER_MAP = {
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

// Reverse dictionary (digit -> word)
export const NUMBER_TO_TURKISH = Object.fromEntries(
    Object.entries(TURKISH_NUMBER_MAP).map(([key, value]) => [value, key])
);

