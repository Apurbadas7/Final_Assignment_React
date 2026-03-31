import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Card, 
    RadioGroup, 
    FormControlLabel, 
    Radio, 
    Stack, 
    Button, 
    Grid, 
    TextField, 
    CircularProgress
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { Download, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import { generateQrBase64 } from '../../../api/qrApi';

const QRDetails = () => {
    const authState = useSelector((state) => state.auth) || {};
    const { selectedVpa, isAuthenticated } = authState;
    const [filter, setFilter] = useState('static');
    const [qrImage, setQrImage] = useState('');
    const [timeLeft, setTimeLeft] = useState(0); // in seconds
    const [isLoading, setIsLoading] = useState(false);
    const [generatedAmount, setGeneratedAmount] = useState(null);

    // Defensive check
    if (!isAuthenticated && !selectedVpa) {
        console.warn('[QRDetails] Not authenticated or no VPA selected');
    }

    const validationSchema = Yup.object({
        amount: Yup.number()
            .typeError('Amount must be a number')
            .required('Amount is required')
            .positive('Amount must be greater than 0')
    });

    const formik = useFormik({
        initialValues: {
            amount: ''
        },
        validationSchema,
        onSubmit: (values) => {
            handleGetQrCode(true, values.amount);
        }
    });

    const handleGetQrCode = async (isForDynamic = false, dynamicAmount = null) => {
        setIsLoading(true);
        try {
            const vpa = selectedVpa?.vpa_id || 'merchant.iserveu@idbi';
            const name = selectedVpa?.merchant_name || 'IDBI Merchant';
            
            let qrString = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(name)}&cu=INR&mode=01&purpose=00&mc=5411&tid=TXN${Date.now()}`;
            
            if (isForDynamic && dynamicAmount) {
                qrString += `&am=${parseFloat(dynamicAmount).toFixed(2)}`;
            }

            const base64Data = await generateQrBase64(qrString);
            if (base64Data && base64Data.length > 50) {
                const cleaned = base64Data.trim();
                setQrImage(cleaned.startsWith('data:image') ? cleaned : `data:image/png;base64,${cleaned}`);
                
                if (isForDynamic) {
                    setGeneratedAmount(dynamicAmount);
                    setTimeLeft(90);
                } else {
                    setGeneratedAmount(null);
                    setTimeLeft(0);
                }
            } else {
                setQrImage('');
                throw new Error('API request succeeded, but no valid QR image data was found in the response.');
            }
        } catch (error) {
            console.error('Error generating QR code:', error);
            const msg = error.message || 'Failed to generate QR code';
            if (toast && toast.error) {
                toast.error(msg);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadQR = () => {
        if (!qrImage) return;
        const link = document.createElement('a');
        link.href = qrImage;
        link.download = `QR_${filter}_${selectedVpa?.merchant_name || 'Merchant'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleChange = (event) => {
        setFilter(event.target.value);
        setQrImage('');
        setTimeLeft(0);
        setGeneratedAmount(null);
        formik.resetForm();
    };

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    useEffect(() => {
        if (timeLeft <= 0) return;
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setQrImage('');
                    setGeneratedAmount(null);
                    formik.resetForm();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [timeLeft]);

    // Auto-load Static QR on mount if VPA is available
    useEffect(() => {
        if (selectedVpa && filter === 'static' && !qrImage && !isLoading) {
            handleGetQrCode(false);
        }
    }, [selectedVpa, filter]);

    return (
        <Box sx={{ p: 1 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                    
                </Typography>

                <Card elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: '12px', mb: 3 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={filter === 'static' ? 'center' : 'flex-start'} spacing={2}>
                        <Stack>
                            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#4a5568', mb: 1 }}>
                                Select The Type of QR
                            </Typography>
                            <RadioGroup value={filter} onChange={handleChange} row>
                                <FormControlLabel 
                                    value="static" 
                                    control={<Radio sx={{ color: '#00836e', '&.Mui-checked': { color: '#00836e' } }} />} 
                                    label={<Typography sx={{ fontSize: '0.9rem' }}>Static</Typography>} 
                                />
                                <FormControlLabel 
                                    value="dynamic" 
                                    control={<Radio sx={{ color: '#00836e', '&.Mui-checked': { color: '#00836e' } }} />} 
                                    label={<Typography sx={{ fontSize: '0.9rem' }}>Dynamic</Typography>} 
                                />
                            </RadioGroup>
                        </Stack>
                        {filter === 'static' && (
                            <Button
                                variant="contained"
                                disabled={isLoading}
                                onClick={() => handleGetQrCode(false)}
                                sx={{ 
                                    background: '#00836e', 
                                    textTransform: 'none', 
                                    px: 4,
                                    '&:hover': { background: '#006d5b' } 
                                }}
                            >
                                {isLoading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Submit'}
                            </Button>
                        )}
                    </Stack>

                    {filter === 'dynamic' && (
                        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3, pt: 3, borderTop: '1px solid #f1f5f9' }}>
                            <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Info size={14} /> Enter an amount to instantly generate your dynamic QR code
                            </Typography>

                            <Grid container spacing={3} alignItems="flex-start">
                                <Grid item xs={12} sm={5}>
                                    <Stack spacing={1}>
                                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#4b5563' }}>
                                            Amount to be collected
                                        </Typography>
                                        <TextField
                                            name="amount"
                                            placeholder="Enter the amount"
                                            fullWidth
                                            size="small"
                                            value={formik.values.amount}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.amount && Boolean(formik.errors.amount)}
                                            helperText={formik.touched.amount && formik.errors.amount}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Box sx={{ height: { xs: 0, sm: 26 } }} />
                                    <Button 
                                        variant="contained" 
                                        type="submit" 
                                        fullWidth
                                        disabled={!formik.isValid || !formik.dirty || isLoading}
                                        sx={{ 
                                            background: '#00836e', 
                                            textTransform: 'none', 
                                            py: 1,
                                            borderRadius: '8px',
                                            '&:hover': { background: '#006d5b' }
                                        }}
                                    >
                                        {isLoading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Generate QR'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Card>

                {qrImage && (
                    <Card
                        elevation={0}
                        sx={{
                            p: 4,
                            border: '1px solid #e2e8f0',
                            borderRadius: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                            maxWidth: '500px',
                            margin: '0 auto',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', mb: 2 }}>
                             <img src="/idbi_bank_logo.svg" alt="IDBI Bank" style={{ height: '45px', borderRadius: '4px' }} />
                        </Box>

                        <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', textAlign: 'center', textTransform: 'uppercase' }}>
                            {selectedVpa?.merchant_name || 'MERCHANT NAME'}
                        </Typography>
                        
                        <Typography sx={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, mt: -1 }}>
                            Scan & Pay
                        </Typography>

                        {generatedAmount && (
                            <Box sx={{ background: '#e6f4ea', color: '#00836e', py: 0.5, px: 2, borderRadius: '20px', fontWeight: 700, fontSize: '0.9rem' }}>
                                ₹ {generatedAmount}
                            </Box>
                        )}

                        <Box sx={{ 
                            p: 2, 
                            background: '#f8fafc', 
                            borderRadius: '16px', 
                            border: '1px solid #e2e8f0',
                            width: '280px',
                            height: '280px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {qrImage && qrImage.length > 100 ? (
                                <Box sx={{ width: '240px', height: '240px', overflow: 'hidden', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                                    <Box
                                        component="img"
                                        src={qrImage}
                                        alt="QR Code"
                                        sx={{
                                            width: 'auto',
                                            height: '210%', // Zoom in to hide the outer branding
                                            objectFit: 'contain',
                                            transform: 'translateY(2%)', // Adjust vertical center
                                            display: 'block'
                                        }}
                                    />
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                    <CircularProgress size={40} sx={{ color: '#00836e' }} />
                                    <Typography variant="caption" color="text.secondary">Loading QR Code...</Typography>
                                </Box>
                            )}
                        </Box>

                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                            UPI ID: <span style={{ color: '#00836e' }}>{selectedVpa?.vpa_id || 'vpa@idbi'}</span>
                        </Typography>

                        {filter === 'dynamic' && timeLeft > 0 && (
                            <Typography variant="body2" sx={{ color: '#ef4444', fontWeight: 600 }}>
                                Valid till {formatTime(timeLeft)}
                            </Typography>
                        )}

                        <Button 
                            variant="contained" 
                            onClick={handleDownloadQR}
                            startIcon={<Download size={18} />}
                            sx={{ 
                                mt: 1, 
                                background: '#00836e', 
                                borderRadius: '8px', 
                                textTransform: 'none',
                                px: 4,
                                '&:hover': { background: '#006d5b' }
                            }}
                        >
                            Download QR
                        </Button>
                    </Card>
                )}
        </Box>
    );
};

export default QRDetails;
