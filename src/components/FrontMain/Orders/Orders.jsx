import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, IconButton, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const orderMenu = [
    {
        id: 1,
        name: 'Deposit Records',
        path: '/deposit-history',
        icon: <DownloadIcon style={{ color: '#4caf50', fontSize: 45 }} />,
    },
    {
        id: 3,
        name: 'Withdrawal Records',
        path: '/withdrawal-history',
        icon: <UploadIcon style={{ color: '#f44336', fontSize: 45 }} />,
    },
    {
        id: 2,
        name: 'Trading Records',
        path: '/trade-history',
        icon: <AssignmentIcon style={{ color: '#616161', fontSize: 45 }} />,
    },
];

export default function Orders() {
    const navigate = useNavigate();
    const { theme } = useAppContext();

    const handleClick = (path) => {
        navigate(path);
    };

    return (
        <Box pb={1} sx={{ margin: '0 auto' }}>
            <Box sx={{
                background: theme === 'dark' ? '#1e1e1e' : 'white',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                position: 'sticky',
                top: 0,
                zIndex: 1,
            }}>
                <IconButton 
                    onClick={() => navigate(-1)}
                    sx={{ color: theme === 'dark' ? 'white' : 'black' }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" sx={{ color: theme === 'dark' ? 'white' : 'black' }}>
                    Records
                </Typography>
            </Box>
            <Box sx={{
                background: theme === 'dark' ? '#1e1e1e' : 'white',
                borderRadius: '10px',
                position: 'relative',
                margin: '10px auto',
            }}>
                <List sx={{ width: '100%' }}>
                    {orderMenu.map((menu, i) => (
                        <Box pl={2} pr={2} key={menu.id}>
                            <ListItem
                                sx={{ padding: 0.5, background: theme === 'dark' ? '#2c2c2c' : 'transparent' }}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="navigate" size="small">
                                        <ArrowForwardIosIcon sx={{ fontSize: '0.9rem', color: theme === 'dark' ? 'white' : 'black' }} />
                                    </IconButton>
                                }
                                disablePadding
                            >
                                <ListItemButton role={undefined} onClick={() => handleClick(menu.path)} dense>
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        {menu.icon}
                                    </ListItemIcon>
                                    <ListItemText 
                                        id={menu.id} 
                                        primary={
                                            <Typography 
                                                variant="body1" 
                                                color={theme === 'dark' ? 'white' : 'InfoText'}
                                            >
                                                {menu.name}
                                            </Typography>
                                        } 
                                    />
                                </ListItemButton>
                            </ListItem>

                            {i !== orderMenu.length - 1 && (
                                <Divider sx={{ background: theme === 'dark' ? '#555' : '#ccc' }} />
                            )}
                        </Box>
                    ))}
                </List>
            </Box>
        </Box>
    );
}