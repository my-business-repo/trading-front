import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    FormControl,
    Select,
    MenuItem,
    TextField,
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Avatar,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar
} from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import back button icon
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { getCoinStringList } from '../../../utils/utils';
import { format } from 'date-fns';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useAppContext } from '../../../context/AppContext';

const statusColors = {
    PENDING: 'warning',
    COMPLETED: 'success',
    FAILED: 'error'
};

export default function Exchange({setValue}) {
    const [fromCoin, setFromCoin] = useState('USDT');
    const [toCoin, setToCoin] = useState('BTC');
    const [amount, setAmount] = useState('');
    const [rate, setRate] = useState(null);
    const [baseRate, setBaseRate] = useState(null); // Rate for 1 unit
    const [loading, setLoading] = useState(false);
    const [exchanges, setExchanges] = useState([]);
    const [coins, setCoins] = useState([]);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [exchangeDialogOpen, setExchangeDialogOpen] = useState(false);
    const [exchangeData, setExchangeData] = useState(null);
    const [exchangeHistory, setExchangeHistory] = useState([]);
    const [userBalance, setUserBalance] = useState(0); // New state for user balance
    const { theme, setTheme } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCoins();
        fetchExchanges();
        fetchExchangeHistory();
        fetchUserBalance(); // Fetch user balance on component mount
        // setTheme('light');
    }, []);

    const fetchUserBalance = async () => {
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const response = await axios.get(`${API_URL}/api/v1/customer/coin/balance?currency=${fromCoin}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(response);
            setUserBalance(response.data.balance || 0); // Set user balance
        } catch (error) {
            console.error('Error fetching user balance:', error);
        }
    };

    const fetchExchangeHistory = async () => {
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const response = await axios.get(`${API_URL}/api/v1/exchanges`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setExchangeHistory(response.data || []);
        } catch (error) {
            console.error('Error fetching exchanges:', error);
        }
    };

    useEffect(() => {
        if (fromCoin && toCoin) {
            fetchExchangeRate();
            fetchBaseRate(); // Fetch rate for 1 unit
            fetchUserBalance(); // Refetch user balance when fromCoin changes
        }
    }, [fromCoin, toCoin, amount]);

    const fetchCoins = async () => {
        try {
            const response = await axios.get('https://min-api.cryptocompare.com/data/pricemultifull', {
                params: {
                    fsyms: getCoinStringList(),
                    tsyms: 'USDT'
                }
            });
            const rawData = response.data.RAW;
            const coinList = Object.entries(rawData).map(([symbol, data]) => ({
                symbol,
                imageUrl: `https://www.cryptocompare.com${data.USDT.IMAGEURL}`
            }));
            setCoins(coinList);
        } catch (error) {
            console.error('Error fetching coins:', error);
        }
    };

    const fetchBaseRate = async () => {
        try {
            const response = await axios.get('https://min-api.cryptocompare.com/data/price', {
                params: {
                    fsym: fromCoin,
                    tsyms: toCoin
                }
            });
            const rate = response.data[toCoin];
            setBaseRate(rate);
        } catch (error) {
            console.error('Error fetching base rate:', error);
        }
    };

    const fetchExchangeRate = async () => {
        if (!amount || isNaN(amount) || amount <= 0) return;

        try {
            const response = await axios.get('https://min-api.cryptocompare.com/data/price', {
                params: {
                    fsym: fromCoin,
                    tsyms: toCoin
                }
            });
            const rate = response.data[toCoin];
            setRate(rate * amount);
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
        }
    };

    const fetchExchanges = async () => {
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const response = await axios.get(`${API_URL}/api/v1/exchanges`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setExchanges(response.data.exchanges || []);
        } catch (error) {
            console.error('Error fetching exchanges:', error);
        }
    };

    const handleSwap = () => {
        setFromCoin(toCoin);
        setToCoin(fromCoin);
    };

    const handleExchange = async () => {
        if (!localStorage.getItem('token')) {
            setLoginDialogOpen(true);
            return;
        }

        if (!amount || isNaN(amount) || amount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        setLoading(true);
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const response = await axios.post(`${API_URL}/api/v1/exchange-request`, {
                fromCurrency: fromCoin,
                toCurrency: toCoin,
                amount: parseFloat(amount)
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setExchangeData(response.data.exchange);
                setExchangeDialogOpen(true);
                fetchExchangeHistory();
            } else {
                toast.error('Exchange request failed');
            }

            setAmount('');
            fetchExchanges();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Exchange failed');
        } finally {
            setLoading(false);
        }
    };

    const handleExchangeAll = () => {
        if (userBalance > 0) {
            setAmount(userBalance); // Set amount to user balance
            // handleExchange(); // Call exchange
        } else {
            toast.error('Insufficient balance');
        }
    };

    return (
        <Container sx={{ mb: 4, backgroundColor: theme === 'dark' ? '#1e1e1e' : 'white'  }}>
            <ToastContainer />

            {/* Back Button */}
            <IconButton onClick={() => setValue(0)} color="primary" size="small" sx={{ mb: 2 }}>
                <ArrowBackIcon />
            </IconButton>

            {/* Exchange Form */}
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3, background: theme === 'dark' ? '#1e1e1e' : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)' }}>
                <Typography variant="h6" gutterBottom sx={{ color: theme === 'dark' ? 'white' : 'primary.main', fontWeight: 600 }}>
                    Exchange Coins
                </Typography>

                <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <FormControl sx={{ flex: 1 }}>
                            <Select
                                value={fromCoin}
                                onChange={(e) => {
                                    setFromCoin(e.target.value);
                                    fetchUserBalance(); // Refetch user balance when fromCoin changes
                                }}
                                sx={{ borderRadius: 2, backgroundColor: theme === 'dark' ? '#333' : 'white' }}
                                size="small"
                            >
                                {coins.map((coin) => (
                                    <MenuItem key={coin.symbol} value={coin.symbol}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Avatar src={coin.imageUrl} sx={{ width: 24, height: 24 }} />
                                            {coin.symbol}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <IconButton onClick={handleSwap} color="primary" size="small">
                            <SwapVertIcon />
                        </IconButton>

                        <FormControl sx={{ flex: 1 }}>
                            <Select
                                value={toCoin}
                                onChange={(e) => setToCoin(e.target.value)}
                                sx={{ borderRadius: 2, backgroundColor: theme === 'dark' ? '#333' : 'white' }}
                                size="small"
                            >
                                {coins.map((coin) => (
                                    <MenuItem key={coin.symbol} value={coin.symbol}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Avatar src={coin.imageUrl} sx={{ width: 24, height: 24 }} />
                                            {coin.symbol}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {baseRate && (
                        <Paper sx={{ p: 2, mt: 2, mb: 2, borderRadius: 2, background: theme === 'dark' ? '#424242' : 'rgba(0, 0, 0, 0.02)' }}>
                            <Typography variant="body2" color={theme === 'dark' ? 'white' : 'text.secondary'}>
                                Current Exchange Rate
                            </Typography>
                            <Typography variant="h6" color="primary.main">
                                1 {fromCoin} = {baseRate.toFixed(8)} {toCoin}
                            </Typography>
                        </Paper>
                    )}

                    <TextField
                        fullWidth
                        label="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        type="number"
                        sx={{ mt: 3, mb: 2 }}
                        size="small"
                        InputProps={{
                            endAdornment: <Typography color={theme === 'dark' ? 'white' : 'text.secondary'}>{fromCoin}</Typography>
                        }}
                    />

                    {rate && (
                        <Paper sx={{ p: 2, mb: 3, borderRadius: 2, background: theme === 'dark' ? '#424242' : 'rgba(0, 0, 0, 0.02)' }}>
                            <Typography variant="body2" color={theme === 'dark' ? 'white' : 'text.secondary'}>
                                You Will Receive
                            </Typography>
                            <Typography variant="h6" color="primary.main">
                                {rate.toFixed(8)} {toCoin}
                            </Typography>
                        </Paper>
                    )}

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleExchange}
                        disabled={loading}
                        size="small"
                        sx={{
                            borderRadius: 2,
                            py: 1.5,
                            background: theme === 'dark' ? 'linear-gradient(45deg, #7c4dff 30%, #448aff 90%)' : 'linear-gradient(45deg, #7c4dff 30%, #448aff 90%)',
                            '&:hover': {
                                background: theme === 'dark' ? 'linear-gradient(45deg, #673ab7 30%, #2196f3 90%)' : 'linear-gradient(45deg, #673ab7 30%, #2196f3 90%)',
                            }
                        }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Exchange'}
                    </Button>

                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleExchangeAll}
                        disabled={loading}
                        size="small"
                        sx={{ mt: 2, borderRadius: 2 }}
                    >
                        Exchange All ({userBalance} {fromCoin})
                    </Button>
                </Box>
            </Paper>

            {/* Exchange History */}
            <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', backgroundColor: theme === 'dark' ? '#1e1e1e' : 'white' }}>
                <Box sx={{ p: 2, backgroundColor: theme === 'dark' ? '#333' : '#f8f9fa' }}>
                    <Typography variant="h6" sx={{ color: theme === 'dark' ? 'white' : 'primary.main' }}>
                        Exchange History
                    </Typography>
                </Box>

                <TableContainer sx={{ minHeight: 500, maxHeight: 500 }}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: theme === 'dark' ? '#424242' : 'white' }}>Date</TableCell>
                                <TableCell sx={{ backgroundColor: theme === 'dark' ? '#424242' : 'white' }}>From</TableCell>
                                <TableCell sx={{ backgroundColor: theme === 'dark' ? '#424242' : 'white' }}>To</TableCell>
                                <TableCell sx={{ backgroundColor: theme === 'dark' ? '#424242' : 'white' }}>Amount</TableCell>
                                <TableCell sx={{ backgroundColor: theme === 'dark' ? '#424242' : 'white' }}>Exchanged Amount</TableCell>
                                <TableCell sx={{ backgroundColor: theme === 'dark' ? '#424242' : 'white' }}>Exchange Rate</TableCell>
                                <TableCell sx={{ backgroundColor: theme === 'dark' ? '#424242' : 'white' }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {exchangeHistory.length > 0 ? (
                                exchangeHistory.map((exchange) => (
                                    <TableRow key={exchange.id} hover>
                                        <TableCell>
                                            <Typography variant="caption" color={theme === 'dark' ? 'white' : 'text.primary'}>
                                                {format(new Date(exchange.createdAt), 'PP')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color={theme === 'dark' ? 'white' : 'text.primary'}>
                                                {exchange.amount} {exchange.fromCurrency}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color={theme === 'dark' ? 'white' : 'text.primary'}>
                                                {exchange.exchangedAmount} {exchange.toCurrency}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color={theme === 'dark' ? 'white' : 'text.primary'}>
                                                {exchange.exchangedAmount} {exchange.amount}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color={theme === 'dark' ? 'white' : 'text.primary'}>
                                                {exchange.exchangedAmount} {exchange.exchangedAmount}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 500, color: theme === 'dark' ? 'white' : 'text.primary' }}>
                                                {exchange.exchangeRate}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={exchange.exchangeStatus}
                                                size="small"
                                                color={statusColors[exchange.exchangeStatus]}
                                                sx={{ fontSize: '0.7rem' }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                            <AssignmentIcon sx={{ fontSize: 50, color: theme === 'dark' ? 'white' : 'text.disabled' }} />
                                            <Typography variant="h6" color={theme === 'dark' ? 'white' : 'text.secondary'}>
                                                No Exchange History
                                            </Typography>
                                            <Typography variant="body2" color={theme === 'dark' ? 'white' : 'text.disabled'}>
                                                Your exchange transactions will appear here
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Button
                variant="outlined"
                onClick={() => navigate('/exchange-history')}
                sx={{ mt: 2, color: theme === 'dark' ? 'white' : 'inherit', borderColor: theme === 'dark' ? 'white' : 'inherit' }}
            >
                View Exchange History
            </Button>

            <Dialog
                open={loginDialogOpen}
                onClose={() => setLoginDialogOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: '15px',
                        padding: '10px',
                        backgroundColor: theme === 'dark' ? '#1e1e1e' : 'white'
                    }
                }}
            >
                <DialogTitle sx={{ textAlign: 'center', color: theme === 'dark' ? 'white' : 'primary.main' }}>
                    Sign In Required
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                        <LoginIcon sx={{ fontSize: 60, color: theme === 'dark' ? 'white' : 'primary.main', mb: 2 }} />
                        <Typography variant="body1" sx={{ textAlign: 'center', mb: 2, color: theme === 'dark' ? 'white' : 'inherit' }}>
                            Please sign in to exchange coins
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                    <Button
                        onClick={() => setLoginDialogOpen(false)}
                        variant="outlined"
                        sx={{ borderRadius: '20px', mr: 1, color: theme === 'dark' ? 'white' : 'inherit', borderColor: theme === 'dark' ? 'white' : 'inherit' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => navigate('/signin')}
                        variant="contained"
                        sx={{ borderRadius: '20px' }}
                    >
                        Sign In
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Exchange Success Dialog */}
            <Dialog
                open={exchangeDialogOpen}
                onClose={() => setExchangeDialogOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: '15px',
                        padding: '20px',
                        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f0f4ff'
                    }
                }}
            >
                <DialogTitle sx={{ textAlign: 'center', color: theme === 'dark' ? 'white' : 'primary.main' }}>
                    Exchange Successful!
                </DialogTitle>
                <DialogContent>
                    {exchangeData && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body1" color={theme === 'dark' ? 'white' : 'text.secondary'}>
                                You exchanged:
                            </Typography>
                            <Typography variant="h6" color="primary.main">
                                {exchangeData.amount} {exchangeData.fromCurrency} for {exchangeData.exchangedAmount} {exchangeData.toCurrency}
                            </Typography>
                            <Typography variant="body2" color={theme === 'dark' ? 'white' : 'text.secondary'}>
                                Exchange Rate: {exchangeData.exchangeRate}
                            </Typography>
                            <Typography variant="body2" color={theme === 'dark' ? 'white' : 'text.secondary'}>
                                Status: <Chip label={exchangeData.exchangeStatus} color={statusColors[exchangeData.exchangeStatus]} />
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                    <Button
                        onClick={() => setExchangeDialogOpen(false)}
                        variant="contained"
                        sx={{ borderRadius: '20px' }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
