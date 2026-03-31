import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { login } from '../../../components/common/GenerateRandomString';
import '../../../styles/Login.css';

const Login = () => {
    useEffect(() => {
        login().catch(err => console.error('Auto-login redirect failed:', err));
    }, []);

    return (
        <div className="login-container">
            <div className="bg-shape shape-1" />
            <div className="bg-shape shape-2" />
            <div style={{ textAlign: 'center', zIndex: 10, position: 'relative' }}>
                <div style={{
                    width: '52px', height: '52px',
                    border: '4px solid #e2e8f0',
                    borderTopColor: '#00836e', // IDBI Green
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    margin: '0 auto 20px',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <img src="/idbi_bank_logo.svg" alt="IDBI Bank" style={{ height: '52px', marginBottom: '16px', display: 'block', margin: '0 auto 16px', borderRadius: '8px' }} />
                <h2 style={{ fontSize: '1.2rem', color: '#1a2332', fontWeight: 600, margin: '0 0 8px' }}>
                    Redirecting to Secure Login...
                </h2>
                <p style={{ color: '#6b7a90', fontSize: '0.9rem', margin: 0 }}>
                    You will be taken to the Authentik login page shortly.
                </p>
            </div>
        </div>
    );
};

export default Login;
