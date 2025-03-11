import { useState } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
    IconButton
} from '@mui/material';
import { useAppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
    const { theme } = useAppContext();
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChangePassword = async () => {
        setLoading(true);
        setError('');
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const API_URL = process.env.REACT_APP_API_URL;
            const response = await axios.post(`${API_URL}/api/v1/customer/change-password`, {
                oldPassword: currentPassword,
                newPassword,
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            toast.success(response.data.message);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <ToastContainer />
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, background: theme === 'dark' ? '#1e1e1e' : '#ffffff' }}>
                <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackIcon color='primary' />
                </IconButton>
                <Typography variant="h5" gutterBottom sx={{ fontSize: '1.2rem', color: theme === 'dark' ? '#fff' : 'primary.main' }}>
                    Change Password
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField
                    fullWidth
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    size="small"
                    sx={{
                        color: theme === 'dark' ? '#fff' : 'primary.main',
                        border: theme === 'dark' ? '1px solid #555' : '1px solid #b3e5fc',
                        '& .MuiInputLabel-root': { color: theme === 'dark' ? '#fff' : 'primary.main' },
                        '& .MuiInputBase-input': {
                            color: theme === 'dark' ? '#ffffff' : '#000000' // Added input color
                        }
                    }}
                />
                <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    size="small"
                    sx={{
                        color: theme === 'dark' ? '#fff' : 'primary.main',
                        border: theme === 'dark' ? '1px solid #555' : '1px solid #b3e5fc',
                        '& .MuiInputLabel-root': { color: theme === 'dark' ? '#fff' : 'primary.main' },
                        '& .MuiInputBase-input': {
                            color: theme === 'dark' ? '#ffffff' : '#000000' // Added input color
                        }
                    }}
                />
                <TextField
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    size="small"
                    sx={{
                        color: theme === 'dark' ? '#fff' : 'primary.main',
                        border: theme === 'dark' ? '1px solid #555' : '1px solid #b3e5fc',
                        '& .MuiInputLabel-root': { color: theme === 'dark' ? '#fff' : 'primary.main' },
                        '& .MuiInputBase-input': {
                            color: theme === 'dark' ? '#ffffff' : '#000000' // Added input color
                        }
                    }}
                />
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleChangePassword}
                    disabled={loading}
                    sx={{ mt: 2, background: theme === 'dark' ? '#007bff' : '#007bff', color: theme === 'dark' ? '#fff' : '' }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Change Password'}
                </Button>
            </Paper>
        </Container>
    );
} 