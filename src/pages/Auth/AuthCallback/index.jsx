import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTokens, setUser, setVpaList, setSelectedVpa } from "../../../store/slices/authSlice";
import { authConfig } from "./AuthConfig";
import { fetchByMobileNumber } from "../../../api/userApi";
import { storage } from "../../../utils/storage";

function AuthCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  useEffect(() => {
    const processLogin = async () => {
      try {
        setError("");

        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const returnedState = params.get("state");
        const savedState = localStorage.getItem("auth_state");
        const codeVerifier = localStorage.getItem("code_verifier");
        const loginMobileNumber = storage.getLoginMobileNumber();

        if (!code) {
          throw new Error("Authorization code not found.");
        }

        if (!returnedState || returnedState !== savedState) {
          throw new Error("Invalid auth state. Please login again.");
        }

        if (!codeVerifier) {
          throw new Error("Missing code verifier. Please login again.");
        }

        if (!loginMobileNumber) {
          throw new Error("Missing login mobile number. Please login again.");
        }

        const tokenResponse = await fetch(authConfig.tokenEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: authConfig.clientId,
            code,
            redirect_uri: authConfig.redirectUri,
            code_verifier: codeVerifier,
          }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok || !tokenData.access_token) {
          throw new Error(tokenData.error_description || "Login failed.");
        }

        // Store token FIRST so userApi can retrieve it
        storage.setToken(tokenData.access_token);
        if (tokenData.id_token) {
           localStorage.setItem("id_token", tokenData.id_token);
        }
        storage.clearAuthArtifacts();

        const fetchByIdResponse = await fetchByMobileNumber(loginMobileNumber);
        const fetchedProfiles = Array.isArray(fetchByIdResponse?.data)
          ? fetchByIdResponse.data
          : [];

        if (fetchedProfiles.length === 0) {
          throw new Error("No VPA records found for this mobile number.");
        }

        storage.setProfileList(fetchedProfiles);
        // Do NOT auto-select — always show the VPA selection modal in dashboard

        dispatch(setTokens(tokenData.access_token));
        dispatch(setUser({
          name: fetchedProfiles[0]?.merchant_name || 'IDBI Bank Merchant',
          preferred_username: fetchedProfiles[0]?.vpa_id || loginMobileNumber,
          mobile: loginMobileNumber
        }));
        dispatch(setVpaList(fetchedProfiles));
        dispatch(setSelectedVpa(null)); // Always null → modal will always appear

        navigate('/dashboard', { replace: true });
      } catch (err) {
        setError(err.message || "Unable to complete login flow.");
      }
    };

    processLogin();
  }, [navigate]);

  if (!error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fa' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px', height: '48px', border: '4px solid #e2e8f0',
            borderTopColor: '#00836e', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <h3 style={{ color: '#00836e', fontWeight: 600, margin: 0 }}>Completing Login...</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '8px' }}>Please wait while we set up your session.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4">
      <div className="w-full max-w-md rounded bg-white p-6 shadow-md">
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      </div>
    </div>
  );
}

export default AuthCallback;