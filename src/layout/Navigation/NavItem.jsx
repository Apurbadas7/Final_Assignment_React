import PropTypes from 'prop-types';
import { Link, useLocation, matchPath } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { handlerDrawerOpen } from '../../store/slices/menuSlice';

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

export default function NavItem({ item, level }) {
  const dispatch = useDispatch();
  const { isDashboardDrawerOpened: drawerOpen } = useSelector((state) => state.menu);
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const itemHandler = () => {
    if (downLG) dispatch(handlerDrawerOpen(false));
  };

  const Icon = item.icon;
  const itemIcon = item.icon ? (
    <Icon
      style={{
        fontSize: drawerOpen ? '1rem' : '1.25rem'
      }}
    />
  ) : (
    false
  );

  const { pathname } = useLocation();
  const isSelected = !!matchPath({ path: item?.url, end: false }, pathname);

  const textColor = 'text.primary';
  const iconSelectedColor = '#00836e'; // IDBI Green
  const accentColor = '#e9761a'; // IDBI Orange

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <ListItemButton
          component={Link}
          to={item.url}
          target={item.target ? '_blank' : '_self'}
          disabled={item.disabled}
          selected={isSelected}
          sx={(theme) => ({
            zIndex: 1201,
            pl: drawerOpen ? `${level * 24}px` : 2,
            py: !drawerOpen && level === 1 ? 1.5 : 1,
            ...(drawerOpen && {
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
              '&.Mui-selected': {
                bgcolor: level === 1 ? 'rgba(233, 118, 26, 0.08)' : 'transparent',
                borderRight: level === 1 ? '3px solid' : 'none',
                borderColor: accentColor,
                color: iconSelectedColor,
                '&:hover': {
                  color: iconSelectedColor,
                  bgcolor: level === 1 ? 'rgba(233, 118, 26, 0.1)' : 'transparent'
                }
              }
            }),
            ...(!drawerOpen && {
              '&:hover': { bgcolor: 'transparent' },
              '&.Mui-selected': { '&:hover': { bgcolor: 'transparent' }, bgcolor: 'transparent' }
            })
          })}
          onClick={() => itemHandler()}
        >
          {itemIcon && (
            <ListItemIcon
              sx={{
                minWidth: 28,
                color: isSelected ? iconSelectedColor : textColor
              }}
            >
              {itemIcon}
            </ListItemIcon>
          )}
          {(drawerOpen || (!drawerOpen && level !== 1)) && (
            <ListItemText
              primary={
                <Typography
                  variant={level > 1 ? 'body2' : 'h6'}
                  sx={{ color: isSelected ? iconSelectedColor : textColor, fontWeight: isSelected ? 600 : 400, fontSize: '0.85rem' }}
                >
                  {item.title}
                </Typography>
              }
            />
          )}
          {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
            <Chip
              color={item.chip.color}
              variant={item.chip.variant}
              size={item.chip.size}
              label={item.chip.label}
              avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
            />
          )}
        </ListItemButton>
      </Box>
    </>
  );
}

NavItem.propTypes = {
  item: PropTypes.any,
  level: PropTypes.number
};
