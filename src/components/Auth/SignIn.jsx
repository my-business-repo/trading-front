import { useState } from 'react';
import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    InputAdornment,
    IconButton,
    CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, WbSunny, Nightlight, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useAppContext } from '../../context/AppContext';

export default function SignIn() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false); // New loading state

    const { login, theme, setTheme } = useAppContext();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when submitting

        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
        console.log(process.env.REACT_APP_API_URL);
        console.log(API_URL);
        try {
            const response = await axios.post(`${API_URL}/api/v1/customer/login`, {
                email: formData.email,
                password: formData.password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                const { token, customer } = response.data;

                // Update both context and localStorage
                login(token, customer);

                toast.success('Login successful');
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            }
        } catch (error) {
            console.error('Login failed:', error);
            toast.error('Login failed: ' + (error.response?.data?.error || 'Something went wrong'));
        } finally {
            setLoading(false); // Reset loading state after the request
        }
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark'); // Toggle between light and dark theme
    };

    return (
        <Container component="main" maxWidth="xs">
            <ToastContainer />
            <Paper elevation={3} sx={{
                marginTop: 6,
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: theme === 'dark' ? '#121212' : '#fff',
                position: 'relative'
            }}>
                <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                    <IconButton onClick={toggleTheme}>
                        {theme === 'dark' ? <WbSunny sx={{ color: '#fff' }} /> : <Nightlight sx={{ color: 'primary.main' }} />}
                    </IconButton>
                </Box>
                <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                    <IconButton onClick={() => navigate(-1)}>
                        <ArrowBack sx={{ color: theme === 'dark' ? '#fff' : 'primary.main' }} />
                    </IconButton>
                </Box>
                <Typography component="h1" variant="h5" sx={{ mb: 2, color: theme === 'dark' ? '#fff' : 'primary.main' }} >
                    Sign In
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={formData.email}
                        size="small"
                        onChange={handleChange}
                        sx={{
                            borderRadius: '10px',
                            background: theme === 'dark' ? 'gray' : '',
                            '& .MuiInputLabel-root': { color: theme === 'dark' ? '#fff' : '' },
                            '& .MuiInputBase-input': {
                                color: theme === 'dark' ? '#ffffff' : '#000000' // Added input color
                            }
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        sx={{
                            borderRadius: '10px',
                            background: theme === 'dark' ? 'gray' : '',
                            '& .MuiInputLabel-root': { color: theme === 'dark' ? '#fff' : '' },
                            '& .MuiInputBase-input': {
                                color: theme === 'dark' ? '#ffffff' : '#000000' // Added input color
                            }
                        }}
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        value={formData.password}
                        size="small"
                        onChange={handleChange}
                        InputProps={{
                            sx: {
                                borderRadius: '10px',
                                background: theme === 'dark' ? 'gray' : '',
                                '& .MuiInputLabel-root': { color: theme === 'dark' ? '#fff' : '' },
                                '& .MuiInputBase-input': {
                                    color: theme === 'dark' ? '#ffffff' : '#000000' // Added input color
                                }
                            },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, mb: 1, borderRadius: '10px' }}
                        disabled={loading} // Disable button when loading
                    >
                        {loading ? <CircularProgress size={24} /> : 'Sign In'} {/* Show loading spinner */}
                    </Button>
                    <Button
                        sx={{ mt: 2, mb: 1 , borderRadius: '10px'}}
                        fullWidth
                        variant="text"
                        size="small"
                        onClick={() => navigate('/signup')}
                    >
                        Don't have an account? Sign Up
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
} 