# SpeechToText Integration Plan for Okuma-Kocu

## 📋 Overview

This document outlines the plan to integrate the advanced speech recognition features from the SpeechToText project into the okuma-kocu React application, specifically enhancing the `ReadingScreen` component.

## 🔍 Analysis

### SpeechToText Project Features
1. **Advanced Word Matching**
   - Real-time word-by-word comparison
   - Turkish number support (digit ↔ word conversion)
   - Fuzzy matching with similarity threshold
   - Previous word repetition detection

2. **Speech Recognition**
   - Web Speech API integration
   - Continuous recognition with interim results
   - Error handling and auto-restart
   - Free speech tracking (all recognized speech)

3. **State Management**
   - Modular state management
   - Word-by-word progress tracking
   - Error state handling
   - Retry functionality

4. **UI Features**
   - Color-coded word display (completed, current, pending)
   - Real-time progress indicators
   - Alert messages for errors
   - Free speech output area

### Current ReadingScreen Analysis
- Already has basic Web Speech API integration
- Uses React hooks and state management
- Has word matching but simpler implementation
- Missing Turkish number support
- Missing free speech tracking
- Less sophisticated error handling

## 🎯 Implementation Strategy

### Phase 1: Create Utility Modules (React-compatible)

#### 1.1 Text Utilities (`src/utils/textUtils.js`)
- `normalizeWord(word)` - Normalize text (lowercase, remove punctuation)
- `parseText(text)` - Split text into words
- `calculateSimilarity(word1, word2)` - Calculate word similarity (Levenshtein-based)

#### 1.2 Number Utilities (`src/utils/numberUtils.js`)
- `turkishNumberToDigit(word)` - Convert Turkish number words to digits
- `digitToTurkishNumber(digit)` - Convert digits to Turkish words
- `isNumber(word)` - Check if word is a number
- `extractNumberFromWord(word)` - Extract number from combined words (e.g., "üçyıl" → "üç")

#### 1.3 Word Matching (`src/utils/wordMatcher.js`)
- `wordsMatch(expectedWord, recognizedWord)` - Advanced word matching with:
  - Direct match
  - Number conversion matching
  - Fuzzy similarity matching
  - Partial word matching

#### 1.4 Configuration (`src/config/speechConfig.js`)
- `CONFIG` object with thresholds and delays
- `TURKISH_NUMBER_MAP` - Turkish number dictionary
- `NUMBER_TO_TURKISH` - Reverse mapping

### Phase 2: Create React Hooks

#### 2.1 Speech Recognition Hook (`src/hooks/useSpeechRecognition.js`)
- Custom React hook for Web Speech API
- Handles initialization, start, stop, restart
- Manages recognition events (result, error, end)
- Returns: `{ isListening, transcript, interim, error, start, stop, restart }`

#### 2.2 Word Checking Hook (`src/hooks/useWordChecker.js`)
- Custom hook for word-by-word matching
- Integrates with speech recognition
- Handles progress tracking
- Returns: `{ currentWordIndex, matchedWords, errors, checkWord }`

### Phase 3: Enhance ReadingScreen Component

#### 3.1 Integrate New Utilities
- Replace simple word matching with advanced matching
- Add Turkish number support
- Implement fuzzy matching

#### 3.2 Add Free Speech Tracking
- Add UI component to display all recognized speech
- Track both final and interim results
- Add clear functionality

#### 3.3 Improve Error Handling
- Better error messages
- Retry from sentence start
- Continue after error option
- Visual error indicators

#### 3.4 Enhanced UI Features
- Better word highlighting (completed, current, error, pending)
- Progress indicators
- Real-time statistics
- Alert/notification system

### Phase 4: Component Structure

```
src/
├── utils/
│   ├── textUtils.js          # Text normalization and parsing
│   ├── numberUtils.js        # Turkish number conversions
│   └── wordMatcher.js        # Advanced word matching
├── config/
│   └── speechConfig.js       # Configuration constants
├── hooks/
│   ├── useSpeechRecognition.js  # Speech API hook
│   └── useWordChecker.js        # Word matching hook
├── components/
│   ├── WordDisplay.jsx       # Word-by-word display component
│   ├── SpeechStatus.jsx     # Speech recognition status
│   ├── FreeSpeechOutput.jsx # Free speech tracking display
│   └── ErrorModal.jsx       # Error handling modal
└── pages/
    └── ReadingScreen.jsx    # Enhanced reading screen
```

## 📝 Detailed Implementation Steps

### Step 1: Create Utility Files
1. Copy and adapt `textUtils.js` from SpeechToText
2. Copy and adapt `numberUtils.js` from SpeechToText
3. Copy and adapt `wordMatcher.js` from SpeechToText
4. Create `speechConfig.js` with configuration

### Step 2: Create React Hooks
1. Create `useSpeechRecognition.js` hook
   - Wrap Web Speech API in React hook
   - Handle lifecycle and events
   - Return React-friendly state and functions

2. Create `useWordChecker.js` hook
   - Integrate word matching logic
   - Track progress and errors
   - Handle retry logic

### Step 3: Create UI Components
1. `WordDisplay.jsx` - Display words with color coding
2. `SpeechStatus.jsx` - Show listening status
3. `FreeSpeechOutput.jsx` - Display all recognized speech
4. `ErrorModal.jsx` - Error handling UI

### Step 4: Refactor ReadingScreen
1. Import new utilities and hooks
2. Replace existing word matching logic
3. Add free speech tracking
4. Enhance error handling
5. Update UI with new components
6. Maintain existing navigation and result passing

### Step 5: Testing & Refinement
1. Test with various texts
2. Test Turkish number recognition
3. Test error scenarios
4. Test retry functionality
5. Optimize performance
6. Polish UI/UX

## 🔧 Technical Considerations

### React Integration
- Convert vanilla JS modules to ES6 modules compatible with React
- Use React hooks instead of global state
- Maintain component lifecycle properly
- Use React refs for DOM access when needed

### State Management
- Use React useState for component state
- Use useRef for values that don't trigger re-renders
- Consider useReducer for complex state logic

### Performance
- Optimize word matching algorithms
- Debounce/throttle where appropriate
- Memoize expensive calculations
- Avoid unnecessary re-renders

### Browser Compatibility
- Web Speech API support check
- Fallback for unsupported browsers
- Handle permission requests gracefully

## 📦 Dependencies

No new dependencies required - all features use:
- React (already installed)
- Web Speech API (browser native)
- Existing Tailwind CSS

## 🎨 UI/UX Enhancements

1. **Word Display**
   - Green: Completed words
   - Blue (highlighted): Current word
   - Red: Error word
   - Gray: Pending words

2. **Progress Indicators**
   - Progress bar
   - Word count (current/total)
   - Percentage complete

3. **Error Handling**
   - Modal for errors
   - Clear error messages
   - Retry options
   - Continue option

4. **Free Speech Output**
   - Scrollable text area
   - Shows all recognized speech
   - Clear button
   - Real-time updates

## ✅ Success Criteria

1. ✅ Advanced word matching works correctly
2. ✅ Turkish number recognition works (both digits and words)
3. ✅ Free speech tracking displays all recognized text
4. ✅ Error handling provides clear feedback
5. ✅ Retry functionality works from sentence start
6. ✅ UI is responsive and user-friendly
7. ✅ Performance is acceptable (no lag)
8. ✅ Integration doesn't break existing features

## 🚀 Implementation Order

1. **Week 1: Foundation**
   - Create utility modules
   - Create configuration file
   - Basic testing

2. **Week 2: React Integration**
   - Create React hooks
   - Create UI components
   - Integrate with ReadingScreen

3. **Week 3: Enhancement**
   - Add free speech tracking
   - Improve error handling
   - Polish UI/UX

4. **Week 4: Testing & Refinement**
   - Comprehensive testing
   - Bug fixes
   - Performance optimization
   - Documentation

## 📚 Files to Create/Modify

### New Files
- `src/utils/textUtils.js`
- `src/utils/numberUtils.js`
- `src/utils/wordMatcher.js`
- `src/config/speechConfig.js`
- `src/hooks/useSpeechRecognition.js`
- `src/hooks/useWordChecker.js`
- `src/components/WordDisplay.jsx`
- `src/components/SpeechStatus.jsx`
- `src/components/FreeSpeechOutput.jsx`
- `src/components/ErrorModal.jsx`

### Modified Files
- `src/pages/ReadingScreen.jsx` - Major refactoring

## 🔄 Migration Notes

- Preserve existing navigation flow
- Maintain result data structure for StudentResult page
- Keep existing timer functionality
- Maintain compatibility with existing routes

## 📖 Additional Notes

- The SpeechToText project uses vanilla JS with modular architecture
- Need to adapt to React patterns (hooks, components, state)
- Some logic can be directly ported, others need React adaptation
- UI styling should match existing Tailwind theme
- Consider accessibility (ARIA labels, keyboard navigation)

