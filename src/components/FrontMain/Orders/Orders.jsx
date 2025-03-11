import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, IconButton, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { CurrencyExchange } from '@mui/icons-material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const orderMenu = [
    {
        id: 1,
        name: 'Transaction Records',
        path: '/transactions',
        icon: <ReceiptIcon style={{ color: '#01579b', fontSize: 45 }} />,
    },
    {
        id: 2,
        name: 'Trading Records',
        path: '/trade-history',
        icon: <AssignmentIcon style={{ color: '#616161', fontSize: 45 }} />,
    },
    {
        id: 3,
        name: 'Exchange Records',
        path: '/exchange-history',
        icon: <CurrencyExchange style={{ color: '#616161', fontSize: 45 }} />,
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