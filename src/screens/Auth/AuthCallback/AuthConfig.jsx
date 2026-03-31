export const authConfig = {
  issuer:
    import.meta.env.VITE_AUTH_ISSUER,
  authorizationEndpoint:
    import.meta.env.VITE_AUTHORIZATION_ENDPOINT,
  tokenEndpoint:
    import.meta.env.VITE_TOKEN_ENDPOINT,
  clientId: import.meta.env.VITE_CLIENT_ID || "",
  redirectUri:
    import.meta.env.VITE_REDIRECT_URI,
  scopes: [
    "openid",
    "profile",
    "email",
    "offline_access",
    "authorities",
    "privileges",
    "user_name",
    "created",
    "adminName",
    "bankCode",
    "goauthentik.io/api",
  ],
};