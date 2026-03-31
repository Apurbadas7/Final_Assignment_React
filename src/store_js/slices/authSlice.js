import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    tokens: null,
    user: {
        name: "Stebin Ben",
        preferred_username: "stebin_admin"
    },
    vpaList: [],
    selectedVpa: null,
    loading: false,
    error: null,
    isAuthenticated: false, // Enforce login via Authentik
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setTokens: (state, action) => {
            state.tokens = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setVpaList: (state, action) => {
            state.vpaList = action.payload;
        },
        setSelectedVpa: (state, action) => {
            state.selectedVpa = action.payload;
        },
        logout: (state) => {
            state.tokens = null;
            state.user = null;
            state.vpaList = [];
            state.selectedVpa = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setTokens, setUser, setLoading, setError, setVpaList, setSelectedVpa, logout } = authSlice.actions;
export default authSlice.reducer;
