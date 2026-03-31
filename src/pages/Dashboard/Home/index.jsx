import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeftRight, Wallet } from 'lucide-react';
import { setSelectedVpa } from '../../../store/slices/authSlice';
import { storage } from '../../../utils/storage';
import KPICard from '../../../components/Dashboard/KPICard';

const DashboardHome = () => {
    const dispatch = useDispatch();
    const { vpaList, selectedVpa } = useSelector((state) => state.auth);
    const [modalSelectedIdx, setModalSelectedIdx] = useState(0);

    const showVPAModal = !selectedVpa;

    const handleProceed = () => {
        const chosen = vpaList[modalSelectedIdx] ?? vpaList[0];
        if (chosen) {
            dispatch(setSelectedVpa(chosen));
            storage.setSelectedProfile(chosen);
        }
    };

    const handleCancel = () => {
        const first = vpaList[0];
        if (first) {
            dispatch(setSelectedVpa(first));
            storage.setSelectedProfile(first);
        }
    };

    return (
        <React.Fragment>
            {/* Page Header */}
            <div 
                className="page-header" 
                style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '1.5rem' 
                }}
            >
                <div 
                    style={{ 
                        fontSize: '0.9rem', 
                        color: 'var(--text-dark)',
                        letterSpacing: '0.2px'
                    }}
                >
                    <span style={{ fontWeight: 600 }}>ID : </span>
                    {selectedVpa?.vpa_id || '—'}
                </div>

                <select 
                    className="filter-select" 
                    style={{ 
                        padding: '0.45rem 0.9rem', 
                        borderRadius: '8px', 
                        fontSize: '0.85rem',
                        border: '1px solid var(--border-color)',
                        outline: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <option>Today</option>
                    <option>Yesterday</option>
                    <option>Last 7 Days</option>
                </select>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid">
                <KPICard 
                    title="Total No of Transaction" 
                    value="20.7K" 
                    icon={<ArrowLeftRight size={24} style={{ opacity: 0.9 }} />} 
                    color="#004a8f" 
                    trend="up" 
                    trendValue="12.5" 
                />
                <KPICard 
                    title="Total Amount" 
                    value="76,000 cr" 
                    icon={<Wallet size={24} style={{ opacity: 0.9 }} />} 
                    color="#004a8f" 
                    trend="up" 
                    trendValue="8.2" 
                />
            </div>

            {/* Modal */}
            {showVPAModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.45)',
                    backdropFilter: 'blur(6px)'
                }}>
                    <div style={{
                        width: '420px',
                        background: '#fff',
                        borderRadius: '16px',
                        boxShadow: '0 25px 70px rgba(0,0,0,0.2)',
                        overflow: 'hidden',
                        fontFamily: 'Inter, sans-serif',
                        animation: 'fadeIn 0.2s ease'
                    }}>
                        {/* Header */}
                        <div style={{
                            padding: '1.125rem 1.5rem',
                            borderBottom: '1px solid #e9ecf1',
                            background: '#f7f9fc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <h3 style={{ 
                                margin: 0, 
                                fontSize: '0.975rem', 
                                fontWeight: 600, 
                                color: '#1a2332',
                                letterSpacing: '0.2px'
                            }}>
                                Select VPA
                            </h3>
                        </div>

                        {/* Subheading */}
                        <div style={{ padding: '1rem 1.5rem 0' }}>
                            <p style={{ 
                                margin: 0, 
                                fontSize: '0.825rem', 
                                color: '#6b7a90' 
                            }}>
                                Select a VPA to Proceed
                            </p>
                        </div>

                        {/* List */}
                        <div style={{ 
                            padding: '0.75rem 1.5rem 1.25rem', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '0.625rem', 
                            maxHeight: '300px', 
                            overflowY: 'auto' 
                        }}>
                            {vpaList.length === 0 ? (
                                <p style={{ color: '#e53e3e', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>
                                    No VPAs found for your account.
                                </p>
                            ) : (
                                vpaList.map((vpa, index) => {
                                    const isSelected = modalSelectedIdx === index;
                                    return (
                                        <label
                                            key={vpa?.merchant_id || vpa?.vpa_id || index}
                                            onClick={() => setModalSelectedIdx(index)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.875rem',
                                                padding: '0.875rem 1rem',
                                                border: `1.5px solid ${isSelected ? '#1b438b' : '#dde3ed'}`,
                                                borderRadius: '10px',
                                                cursor: 'pointer',
                                                background: isSelected ? '#eef3fb' : '#fff',
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            <div style={{
                                                flexShrink: 0,
                                                width: '18px', height: '18px',
                                                borderRadius: '50%',
                                                border: `2px solid ${isSelected ? '#1b438b' : '#bcc5d4'}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                background: '#fff',
                                            }}>
                                                {isSelected && (
                                                    <div style={{
                                                        width: '9px', height: '9px',
                                                        borderRadius: '50%',
                                                        background: '#1b438b',
                                                    }} />
                                                )}
                                            </div>

                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{
                                                    fontSize: '0.875rem',
                                                    fontWeight: 500,
                                                    color: '#1a2332',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {vpa?.vpa_id || '—'}
                                                </div>
                                                {vpa?.merchant_name && (
                                                    <div style={{ fontSize: '0.775rem', color: '#6b7a90', marginTop: '2px' }}>
                                                        {vpa.merchant_name}
                                                        {vpa.merchant_mobile ? ` · ${vpa.merchant_mobile}` : ''}
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{
                            padding: '1rem 1.5rem',
                            borderTop: '1px solid #e9ecf1',
                            background: '#f7f9fc',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '0.75rem',
                        }}>
                            <button
                                onClick={handleCancel}
                                style={{
                                    padding: '0.55rem 1.25rem',
                                    border: '1.5px solid #dde3ed',
                                    borderRadius: '8px',
                                    background: '#fff',
                                    color: '#4a5568',
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleProceed}
                                disabled={vpaList.length === 0}
                                style={{
                                    padding: '0.55rem 1.5rem',
                                    border: 'none',
                                    borderRadius: '8px',
                                    background: vpaList.length === 0 ? '#94a3b8' : '#1b438b',
                                    color: '#fff',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    cursor: vpaList.length === 0 ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                Proceed
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default DashboardHome;