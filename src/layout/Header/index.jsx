import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, LogOut, User, ChevronDown } from 'lucide-react';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { performLogout } from '../../store/thunks/authThunks';
import { handlerDrawerOpen } from '../../store/slices/menuSlice';

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
        <header className="dashboard-header" style={{ paddingLeft: '1rem' }}>
            <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div 
                    className="header-icon-btn" 
                    onClick={() => dispatch(handlerDrawerOpen(!drawerOpen))}
                    style={{ border: 'none', background: 'rgba(0,0,0,0.04)', cursor: 'pointer' }}
                >
                    {drawerOpen ? <MenuFoldOutlined style={{ fontSize: '1.2rem' }} /> : <MenuUnfoldOutlined style={{ fontSize: '1.2rem' }} />}
                </div>
                <h1 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a2332', margin: 0 }}>{currentTitle}</h1>
            </div>

            <div className="header-right">
                <div className="header-icon-btn">
                    <Bell size={20} />
                </div>

                <div className="profile-dropdown-container">
                    <div
                        className="user-profile"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <div className="user-info">
                            <span className="name">{user?.name || 'Stebin Ben'}</span>
                            <span className="role">Merchant Admin</span>
                        </div>
                        <div className="avatar">
                            {(user?.name || 'S')[0].toUpperCase()}
                        </div>
                        <ChevronDown size={16} className="dropdown-chevron" />
                    </div>

                    {showDropdown && (
                        <div className="profile-dropdown">
                            <div
                                className="dropdown-item"
                                onClick={() => { 
                                    if (onOpenProfile) onOpenProfile(); 
                                    setShowDropdown(false); 
                                }}
                            >
                                <User size={16} />
                                <span>View Profile</span>
                            </div>
                            <div className="dropdown-divider" />
                            <div
                                className="dropdown-item dropdown-logout"
                                onClick={handleLogout}
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
