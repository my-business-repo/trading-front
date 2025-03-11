import { Avatar, Box, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import background from '../../../images/general/bluebackground.png';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { minemenu } from "./minemenu";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from "../../../context/AppContext";

export default function Mine() {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({
        name: '',
        loginId: ''
    });
    const { theme } = useAppContext();
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/customer/profile`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.success) {
                    setProfileData({
                        name: response.data.data.name,
                        loginId: response.data.data.loginId
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    const handleClick = (menuId, menuName) => {
        if (menuId === 3) {
            navigate('/orders');
        } else if (menuId === 9 && menuName === 'Online Customer Service') {
            window.open('https://t.me/Coinbaseviptrading', '_blank');
        } else if (menuId === 10) {
            navigate('/help');
        } else if (menuId === 4) {
            navigate('/trade-history');
        } else if (menuId === 5) {
            navigate('/exchange-history');
        }
        if (menuId === 4) {
            navigate('/trade-history');
        }
    };

    return (
        <Box pb={1} sx={{ margin: '0 auto' }}>
            <Box
                sx={{
                    backgroundImage: `url(${background})`,
                    backgroundSize: 'cover',
                    height: '20vh',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    padding: 1.5,
                    margin: '0 auto',
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: "100%" }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <Avatar
                            sx={{ width: 50, height: 50, border: '2px solid white' }}
                            src="https://placekitten.com/200/200"
                        />
                        <Box>
                            <Typography variant="h6" color='white' sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                {profileData.name}
                            </Typography>
                            <Typography variant="body2" color='white' sx={{ fontSize: '0.9rem' }}>
                                ID: {profileData.loginId}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Box sx={{
                background: theme === 'dark' ? '#1e1e1e' : 'white',
                borderTopRightRadius: '10px',
                borderTopLeftRadius: '10px',
                position: 'relative',
                marginTop: '-20px',
                margin: '0 auto',
            }}>

                <List sx={{ width: '100%' }}>
                    {
                        minemenu.map((menu, i) => {
                            return (
                                <Box pl={2} pr={2} key={menu.id}>
                                    <ListItem
                                        sx={{ padding: 0.5, background: theme === 'dark' ? '#2c2c2c' : 'transparent' }}
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="comments" size="small">
                                                <ArrowForwardIosIcon sx={{ fontSize: '0.9rem', color: theme === 'dark' ? 'white' : 'black' }} />
                                            </IconButton>
                                        }
                                        disablePadding
                                    >
                                        <ListItemButton role={undefined} onClick={() => handleClick(menu.id, menu.name)} dense>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                {menu.icon}
                                            </ListItemIcon>
                                            <ListItemText id={menu.id} primary={<Typography variant="body1" color={theme === 'dark' ? 'white' : 'InfoText'}>{menu.name}</Typography>} />
                                        </ListItemButton>
                                    </ListItem>

                                    {
                                        i !== minemenu.length - 1 && <Divider sx={{ background: theme === 'dark' ? '#555' : '#ccc' }} />
                                    }
                                </Box>
                            )
                        })
                    }
                </List>
            </Box>
        </Box>
    )
}