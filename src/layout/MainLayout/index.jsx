import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Header from '../Header';
import Profile from '../../components/Dashboard/Profile';
import '../../styles/Dashboard.css';

const DashboardLayout = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { isDashboardDrawerOpened: drawerOpen } = useSelector((state) => state.menu);

    return (
        <div className="dashboard-shell">
            <Sidebar />
            
            <main className={`main-wrapper ${!drawerOpen ? 'collapsed' : ''}`}>
                <Header onOpenProfile={() => setIsProfileOpen(true)} />
                
                <div className="dashboard-content">
                    <Outlet />
                </div>
            </main>

            {/* Global Overlay Drawer for Profile */}
            <Profile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </div>
    );
};

export default DashboardLayout;
