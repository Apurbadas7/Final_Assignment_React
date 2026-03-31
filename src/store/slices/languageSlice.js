import { createSlice } from '@reduxjs/toolkit';

// Caches language data in Redux for the session.
// When user navigates away and comes back, the cached data is used instantly
// without re-fetching from the API.

const languageSlice = createSlice({
    name: 'language',
    initialState: {
        allLanguages: [],       // List from GET /lang/fetch_language
        currentLanguage: '',    // From GET /user_api/current_language/{serial}
        lastFetchedSerial: '',  // Track which serial number was last fetched
        loaded: false,          // Whether initial fetch happened
    },
    reducers: {
        setAllLanguages: (state, action) => {
            state.allLanguages = action.payload;
        },
        setCurrentLanguage: (state, action) => {
            state.currentLanguage = action.payload;
        },
        setLanguageLoaded: (state, action) => {
            state.loaded = true;
            state.lastFetchedSerial = action.payload; // serial number used
        },
        resetLanguageCache: (state) => {
            state.loaded = false;
            state.currentLanguage = '';
            state.lastFetchedSerial = '';
        },
    },
});

export const { setAllLanguages, setCurrentLanguage, setLanguageLoaded, resetLanguageCache } = languageSlice.actions;
export default languageSlice.reducer;
