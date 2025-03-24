import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Select,
    MenuItem,
    InputAdornment,
    Chip,
    IconButton,
    InputLabel,
    FormControl,
    Button,
    Stack,
    Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { format } from 'date-fns';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import * as XLSX from 'xlsx';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const statusColors = {
    PENDING: 'warning',
    COMPLETED: 'success',
    FAILED: 'error',
    PROCESSING: 'info'
};

const formatDate = (dateString) => {
    try {
        return format(new Date(dateString), 'PP pp');
    } catch (error) {
        console.log(dateString);
        return dateString;
    }
};

export default function WithdrawalHistory() {
    const [withdrawals, setWithdrawals] = useState([]);
    const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState({
        status: 'ALL'
    });
    const { theme } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    useEffect(() => {
        filterWithdrawals();
    }, [search, filter, withdrawals]);

    const fetchWithdrawals = async () => {
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const response = await axios.get(`${API_URL}/api/v1/transactions`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            // Filter only withdrawal transactions
            const withdrawalTransactions = response.data.allTransactions.filter(tx => tx.type === 'WITHDRAWAL');
            setWithdrawals(withdrawalTransactions);
            console.log(withdrawalTransactions);
        } catch (error) {
            toast.error('Failed to load withdrawal history');
        } finally {
            setLoading(false);
        }
    };

    const filterWithdrawals = () => {
        let filtered = [...withdrawals];

        if (filter.status !== 'ALL') {
            filtered = filtered.filter(tx => tx.status === filter.status);
        }

        if (search) {
            filtered = filtered.filter(tx =>
                tx.transactionId.toLowerCase().includes(search.toLowerCase()) ||
                tx.description?.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredWithdrawals(filtered);
    };

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            filteredWithdrawals.map(tx => ({
                'Transaction ID': tx.transactionId,
                'Description': tx.description || '',
                'Amount': tx.amount,
                'Currency': tx.currency || 'USDT',
                'Status': tx.status,
                'Date': formatDate(tx.createdAt)
            }))
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Withdrawals");
        XLSX.writeFile(workbook, "withdrawal-history.xlsx");
    };

    return (
        <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 3 }, mb: 4, height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
            <ToastContainer />
            <Paper 
                elevation={0} 
                sx={{ 
                    borderRadius: 2, 
                    overflow: 'hidden', 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    backgroundColor: theme === 'dark' ? '#2c2c2c' : 'white',
                    border: theme === 'dark' ? '1px solid #404040' : '1px solid #e0e0e0'
                }}
            >
                <Box sx={{ p: 2, backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f8f9fa' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <IconButton onClick={() => navigate(-1)} sx={{ color: theme === 'dark' ? 'white' : 'black' }}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' }, color: theme === 'dark' ? 'white' : 'black' }}>
                            Withdrawal History 
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            size="small"
                            onClick={downloadExcel}
                            sx={{ borderColor: theme === 'dark' ? 'white' : 'black', color: theme === 'dark' ? 'white' : 'black' }}
                        >
                            Export Excel
                        </Button>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        flexDirection: { xs: 'column', sm: 'row' },
                        mb: 2
                    }}>
                        <TextField
                            size="small"
                            placeholder="Search withdrawals..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{ flexGrow: 1, backgroundColor: theme === 'dark' ? '#3c3c3c' : '', color: theme === 'dark' ? 'white' : '' }}
                            InputProps={{   
                                sx: { color: theme === 'dark' ? 'white' : '' },
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" sx={{ color: theme === 'dark' ? 'white' : '' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel sx={{ color: theme === 'dark' ? 'white' : 'black' }}>Status</InputLabel>
                            <Select
                                value={filter.status}
                                label="Status"
                                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                                sx={{ backgroundColor: theme === 'dark' ? '#3c3c3c' : 'white' }}
                            >
                                <MenuItem value="ALL">All</MenuItem>
                                <MenuItem value="PENDING">Pending</MenuItem>
                                <MenuItem value="COMPLETED">Completed</MenuItem>
                                <MenuItem value="FAILED">Failed</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 1, sm: 2 } }}>
                    <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: '0.7fr 1fr 0.7fr 2fr 0.7fr',
                        gap: { xs: 0.5, sm: 2 },
                        mb: { xs: 1, sm: 2 },
                        p: { xs: 1, sm: 2 },
                        backgroundColor: theme === 'dark' ? '#2c2c2c' : '#f5f5f5',
                        borderRadius: 1
                    }}>
                        <Typography variant="subtitle2" sx={{ 
                            color: theme === 'dark' ? '#fff' : '#000',
                            fontSize: { xs: '0.7rem', sm: '0.875rem' },
                            textAlign: 'center'
                        }}>Type</Typography>
                        <Typography variant="subtitle2" sx={{ 
                            color: theme === 'dark' ? '#fff' : '#000',
                            fontSize: { xs: '0.7rem', sm: '0.875rem' },
                            textAlign: 'center'
                        }}>Time</Typography>
                        <Typography variant="subtitle2" sx={{ 
                            color: theme === 'dark' ? '#fff' : '#000',
                            fontSize: { xs: '0.7rem', sm: '0.875rem' },
                            textAlign: 'center'
                        }}>Amount</Typography>
                        <Typography variant="subtitle2" sx={{ 
                            color: theme === 'dark' ? '#fff' : '#000',
                            fontSize: { xs: '0.7rem', sm: '0.875rem' },
                            textAlign: 'center'
                        }}>Address</Typography>
                        <Typography variant="subtitle2" sx={{ 
                            color: theme === 'dark' ? '#fff' : '#000',
                            fontSize: { xs: '0.7rem', sm: '0.875rem' },
                            textAlign: 'center'
                        }}>State</Typography>
                    </Box>
                    <Stack spacing={1}>
                        {filteredWithdrawals.map((withdrawal) => (
                            <Paper
                                key={withdrawal.transactionId}
                                elevation={0}
                                sx={{
                                    p: { xs: 1, sm: 2 },
                                    backgroundColor: theme === 'dark' ? '#3c3c3c' : '#fff',
                                    borderRadius: 2,
                                    border: theme === 'dark' ? '1px solid #404040' : '1px solid #e0e0e0'
                                }}
                            >
                                <Box sx={{ 
                                    display: 'grid',
                                    gridTemplateColumns: '0.7fr 1fr 0.7fr 2fr 0.7fr',
                                    gap: { xs: 0.5, sm: 2 },
                                    alignItems: 'center'
                                }}>
                                    <Typography variant="body2" sx={{ 
                                        color: theme === 'dark' ? '#fff' : '#000',
                                        fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                        textAlign: 'center'
                                    }}>
                                        {withdrawal.currency || 'USDT'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ 
                                        color: theme === 'dark' ? '#fff' : '#000',
                                        fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                        textAlign: 'center'
                                    }}>
                                        {formatDate(withdrawal.createdAt)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ 
                                        color: theme === 'dark' ? '#fff' : '#000',
                                        fontWeight: 'bold',
                                        fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                        textAlign: 'center'
                                    }}>
                                        {withdrawal.amount} {withdrawal.currency || 'USDT'}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            color: theme === 'dark' ? '#fff' : '#000',
                                            fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                            wordBreak: 'break-all',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {withdrawal.transactionId}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Chip
                                            label={withdrawal.status}
                                            size="small"
                                            color={statusColors[withdrawal.status]}
                                            sx={{ 
                                                fontSize: { xs: '0.6rem', sm: '0.7rem' },
                                                height: { xs: '20px', sm: '24px' }
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Paper>
                        ))}
                    </Stack>
                </Box>
            </Paper>
        </Container>
    );
}
