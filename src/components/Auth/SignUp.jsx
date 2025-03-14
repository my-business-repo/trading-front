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
import { Visibility, VisibilityOff, WbSunny, Nightlight, ArrowBack } from '@mui/icons-material'; // Added ArrowBack
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useAppContext } from '../../context/AppContext';

export default function SignUp() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        phone: '',
        ssn: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const { theme, setTheme } = useAppContext();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        const API_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : 'http://localhost:3001';

        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/api/v1/customer/signup`, {
                email: formData.email,
                name: formData.name,
                phone: formData.phone,
                password: formData.password,
                socialSecurityNumber: formData.ssn
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {
                toast.success('Signup successful');
                navigate('/signin');
            }
        } catch (error) {
            console.error('Signup failed:', error);
            toast.error('Signup failed : ' + error.response.data.error);
        } finally {
            setLoading(false);
        }
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
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
                borderRadius: '10px',
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
                <Typography component="h1" variant="h5" sx={{ mb: 2, color: theme === 'dark' ? '#fff' : 'primary.main' }}>
                    Create Account
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
                        size='small'
                        onChange={handleChange}
                        sx={{
                            borderRadius: '10px',
                            background: theme === 'dark' ? 'gray' : '',
                            '& .MuiInputLabel-root': { color: theme === 'dark' ? '#fff' : 'primary.main' },
                            '& .MuiInputBase-input': {
                                color: theme === 'dark' ? '#ffffff' : '#000000'
                            }
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Full Name"
                        name="name"
                        autoComplete="name"
                        value={formData.name}
                        size='small'
                        onChange={handleChange}
                        sx={{
                            borderRadius: '10px',
                            background: theme === 'dark' ? 'gray' : '',
                            '& .MuiInputLabel-root': { color: theme === 'dark' ? '#fff' : 'primary.main' },
                            '& .MuiInputBase-input': {
                                color: theme === 'dark' ? '#ffffff' : '#000000'
                            }
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="phone"
                        label="Phone Number"
                        name="phone"
                        autoComplete="tel"
                        size='small'
                        value={formData.phone}
                        onChange={handleChange}
                        sx={{
                            borderRadius: '10px',
                            background: theme === 'dark' ? 'gray' : '',
                            '& .MuiInputLabel-root': { color: theme === 'dark' ? '#fff' : 'primary.main' },
                            '& .MuiInputBase-input': {
                                color: theme === 'dark' ? '#ffffff' : '#000000'
                            }
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="ssn"
                        label="Social Security Number"
                        name="ssn"
                        autoComplete="off"
                        size='small'
                        value={formData.ssn}
                        onChange={handleChange}
                        sx={{
                            borderRadius: '10px',
                            background: theme === 'dark' ? 'gray' : '',
                            '& .MuiInputLabel-root': { color: theme === 'dark' ? '#fff' : 'primary.main' },
                            '& .MuiInputBase-input': {
                                color: theme === 'dark' ? '#ffffff' : '#000000'
                            }
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="new-password"
                        size='small'
                        value={formData.password}
                        onChange={handleChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                borderRadius: '10px',
                                background: theme === 'dark' ? 'gray' : '',
                                '& .MuiInputLabel-root': { color: theme === 'dark' ? '#fff' : 'primary.main' },
                                '& .MuiInputBase-input': {
                                    color: theme === 'dark' ? '#ffffff' : '#000000'
                                }
                            }
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        autoComplete="new-password"
                        size='small'
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
                        helperText={formData.password !== formData.confirmPassword && formData.confirmPassword !== '' ? 'Passwords do not match' : ''}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                borderRadius: '10px',
                                background: theme === 'dark' ? 'gray' : '',
                                '& .MuiInputLabel-root': { color: theme === 'dark' ? '#fff' : 'primary.main' },
                                '& .MuiInputBase-input': {
                                    color: theme === 'dark' ? '#ffffff' : '#000000'
                                }
                            }
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, mb: 1, borderRadius: '10px' }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Register'}
                    </Button>
                    <Button
                        fullWidth
                        variant="text"
                        size='small'
                        onClick={() => navigate('/signin')}
                        sx={{ color: theme === 'dark' ? '#fff' : 'primary.main', mt: 2, mb: 1, borderRadius: '10px' }}
                    >
                        Already have an account? Sign In
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}