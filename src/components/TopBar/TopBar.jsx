import { AppBar, Box, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import LanguageIcon from '@mui/icons-material/Language'; // Changed HomeIcon to LanguageIcon
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Import icon for theme toggle
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Import icon for theme toggle
import VpnKeyIcon from '@mui/icons-material/VpnKey'; // Import icon for change password
import BadgeIcon from '@mui/icons-material/Badge'; // Import icon for ID
import HelpIcon from '@mui/icons-material/Help'; // Import icon for help center
import ChangePasswordIcon from '@mui/icons-material/VpnKey'; // Import icon for change password

export default function TopBar() {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const { customer, logout } = useAppContext();
    const { theme, setTheme } = useAppContext();
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        handleClose();
        navigate('/profile');
    };

    const handleChangePassword = () => {
        handleClose();
        navigate('/change-password'); // Navigate to change password page
    };

    const handleSignOut = () => {
        handleClose();
        logout();
        navigate('/signin');
    };

    const handleHelpCenter = () => {
        handleClose();
        navigate('/help'); // Navigate to help page
    };

    const toggleTheme = () => {
        if (typeof setTheme === 'function') {
            setTheme(theme === 'light' ? 'dark' : 'light'); // Toggle theme
        } else {
            console.error('setTheme is not a function');
        }
    };

    return (
        <AppBar position="fixed" sx={{ background: theme === 'dark' ? '#333' : '#fff', color: theme === 'dark' ? '#fff' : 'primary.main', height: '48px', boxShadow: 'none', borderBottom: theme === 'dark' ? '1px solid #555' : '1px solid #b3e5fc' }}>
            <Toolbar sx={{ minHeight: '48px !important', display: 'flex', justifyContent: 'space-between', width: '100%' }}>

                <Box>
                    <IconButton
                        size="large"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle fontSize="small" />
                    </IconButton>
                    <Menu
                        sx={{
                            '& .MuiPaper-root': {
                                backgroundColor: theme === 'dark' ? '#1e1e1e' : 'white'
                            }
                        }}
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        {customer ? (
                            <>
                                <MenuItem onClick={handleProfile} sx={{ color: theme === 'dark' ? '#fff' : 'primary.main' }}>
                                    <PersonIcon sx={{ mr: 1, color: theme === 'dark' ? '#fff' : 'primary.main' }} fontSize="small" />
                                    Profile
                                </MenuItem>
                                <MenuItem sx={{ color: theme === 'dark' ? '#fff' : 'primary.main' }}>
                                    <BadgeIcon sx={{ mr: 1, color: theme === 'dark' ? '#fff' : 'primary.main' }} fontSize="small" />
                                    ID: {String(customer.id).padStart(8, '0')} {/* Display customer ID padded to 8 digits */}
                                </MenuItem>
                                <MenuItem onClick={handleChangePassword} sx={{ color: theme === 'dark' ? '#fff' : 'primary.main' }}>
                                    <ChangePasswordIcon sx={{ mr: 1, color: theme === 'dark' ? '#fff' : 'primary.main' }} fontSize="small" />
                                    Change Password
                                </MenuItem>
                                <MenuItem onClick={handleSignOut} sx={{ color: theme === 'dark' ? '#fff' : 'primary.main' }}>
                                    <LogoutIcon sx={{ mr: 1, color: theme === 'dark' ? '#fff' : 'primary.main' }} fontSize="small" />
                                    Sign Out
                                </MenuItem>
                                <MenuItem onClick={handleHelpCenter} sx={{ color: theme === 'dark' ? '#fff' : 'primary.main' }}>
                                    <HelpIcon sx={{ mr: 1, color: theme === 'dark' ? '#fff' : 'primary.main' }} fontSize="small" />
                                    Help Center
                                </MenuItem>
                            </>
                        ) : (
                            <MenuItem onClick={() => navigate('/signin')} sx={{ color: theme === 'dark' ? '#fff' : 'primary.main' }}>
                                <LoginIcon sx={{ mr: 1, color: theme === 'dark' ? '#fff' : 'primary.main' }} fontSize="small" />
                                Sign In
                            </MenuItem>
                        )}
                    </Menu>
                </Box>

                <IconButton
                    size="small"
                    onClick={toggleTheme} // Add onClick for theme toggle
                    color="inherit"
                >
                    {theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />} {/* Change icon based on theme */}
                </IconButton>

                <Box mr={5}>
                    <IconButton
                        size="small"
                        color="inherit"
                        sx={{ mr: 1 }}
                    >
                        <LanguageIcon fontSize="small" /> {/* Changed HomeIcon to LanguageIcon */}
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
