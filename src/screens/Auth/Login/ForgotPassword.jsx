import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowLeft, Lock, CheckCircle2, Eye, EyeOff, Loader2 } from 'lucide-react';
import '../../../styles/ForgotPassword.css';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [passwords, setPasswords] = useState({ new: '', confirm: '' });
    const [showPass, setShowPass] = useState(false);
    
    const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
    const navigate = useNavigate();

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Move to next input
        if (value && index < 5) {
            otpRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs[index - 1].current.focus();
        }
    };

    const nextStep = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(s => s + 1);
        }, 1200);
    };

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className="forgot-password-container">
            <div className="bg-shape shape-1" />
            <div className="bg-shape shape-2" />

            <motion.div 
                className="forgot-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {step > 1 && step < 4 && (
                    <button className="back-button" onClick={() => setStep(s => s - 1)}>
                        <ArrowLeft size={16} /> Back
                    </button>
                )}

                <div className="forgot-header">
                    <img src="/logo.svg" alt="IDBI Bank Logo" className="forgot-logo" />
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="h1" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                                <h2>Forgot Password</h2>
                                <p>Lost your password? No worries. Enter your Mobile Number, and we'll help you reset it.</p>
                            </motion.div>
                        )}
                        {step === 2 && (
                            <motion.div key="h2" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                                <h2>Verification Code</h2>
                                <p>We've sent a 6-digit code to your registered mobile number: <b>{mobile}</b></p>
                            </motion.div>
                        )}
                        {step === 3 && (
                            <motion.div key="h3" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                                <h2>Reset Password</h2>
                                <p>Choose a strong and secure password for your account.</p>
                            </motion.div>
                        )}
                        {step === 4 && (
                            <motion.div key="h4" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                                <h2>Password Changed!</h2>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="step-content">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="s1" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                                <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                                    <div className="form-group">
                                        <label className="form-label">Mobile Number</label>
                                        <div className="input-wrapper">
                                            <Phone className="input-icon" size={18} />
                                            <input 
                                                type="tel" 
                                                className="input-field" 
                                                placeholder="Enter Mobile Number" 
                                                value={mobile}
                                                onChange={(e) => setMobile(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="full-button login-button" disabled={loading}>
                                        {loading ? <Loader2 className="animate-spin m-auto" size={20} /> : "Continue"}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="s2" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                                <div className="otp-container">
                                    {otp.map((digit, i) => (
                                        <input 
                                            key={i}
                                            ref={otpRefs[i]}
                                            type="text" 
                                            className="otp-box" 
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(i, e)}
                                        />
                                    ))}
                                </div>
                                <div className="resend-text">
                                    Didn't receive code? <span className="resend-link">Resend Code</span>
                                </div>
                                <button onClick={nextStep} className="full-button login-button" disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin m-auto" size={20} /> : "Verify Code"}
                                </button>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="s3" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                                <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                                    <div className="form-group">
                                        <label className="form-label">New Password</label>
                                        <div className="input-wrapper">
                                            <Lock className="input-icon" size={18} />
                                            <input 
                                                type={showPass ? "text" : "password"} 
                                                className="input-field" 
                                                placeholder="Enter New Password"
                                                value={passwords.new}
                                                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                                required
                                            />
                                            <div className="eye-icon" onClick={() => setShowPass(!showPass)}>
                                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Confirm Password</label>
                                        <div className="input-wrapper">
                                            <Lock className="input-icon" size={18} />
                                            <input 
                                                type={showPass ? "text" : "password"} 
                                                className="input-field" 
                                                placeholder="Confirm New Password"
                                                value={passwords.confirm}
                                                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="full-button login-button" disabled={loading}>
                                        {loading ? <Loader2 className="animate-spin m-auto" size={20} /> : "Reset Password"}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div key="s4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" style={{textAlign: 'center'}}>
                                <div className="success-icon-container">
                                    <motion.div 
                                        className="success-circle"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", damping: 12 }}
                                    >
                                        <CheckCircle2 size={48} />
                                    </motion.div>
                                </div>
                                <p style={{marginBottom: '2rem'}}>The password has been changed successfully. You can now login with your new credentials.</p>
                                <button onClick={() => navigate('/login')} className="full-button login-button">
                                    Continue to Login
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
