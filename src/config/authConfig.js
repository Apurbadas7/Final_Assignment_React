export const authConfig = {
  issuer: 'https://idbi-auth-stage.isupay.in/application/o/merchant-application/',
  clientId: 'f8VJ2UAbdFFEKRW1pkO1rFiA',
  redirectUrl: window.location.origin + '/callback', // For web applications
  scopes: [
    "adminName",
    "user_name",
    "goauthentik.io/api",
    "authorities",
    "bankCode",
    "email",
    "profile",
    "openid",
    "offline_access",
    "created",
    "privileges"
  ], 
  dangerouslyAllowInsecureHttpRequests: false,
};
