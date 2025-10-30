import { Box, Paper } from '@mui/material';
import BottomNavigationBar from './BottomNavigationBar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box component="main" sx={{ flexGrow: 1, pb: 7 }}> {/* paddingBottom to prevent content from being hidden by the nav bar */}
        <Outlet />
      </Box>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigationBar />
      </Paper>
    </Box>
  );
};

export default MainLayout;