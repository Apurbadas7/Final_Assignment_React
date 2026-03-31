import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import languageReducer from './slices/languageSlice';
import menuReducer from './slices/menuSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        language: languageReducer,
        menu: menuReducer,
    },
});

export default store;
