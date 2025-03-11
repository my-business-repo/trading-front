import { useEffect, useState } from 'react';
import { Container, Paper, Typography, Box, Grid, Divider, Chip, IconButton } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { format } from 'date-fns';
import { useAppContext } from '../../context/AppContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import back icon
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function Profile() {
    const [profileData, setProfileData] = useState(null);
    const token = localStorage.getItem('token');
    const { theme } = useAppContext();
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchProfile = async () => {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            try {
                const response = await axios.get(`${API_URL}/api/v1/customer/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.data.success) setProfileData(response.data.data);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                toast.error('Failed to load profile data');
            }
        };
        fetchProfile();
    }, [token]);

    if (!profileData) return null;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, borderRadius: '10px' }}>
            <ToastContainer />
            <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
                <ArrowBackIcon />
            </IconButton>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%', backgroundColor: theme === 'dark' ? '#1e1e1e' : 'white' }}>
                        <Typography variant="h5" gutterBottom sx={{ color: theme === 'dark' ? 'white' : 'black' }}>Profile Information</Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        {['name', 'email', 'phone', 'loginId'].map((field) => (
                            <Box key={field} sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: theme === 'dark' ? 'lightgray' : 'text.secondary' }}>
                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                </Typography>
                                <Typography variant="body1" sx={{ color: theme === 'dark' ? 'white' : 'black' }}>{profileData[field]}</Typography>
                            </Box>
                        ))}

                        <Box sx={{ mt: 2 }}>
                            <Chip
                                label={profileData.active ? 'Active' : 'Inactive'}
                                color={profileData.active ? 'success' : 'error'}
                                size="small"
                            />
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, backgroundColor: theme === 'dark' ? '#1e1e1e' : 'white' }}>
                        <Typography variant="h5" gutterBottom sx={{ color: theme === 'dark' ? 'white' : 'black' }}>Accounts</Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        <Grid container spacing={2}>
                            {profileData.accounts.map((account) => (
                                <Grid item xs={12} key={account.id}>
                                    <Box sx={{ p: 2, border: '1px solid #444', borderRadius: 1, backgroundColor: theme === 'dark' ? '#2c2c2c' : '' }}>
                                        <Typography variant="subtitle1" sx={{ color: theme === 'dark' ? 'white' : '' }}>
                                            Account #{account.accountNo}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: theme === 'dark' ? 'white' : '' }}>
                                            Balance: {account.balance} {account.currency.toUpperCase()}
                                        </Typography>
                                        <Typography variant="caption" display="block" sx={{ color: theme === 'dark' ? 'white' : '' }}>
                                            Created: {format(new Date(account.createdAt), 'PP')}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}