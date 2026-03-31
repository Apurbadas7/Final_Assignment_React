import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// antd icons
import { UpOutlined, DownOutlined } from '@ant-design/icons';

// project import
import NavItem from './NavItem';
import { handlerDrawerOpen } from '../../store/slices/menuSlice';

// ==============================|| NAVIGATION - LIST GROUP ||============================== //

export default function NavGroup({ item }) {
  const dispatch = useDispatch();
  const { isDashboardDrawerOpened: drawerOpen } = useSelector((state) => state.menu);
  const { user } = useSelector((state) => state.auth);
  // Default role to 'admin' for demo if not present
  const role = user?.role || 'admin';

  const [openCollapse, setOpenCollapse] = useState({});

  const handleToggle = (id) => {
    setOpenCollapse((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const navCollapse = item.children
    ?.filter((menuItem) => {
      if (!menuItem.roles) return true;
      return menuItem.roles.includes(role);
    })
    .map((menuItem) => {
      switch (menuItem.type) {
        case 'item':
          return <NavItem key={menuItem.id} item={menuItem} level={1} />;

        case 'collapse':
          return (
            <Box key={menuItem.id}>
              <ListItemButton
                sx={(theme) => ({
                    zIndex: 1201,
                    pl: drawerOpen ? '24px' : 2,
                    py: 1,
                    ...(drawerOpen && {
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                      '&.Mui-selected': {
                        bgcolor: 'rgba(227, 24, 55, 0.08)',
                        borderRight: '3px solid',
                        borderColor: '#E31837',
                        '&:hover': {
                          bgcolor: 'rgba(227, 24, 55, 0.1)'
                        }
                      }
                    }),
                    ...(!drawerOpen && {
                      '&:hover': { bgcolor: 'transparent' },
                      '&.Mui-selected': { '&:hover': { bgcolor: 'transparent' }, bgcolor: 'transparent' }
                    })
                })}
                onClick={() => {
                  if (!drawerOpen) {
                    dispatch(handlerDrawerOpen(true));
                  } else {
                    handleToggle(menuItem.id);
                  }
                }}
              >
                {menuItem.icon && (
                  <ListItemIcon>
                    <menuItem.icon
                      style={{
                        fontSize: drawerOpen ? '1rem' : '1.25rem'
                      }}
                    />
                  </ListItemIcon>
                )}
                {drawerOpen && (
                  <>
                    <ListItemText primary={<Typography variant="h6" sx={{ fontSize: '0.85rem' }}>{menuItem.title}</Typography>} />
                    {openCollapse[menuItem.id] ? (
                      <UpOutlined style={{ fontSize: '0.75rem' }} />
                    ) : (
                      <DownOutlined style={{ fontSize: '0.75rem' }} />
                    )}
                  </>
                )}
              </ListItemButton>
              {drawerOpen && (
                <Collapse in={openCollapse[menuItem.id]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {menuItem.children?.map((child) => (
                      <NavItem key={child.id} item={child} level={2} />
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          );

        default:
          return (
            <Typography key={menuItem.id} variant="h6" color="error" align="center">
              Fix - Group Collapse or Items
            </Typography>
          );
      }
    });

  if (!navCollapse || navCollapse.length === 0) return null;

  return (
    <List
      subheader={
        item.title &&
        drawerOpen && (
          <Box sx={{ pl: 3, mb: 1.5 }}>
            <Typography variant="subtitle2" sx={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em' }}>
              {item.title}
            </Typography>
          </Box>
        )
      }
      sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
    >
      {navCollapse}
    </List>
  );
}

NavGroup.propTypes = { item: PropTypes.object };
