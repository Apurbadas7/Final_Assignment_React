import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, LogOut, User, ChevronDown } from 'lucide-react';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { performLogout } from '../../store_js/thunks/authThunks';
import { handlerDrawerOpen } from '../../store_js/slices/menuSlice';

const pageTitles = {
    '/': 'Dashboard',
    '/dashboard': 'Dashboard',
    '/dashboard/transactions': 'Transaction Report',
    '/dashboard/qr-details': 'QR Details',
    '/dashboard/language': 'Language Update',
    '/dashboard/support': 'Help & Support',
    '/profile': 'View Profile',
};

const Header = ({ onOpenProfile }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);
    const { isDashboardDrawerOpened: drawerOpen } = useSelector((state) => state.menu);
    const [showDropdown, setShowDropdown] = useState(false);

    const currentTitle = pageTitles[location.pathname] || 'Dashboard';

    const handleLogout = () => {
        dispatch(performLogout());
        setShowDropdown(false);
    };

    return (
        <header 
            className="dashboard-header" 
            style={{ 
                padding: '0 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}
        >
            <div 
                className="header-left" 
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem' 
                }}
            >
                <div 
                    className="header-icon-btn" 
                    onClick={() => dispatch(handlerDrawerOpen(!drawerOpen))}
                    style={{ 
                        border: 'none', 
                        background: 'rgba(0,0,0,0.04)', 
                        cursor: 'pointer',
                        borderRadius: '10px',
                        padding: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                    }}
                >
                    {drawerOpen 
                        ? <MenuFoldOutlined style={{ fontSize: '1.2rem' }} /> 
                        : <MenuUnfoldOutlined style={{ fontSize: '1.2rem' }} />
                    }
                </div>

                <h1 
                    style={{ 
                        fontSize: '1.1rem', 
                        fontWeight: 600, 
                        color: '#1a2332', 
                        margin: 0,
                        letterSpacing: '0.3px'
                    }}
                >
                    {currentTitle}
                </h1>
            </div>

            <div 
                className="header-right"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}
            >
                <div 
                    className="header-icon-btn"
                    style={{
                        borderRadius: '10px',
                        padding: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                    }}
                >
                    <Bell size={20} />
                </div>

                <div className="profile-dropdown-container">
                    <div
                        className="user-profile"
                        onClick={() => setShowDropdown(!showDropdown)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '4px 6px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <div 
                            className="user-info"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end'
                            }}
                        >
                            <span className="name">{user?.name || 'Stebin Ben'}</span>
                            <span className="role">Merchant Admin</span>
                        </div>

                        <div 
                            className="avatar"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {(user?.name || 'S')[0].toUpperCase()}
                        </div>

                        <ChevronDown 
                            size={16} 
                            className="dropdown-chevron"
                            style={{
                                transition: 'transform 0.2s ease',
                                transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)'
                            }}
                        />
                    </div>

                    {showDropdown && (
                        <div 
                            className="profile-dropdown"
                            style={{
                                marginTop: '6px'
                            }}
                        >
                            <div
                                className="dropdown-item"
                                onClick={() => { 
                                    if (onOpenProfile) onOpenProfile(); 
                                    setShowDropdown(false); 
                                }}
                                style={{ gap: '0.6rem' }}
                            >
                                <User size={16} />
                                <span>View Profile</span>
                            </div>

                            <div className="dropdown-divider" />

                            <div
                                className="dropdown-item dropdown-logout"
                                onClick={handleLogout}
                                style={{ gap: '0.6rem' }}
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;