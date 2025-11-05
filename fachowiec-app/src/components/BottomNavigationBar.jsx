import { useState, useEffect } from 'react';
import { 
  BottomNavigation, 
  BottomNavigationAction, 
  Menu, 
  MenuItem, 
  Box
} from '@mui/material';
import { 
  Dashboard, 
  ListAlt, 
  Group, 
  CalendarMonth, 
  MoreVert,
  Assessment,
  Description,
  Settings
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Panel', icon: <Dashboard /> },
  { path: '/jobs', label: 'Zlecenia', icon: <ListAlt /> },
  { path: '/clients', label: 'Klienci', icon: <Group /> },
  { path: '/calendar', label: 'Kalendarz', icon: <CalendarMonth /> },
];

const moreItems = [
  { path: '/reports', label: 'Raporty', icon: <Assessment /> },
  { path: '/estimates', label: 'Oferty', icon: <Description /> },
  { path: '/settings', label: 'Ustawienia', icon: <Settings /> },
];

const BottomNavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const getInitialValue = () => {
    const currentPath = location.pathname;
    const foundIndex = navItems.findIndex(item => item.path === currentPath);
    return foundIndex > -1 ? foundIndex : -1; // -1 means it's a "more" item
  };

  const [value, setValue] = useState(getInitialValue());

  useEffect(() => {
    setValue(getInitialValue());
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    if (newValue < navItems.length) {
      setValue(newValue);
      navigate(navItems[newValue].path);
    }
    // If newValue === navItems.length, it's the "More" button
  };

  const handleMoreClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  const handleMoreItemClick = (path) => {
    navigate(path);
    handleMoreClose();
    setValue(-1); // Indicate it's a "more" item
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <BottomNavigation 
        value={value >= 0 ? value : false} 
        onChange={handleChange} 
        showLabels
      >
        {navItems.map((item, index) => (
          <BottomNavigationAction 
            key={index} 
            label={item.label} 
            icon={item.icon} 
          />
        ))}
        <BottomNavigationAction 
          label="Więcej" 
          icon={<MoreVert />}
          onClick={handleMoreClick}
          value={navItems.length}
        />
      </BottomNavigation>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMoreClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        {moreItems.map((item) => (
          <MenuItem 
            key={item.path} 
            onClick={() => handleMoreItemClick(item.path)}
            selected={location.pathname === item.path}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {item.icon}
              {item.label}
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default BottomNavigationBar;
