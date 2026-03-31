import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { jwtDecode } from 'jwt-decode';
import { authConfig } from '../../config/authConfig';
import { log } from '../../utils/logger';
import { restartSession } from '../../utils/sessionManager';
import { logout as logoutAction, setError, setTokens, setUser } from '../slices/authSlice';

// Adapter to use oidc-client-ts like react-native-app-auth
const oidcSettings = {
    authority: authConfig.issuer,
    client_id: authConfig.clientId,
    redirect_uri: authConfig.redirectUrl,
    scope: authConfig.scopes.join(' '),
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    response_type: 'code',
};

const userManager = new UserManager(oidcSettings);

/**
 * Redux async thunk that performs full login flow:
 * - Redirects to authentication screen (OIDC)
 */
export const performLogin = createAsyncThunk(
    "auth/login",
    async (_, { rejectWithValue }) => {
        log("[Login] Starting login process...");
        try {
            // In web, we redirect
            await userManager.signinRedirect();
            return null;
        } catch (err) {
            log("[Login] Login redirect failed:", err);
            return rejectWithValue(err.message || "Login failed");
        }
    }
);

/**
 * Handle the callback from the OIDC provider
 */
export const handleCallback = createAsyncThunk(
    "auth/handleCallback",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const user = await userManager.signinRedirectCallback();
            log("[Login] Auth success, received user:", user);

            const tokens = {
                accessToken: user.access_token,
                refreshToken: user.refresh_token,
                idToken: user.id_token,
                accessTokenExpirationDate: new Date(user.expires_at * 1000).toISOString(),
            };

            const decodeTokenPayload = jwtDecode(tokens.accessToken);
            
            // Persist tokens securely in localStorage (web)
            localStorage.setItem('oauth_tokens', JSON.stringify(tokens));
            localStorage.setItem('token_payload', JSON.stringify(decodeTokenPayload));

            dispatch(setTokens(tokens));
            dispatch(setUser(decodeTokenPayload));
            restartSession();

            return tokens;
        } catch (err) {
            log("[Callback] Error handling callback:", err);
            return rejectWithValue(err.message || "Callback failed");
        }
    }
);

/**
 * Redux async thunk that performs full logout flow:
 */
export const performLogout = createAsyncThunk(
    "auth/logout",
    async (_, { dispatch, rejectWithValue }) => {
        log("[Logout] Starting logout process...");
        try {
            await userManager.signoutRedirect();
            localStorage.removeItem('oauth_tokens');
            localStorage.removeItem('token_payload');
            dispatch(logoutAction());
        } catch (err) {
            log("[Logout] Logout error:", err);
            return rejectWithValue(err.message || "Logout failed");
        }
    }
);

/**
 * Initialize auth from localStorage on app start
 */
export const initializeAuth = createAsyncThunk(
    "auth/initialize",
    async (_, { dispatch }) => {
        const tokensStr = localStorage.getItem('oauth_tokens');
        const payloadStr = localStorage.getItem('token_payload');

        if (tokensStr && payloadStr) {
            dispatch(setTokens(JSON.parse(tokensStr)));
            dispatch(setUser(JSON.parse(payloadStr)));
            return true;
        }
        return false;
    }
);
