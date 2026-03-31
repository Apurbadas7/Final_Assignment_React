import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { fetchAllLanguages, fetchCurrentLanguage, updateLanguage } from '../../../api/languageApi';
import {
    setAllLanguages,
    setCurrentLanguage as setCachedCurrentLanguage,
    setLanguageLoaded,
    resetLanguageCache,
} from '../../../store/slices/languageSlice';

const Language = () => {
    const dispatch = useDispatch();
    const { selectedVpa } = useSelector((state) => state.auth);
    const { allLanguages, currentLanguage: cachedCurrentLanguage, loaded, lastFetchedSerial } = useSelector((state) => state.language);

    const serialNumber = selectedVpa?.serial_number || selectedVpa?.merchant_id || '';

    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [loadingInit, setLoadingInit] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');

    // On mount: use cached data if available for the same serial, else fetch
    useEffect(() => {
        const alreadyCached = loaded && lastFetchedSerial === serialNumber;
        if (alreadyCached) {
            // Restore selection from cache
            setSelectedLanguage(cachedCurrentLanguage);
            return;
        }

        const init = async () => {
            setLoadingInit(true);
            setError('');
            try {
                const [allRes, currentRes] = await Promise.all([
                    fetchAllLanguages(),
                    serialNumber ? fetchCurrentLanguage(serialNumber) : Promise.resolve(null),
                ]);

                const langs = Array.isArray(allRes)
                    ? allRes
                    : Array.isArray(allRes?.data)
                    ? allRes.data
                    : [];

                const curLang =
                    currentRes?.language_name ||
                    currentRes?.language ||
                    currentRes?.data?.language_name ||
                    currentRes?.data?.language ||
                    '';

                // Store in Redux cache
                dispatch(setAllLanguages(langs));
                dispatch(setCachedCurrentLanguage(curLang));
                dispatch(setLanguageLoaded(serialNumber));

                setSelectedLanguage(curLang);
            } catch (err) {
                setError(err.message || 'Failed to load language data.');
            } finally {
                setLoadingInit(false);
            }
        };
        init();
    }, [serialNumber, dispatch, loaded, lastFetchedSerial, cachedCurrentLanguage]);

    const handleUpdate = async () => {
        if (!selectedLanguage) return;
        setUpdating(true);
        setError('');
        try {
            await updateLanguage(serialNumber, selectedLanguage);
            // Update cache with new language
            dispatch(setCachedCurrentLanguage(selectedLanguage));
            dispatch(resetLanguageCache()); // force fresh fetch next time if needed
            dispatch(setCachedCurrentLanguage(selectedLanguage));
            dispatch(setLanguageLoaded(serialNumber));
            setShowSuccess(true);
        } catch (err) {
            setError(err.message || 'Failed to update language.');
        } finally {
            setUpdating(false);
        }
    };

    const handleCancel = () => {
        setSelectedLanguage(cachedCurrentLanguage);
        setError('');
    };

    const languageOptions = allLanguages.length > 0
        ? allLanguages
        : [
            { language_name: 'ENGLISH', language_code: 'ENGLISH' },
            { language_name: 'HINDI', language_code: 'HINDI' },
            { language_name: 'ODIA', language_code: 'ODIA' },
            { language_name: 'BENGALI', language_code: 'BENGALI' },
            { language_name: 'TAMIL', language_code: 'TAMIL' },
            { language_name: 'TELUGU', language_code: 'TELUGU' },
            { language_name: 'MARATHI', language_code: 'MARATHI' },
            { language_name: 'GUJARATI', language_code: 'GUJARATI' },
            { language_name: 'KANNADA', language_code: 'KANNADA' },
            { language_name: 'MALAYALAM', language_code: 'MALAYALAM' },
        ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%' }}
        >
            <div className="page-filter-card language-card" style={{ width: '100%', maxWidth: 'none' }}>
                {loadingInit ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '0.75rem' }}>
                        <Loader2 size={20} style={{ animation: 'spin 0.8s linear infinite' }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        <span style={{ color: '#64748b' }}>Loading language settings...</span>
                    </div>
                ) : (
                    <>
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label className="form-label">VPA ID</label>
                                <input type="text" className="form-input" value={selectedVpa?.vpa_id || '—'} readOnly />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Device Serial Number</label>
                                <input type="text" className="form-input" value={serialNumber || '—'} readOnly />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Current Language</label>
                                <input type="text" className="form-input" value={cachedCurrentLanguage || 'N/A'} readOnly />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Select Language</label>
                                <select
                                    className="form-input"
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                >
                                    <option value="">-- Select --</option>
                                    {languageOptions.map((lang, i) => {
                                        const code = lang.language_code || lang.code || lang;
                                        const name = lang.language_name || lang.name || lang;
                                        return <option key={i} value={code}>{name}</option>;
                                    })}
                                </select>
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        background: '#fff5f5', border: '1px solid #fed7d7',
                                        borderRadius: '6px', padding: '0.6rem 1rem',
                                        fontSize: '0.82rem', color: '#c53030', marginTop: '1rem',
                                    }}
                                >
                                    <AlertCircle size={15} /> {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                            <button
                                type="button"
                                onClick={handleCancel}
                                style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', padding: '0.5rem 1rem' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn-primary-sm"
                                style={{ 
                                    padding: '0.5rem 1.5rem', 
                                    borderRadius: '4px', 
                                    minWidth: '90px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    gap: '6px',
                                    backgroundColor: '#00836e',
                                    color: 'white',
                                    border: 'none',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                                onClick={handleUpdate}
                                disabled={updating || !selectedLanguage || selectedLanguage === cachedCurrentLanguage}
                            >
                                {updating
                                    ? <><Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Updating...</>
                                    : 'Update'}
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div style={{
                    backdropFilter: 'blur(3px)', backgroundColor: 'rgba(0,0,0,0.3)',
                    position: 'fixed', inset: 0, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ width: '380px', background: 'white', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflow: 'hidden', textAlign: 'center' }}>
                        <div style={{ padding: '2rem 1.5rem 1.5rem' }}>
                            <CheckCircle size={48} color="#00836e" style={{ margin: '0 auto 1rem', display: 'block' }} />
                            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>Success!</h3>
                            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                                Language updated to <strong>{selectedLanguage}</strong> successfully.
                            </p>
                        </div>
                        <div style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center' }}>
                            <button 
                                className="btn-primary-sm" 
                                style={{ 
                                    padding: '0.6rem 2rem', 
                                    borderRadius: '4px',
                                    backgroundColor: '#00836e',
                                    color: 'white',
                                    border: 'none',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }} 
                                onClick={() => setShowSuccess(false)}
                            >
                                Proceed
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default Language;
