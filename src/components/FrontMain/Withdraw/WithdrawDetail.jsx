import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip
} from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import back button icon
import IconButton from '@mui/material/IconButton'; // Import IconButton

export default function WithdrawDetail() {
    const [coin, setCoin] = useState('usdt');
    const [balance, setBalance] = useState(0);
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [rate, setRate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState(null);
    const navigate = useNavigate();

    const coins = [
        { value: 'usdt', label: 'USDT' },
        { value: 'usdc', label: 'USDC' },
        { value: 'eth', label: 'ETH' },
        { value: 'btc', label: 'BTC' }
    ];

    useEffect(() => {
        fetchBalance();
        fetchRate();
    }, [coin]);

    const fetchBalance = async () => {
        try {
            const API_URL = process.env.REACT_APP_API_URL;
            const response = await axios.get(`${API_URL}/api/v1/customer/balance`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            setBalance(response.data.balance);
        } catch (error) {
            toast.error('Failed to fetch balance');
        }
    };

    const fetchRate = async () => {
        try {
            const response = await axios.get('https://min-api.cryptocompare.com/data/price', {
                params: {
                    fsym: 'USDT',
                    tsyms: coin.toUpperCase()
                }
            });
            setRate(response.data[coin.toUpperCase()]);
        } catch (error) {
            console.error('Error fetching rate:', error);
        }
    };

    const handleWithdraw = async () => {
        setLoading(true);
        try {
            const API_URL = process.env.REACT_APP_API_URL;
            const response = await axios.post(`${API_URL}/api/v1/transactions/withdrawal`, {
                address,
                currency: coin.toUpperCase(),
                amount: parseFloat(amount),
                description: "Withdrawal for savings"
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            toast.success('Withdrawal request submitted');
            setTransactionDetails(response.data.transaction);
            setConfirmOpen(false);
            setAddress('');
            setAmount('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Withdrawal failed');
        } finally {
            setLoading(false);
        }
    };

    const fees = {
        'btc': 0.0001,
        'eth': 0.002,
        'usdt': 1,
        'usdc': 10
    };

    const fee = fees[coin.toLowerCase()] || 0;
    const receivedAmount = amount ? (parseFloat(amount) - fee) : 0;
    const usdValue = rate ? (receivedAmount * (1 / rate)).toFixed(2) : 0;

    return (
        <Container maxWidth="sm" sx={{ mt: 2, mb: 4 }}>
            <ToastContainer />
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Box display="flex" alignItems="center" mb={2}>
                    <IconButton onClick={() => navigate(-1)} aria-label="back">
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" gutterBottom sx={{ pl: 1 }}>
                        Withdraw Crypto
                    </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Available Balance
                    </Typography>
                    <Typography variant="h6" color="primary">
                        {balance} USDT
                    </Typography>
                </Box>

                <FormControl fullWidth margin="normal">
                    <InputLabel>Select Coin</InputLabel>
                    <Select
                        value={coin}
                        onChange={(e) => setCoin(e.target.value)}
                        label="Select Coin"
                    >
                        {coins.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    label="Withdrawal Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    placeholder={`Enter ${coin.toUpperCase()} address`}
                />

                <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                        endAdornment: <InputAdornment position="end">{coin.toUpperCase()}</InputAdornment>,
                    }}
                />

                <Box sx={{ my: 2, p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Transaction Details
                    </Typography>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Service Charge</Typography>
                        <Typography variant="body2">{fee} {coin.toUpperCase()}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">You Will Receive</Typography>
                        <Typography variant="body2" color="primary">
                            {receivedAmount} {coin.toUpperCase()}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">Estimated Value</Typography>
                        <Typography variant="body2" color="success.main">
                            ≈ ${usdValue} USD
                        </Typography>
                    </Box>
                </Box>

                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => setConfirmOpen(true)}
                    disabled={!address || !amount || loading}
                    sx={{ mt: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Withdraw'}
                </Button>
            </Paper>

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirm Withdrawal</DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Please verify the withdrawal address carefully. Transactions cannot be reversed.
                    </Alert>
                    <Typography variant="body1" gutterBottom>
                        Amount: {amount} {coin.toUpperCase()}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Address: {address}
                    </Typography>
                    <Typography variant="body1">
                        Fee: {fee} {coin.toUpperCase()}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                    <Button onClick={handleWithdraw} variant="contained" color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {transactionDetails && (
                <Dialog open={true} onClose={() => setTransactionDetails(null)}>
                    <DialogTitle>Transaction Successful</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1">Message: {transactionDetails.message}</Typography>
                        <Typography variant="body1">Transaction ID: {transactionDetails.transactionId}</Typography>
                        <Typography variant="body1">Amount: {transactionDetails.amount} {transactionDetails.currency}</Typography>
                        <Box display="flex" alignItems="center">
                            <Chip label={transactionDetails.status} style={{ backgroundColor: transactionDetails.status === 'PENDING' ? 'gray' : undefined }}
                             color={transactionDetails.status === 'PENDING' ? 'white' : 'error'} />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setTransactionDetails(null)}
                            variant="outlined"
                            color="secondary"
                        >
                            Close
                        </Button>
                        <Button
                            onClick={() => navigate('/transactions')}
                            variant="contained"
                            color="primary"
                        >
                            View Transactions
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Container>
    );
}