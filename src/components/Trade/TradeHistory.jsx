import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    TextField,
    Select,
    MenuItem,
    InputAdornment,
    Chip,
    FormControl,
    InputLabel,
    Button,
    CircularProgress,
    IconButton // Import IconButton for the back button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import back icon
import { format } from 'date-fns';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import * as XLSX from 'xlsx';
import NoDataIcon from '@mui/icons-material/RemoveShoppingCart'; // Import an icon for no data
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const statusColors = {
    PENDING: 'warning',
    COMPLETED: 'success',
    FAILED: 'error',
    WIN: 'success',
    LOSE: 'error'
};

const formatDate = (dateString) => {
    try {
        return format(new Date(dateString), 'PP');
    } catch (error) {
        return dateString;
    }
};

export default function TradeHistory() {
    const [trades, setTrades] = useState([]);
    const [filteredTrades, setFilteredTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState({
        type: 'ALL',
        status: 'ALL'
    });	
    const { theme } = useAppContext();

    useEffect(() => {
        fetchTrades();
    }, []);

    useEffect(() => {
        filterTrades();
    }, [search, filter, trades]);

    const fetchTrades = async () => {
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const response = await axios.get(`${API_URL}/api/v1/trade`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            setTrades(response.data);
        } catch (error) {
            toast.error('Failed to load trade history');
        } finally {
            setLoading(false);
        }
    };

    const filterTrades = () => {
        let filtered = [...trades];

        if (filter.type !== 'ALL') {
            filtered = filtered.filter(trade => trade.tradeType === filter.type);
        }

        if (filter.status !== 'ALL') {
            filtered = filtered.filter(trade => trade.tradingStatus === filter.status);
        }

        if (search) {
            filtered = filtered.filter(trade =>
                trade.account.accountNo.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredTrades(filtered);
    };

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            filteredTrades.map(trade => ({
                'Account': trade.account.accountNo,
                'Type': trade.tradeType,
                'Amount': trade.tradeQuantity,
                'Period': `${trade.period}s`,
                'Status': trade.tradingStatus,
                'Result': trade.tradingStatus === 'FAILED' ? 'NO RESULT' : trade.isSuccess === null ? 'Pending' : trade.isSuccess ? 'WIN' : 'LOSE',
                'Date': formatDate(trade.createdAt)
            }))
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Trades");
        XLSX.writeFile(workbook, "trade_history.xlsx");
    };

    const navigate = useNavigate();

    return (
        <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 3 }, mb: 4, height: '100vh', backgroundColor: theme === 'dark' ? '#1e1e1e' : '' }}>
            <ToastContainer />
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', height: '100%', backgroundColor: theme === 'dark' ? '#1e1e1e' : '' }}>
                <Box sx={{ p: 2, backgroundColor: theme === 'dark' ? '#2c2c2c' : '#f8f9fa' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <IconButton onClick={() => navigate(-1)} color="primary" size="small">
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ color: theme === 'dark' ? 'white' : 'primary.main' }}>
                            Trade History 📈
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            size="small"
                            onClick={downloadExcel}
                            sx={{ color: theme === 'dark' ? 'white' : 'black', borderColor: theme === 'dark' ? 'white' : 'black' }}
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
                            placeholder="Search by account..."
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
                                    <MenuItem value="LONG">Long</MenuItem>
                                    <MenuItem value="SHORT">Short</MenuItem>
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
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                </Box>

                <TableContainer sx={{ minHeight: 'calc(100vh - 200px)', backgroundColor: theme === 'dark' ? '#1e1e1e' : 'white' }}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: theme === 'dark' ? '#2c2c2c' : '#f5f5f5' , color: theme === 'dark' ? 'white' : 'black'}}>Account</TableCell>
                                <TableCell sx={{ backgroundColor: theme === 'dark' ? '#2c2c2c' : '#f5f5f5' , color: theme === 'dark' ? 'white' : 'black'}}>Type</TableCell>
                                <TableCell sx={{ backgroundColor: theme === 'dark' ? '#2c2c2c' : '#f5f5f5' , color: theme === 'dark' ? 'white' : 'black'}}>Amount</TableCell>
                                <TableCell sx={{ backgroundColor: theme === 'dark' ? '#2c2c2c' : '#f5f5f5' , color: theme === 'dark' ? 'white' : 'black'}}>Period</TableCell>
                                <TableCell sx={{ backgroundColor: theme === 'dark' ? '#2c2c2c' : '#f5f5f5' , color: theme === 'dark' ? 'white' : 'black'}}>Status</TableCell>
                                <TableCell sx={{ backgroundColor: theme === 'dark' ? '#2c2c2c' : '#f5f5f5' , color: theme === 'dark' ? 'white' : 'black'}}>Result</TableCell>
                                <TableCell sx={{ backgroundColor: theme === 'dark' ? '#2c2c2c' : '#f5f5f5' , color: theme === 'dark' ? 'white' : 'black'}}>Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : filteredTrades.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <NoDataIcon sx={{ fontSize: 40, color: 'grey.500' }} />
                                        <Typography variant="body2" color="textSecondary">No trades found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredTrades.map((trade) => (
                                    <TableRow key={trade.id} hover>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ color: theme === 'dark' ? 'white' : 'black' }}>
                                                {trade.account.accountNo}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={trade.tradeType}
                                                size="small"
                                                sx={{
                                                    fontSize: '0.7rem',
                                                    backgroundColor: trade.tradeType === 'LONG' ? '#e8f5e9' : '#ffebee',
                                                    color: trade.tradeType === 'LONG' ? '#2e7d32' : '#d32f2f'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 500, color: theme === 'dark' ? 'white' : 'black' }}>
                                                {trade.tradeQuantity} USDT
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ color: theme === 'dark' ? 'white' : 'black' }}>
                                                {trade.period}s
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={trade.tradingStatus}
                                                size="small"
                                                color={statusColors[trade.tradingStatus]}
                                                sx={{ fontSize: '0.7rem' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {trade.tradingStatus === 'FAILED' ? (
                                                <Typography variant="body2" sx={{ color: theme === 'dark' ? 'white' : 'black' }}>NO RESULT</Typography>
                                            ) : trade.isSuccess !== null && (
                                                <Chip
                                                    label={trade.isSuccess ? 'WIN' : 'LOSE'}
                                                    size="small"
                                                    color={trade.isSuccess ? 'success' : 'error'}
                                                    sx={{ fontSize: '0.7rem' }}
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" sx={{ color: theme === 'dark' ? 'white' : 'black' }}>
                                                {formatDate(trade.createdAt)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
} 