import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';

// project import
import NavGroup from '../Navigation/NavGroup';
import menuItems from '../../menu-items';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Sidebar = () => {
  const { isDashboardDrawerOpened: drawerOpen } = useSelector((state) => state.menu);

  const navGroups = menuItems.items.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return (
    <aside className={`sidebar ${!drawerOpen ? 'collapsed' : ''}`} style={{ width: drawerOpen ? '260px' : '60px', transition: 'width 0.3s ease' }}>
      <div className="sidebar-logo" style={{ padding: drawerOpen ? '0' : '0', display: 'flex', justifyContent: 'center', minHeight: '70px', overflow: 'hidden' }}>
        <img 
            src={drawerOpen ? "/idbi_bank_logo.svg" : "/idbi_bank_icon.svg"} 
            alt="IDBI Bank" 
            style={{ 
                height: drawerOpen ? '60px' : '60px', 
                width: drawerOpen ? '100%' : '100%',
                objectFit: 'cover',
                transition: 'all 0.3s ease'
            }} 
        />
      </div>
      <Box sx={{ pt: 2 }}>{navGroups}</Box>
    </aside>
  );
};

export default Sidebar;
