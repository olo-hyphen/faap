import { useState } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Dashboard, ListAlt, Group, CalendarMonth } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Panel', icon: <Dashboard /> },
  { path: '/jobs', label: 'Zlecenia', icon: <ListAlt /> },
  { path: '/clients', label: 'Klienci', icon: <Group /> },
  { path: '/calendar', label: 'Kalendarz', icon: <CalendarMonth /> },
];

const BottomNavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialValue = () => {
    const currentPath = location.pathname;
    const foundIndex = navItems.findIndex(item => item.path === currentPath);
    return foundIndex > -1 ? foundIndex : 0;
  };

  const [value, setValue] = useState(getInitialValue());

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(navItems[newValue].path);
  };

  return (
    <BottomNavigation value={value} onChange={handleChange} showLabels>
      {navItems.map((item, index) => (
        <BottomNavigationAction key={index} label={item.label} icon={item.icon} />
      ))}
    </BottomNavigation>
  );
};

export default BottomNavigationBar;