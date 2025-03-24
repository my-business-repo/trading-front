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
        return format(new Date(dateString), 'PP');
    } catch (error) {
        console.log(dateString);
        return dateString;
    }
};

export default function TransactionList() {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState({
        type: 'ALL',
        status: 'ALL'
    });
    const { theme } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        fetchTransactions();
    }, []);

    useEffect(() => {
        filterTransactions();
    }, [search, filter, transactions]);

    const fetchTransactions = async () => {
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const response = await axios.get(`${API_URL}/api/v1/transactions`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setTransactions(response.data.allTransactions);
        } catch (error) {
            toast.error('Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    const filterTransactions = () => {
        let filtered = [...transactions];

        if (filter.type !== 'ALL') {
            filtered = filtered.filter(tx => tx.type === filter.type);
        }

        if (filter.status !== 'ALL') {
            filtered = filtered.filter(tx => tx.status === filter.status);
        }

        if (search) {
            filtered = filtered.filter(tx =>
                tx.transactionId.toLowerCase().includes(search.toLowerCase()) ||
                tx.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredTransactions(filtered);
    };

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            filteredTransactions.map(tx => ({
                'Transaction ID': tx.transactionId,
                'Description': tx.description,
                'Type': tx.type,
                'Amount': tx.amount,
                'Status': tx.status,
                'Date': formatDate(tx.createdAt)
            }))
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
        XLSX.writeFile(workbook, "transactions.xlsx");
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
                            Transaction History 📊
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
                            placeholder="Search transactions..."
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
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel sx={{ color: theme === 'dark' ? 'white' : 'black' }}>Type</InputLabel>
                                <Select
                                    value={filter.type}
                                    label="Type"
                                    onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                                    sx={{ backgroundColor: theme === 'dark' ? '#3c3c3c' : 'white' }}
                                >
                                    <MenuItem value="ALL">All</MenuItem>
                                    <MenuItem value="DEPOSIT">Deposit</MenuItem>
                                    <MenuItem value="WITHDRAWAL">Withdrawal</MenuItem>
                                </Select>
                            </FormControl>
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
                </Box>

                <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                    <Stack spacing={2}>
                        {filteredTransactions.map((transaction) => (
                            <Paper
                                key={transaction.transactionId}
                                elevation={0}
                                sx={{
                                    p: 2,
                                    backgroundColor: theme === 'dark' ? '#3c3c3c' : '#fff',
                                    borderRadius: 2,
                                    border: theme === 'dark' ? '1px solid #404040' : '1px solid #e0e0e0'
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ color: theme === 'dark' ? '#fff' : '#000', mb: 0.5 }}>
                                            {transaction.type}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: theme === 'dark' ? '#ccc' : '#666' }}>
                                            {formatDate(transaction.createdAt)}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: theme === 'dark' ? '#ccc' : '#666', display: 'block', textAlign: 'right', mb: 0.5 }}>
                                            Amount:
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ color: theme === 'dark' ? '#fff' : '#000', fontWeight: 'bold' }}>
                                            {transaction.amount} USDT
                                        </Typography>
                                    </Box>
                                </Box>
                                
                                <Divider sx={{ my: 1, borderColor: theme === 'dark' ? '#555' : '#eee' }} />
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                    <Box sx={{ maxWidth: '60%' }}>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                color: theme === 'dark' ? '#ccc' : '#666',
                                                display: 'block',
                                                mb: 0.5
                                            }}
                                        >
                                            Address:
                                        </Typography>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                color: theme === 'dark' ? '#aaa' : '#666',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: 'block'
                                            }}
                                        >
                                            {transaction.transactionId}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={transaction.status}
                                        size="small"
                                        color={statusColors[transaction.status]}
                                        sx={{ fontSize: '0.7rem' }}
                                    />
                                </Box>
                            </Paper>
                        ))}
                    </Stack>
                </Box>
            </Paper>
        </Container>
    );
}