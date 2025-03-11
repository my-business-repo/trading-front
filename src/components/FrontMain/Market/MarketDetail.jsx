import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Added useNavigate
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Chip,
    CircularProgress,
    useTheme,
    useMediaQuery,
    IconButton // Added IconButton
} from '@mui/material';
import axios from 'axios';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import back button icon
import { useAppContext } from '../../../context/AppContext';

export default function MarketDetail() {
    const { coin } = useParams();
    const navigate = useNavigate(); // Initialize navigate
    const [marketData, setMarketData] = useState(null);
    const [historicalData, setHistoricalData] = useState([]);
    const [loading, setLoading] = useState(true);
    const themeUi = useTheme();
    const isMobile = useMediaQuery(themeUi.breakpoints.down('sm'));
    const { theme } = useAppContext();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [marketResponse, historyResponse] = await Promise.all([
                    axios.get('https://min-api.cryptocompare.com/data/pricemultifull', {
                        params: {
                            fsyms: coin.toUpperCase(),
                            tsyms: 'USDT'
                        }
                    }),
                    axios.get('https://min-api.cryptocompare.com/data/v2/histohour', {
                        params: {
                            fsym: coin.toUpperCase(),
                            tsym: 'USDT',
                            limit: 24
                        }
                    })
                ]);

                const rawData = marketResponse.data.RAW[coin.toUpperCase()].USDT;
                setMarketData({
                    price: rawData.PRICE.toFixed(3),
                    change24h: rawData.CHANGEPCT24HOUR.toFixed(2),
                    high24h: rawData.HIGH24HOUR.toFixed(3),
                    low24h: rawData.LOW24HOUR.toFixed(3),
                    volume24h: rawData.VOLUME24HOUR.toFixed(2),
                    marketCap: rawData.MKTCAP.toFixed(2),
                    supply: rawData.SUPPLY.toFixed(2),
                    imageUrl: `https://www.cryptocompare.com${rawData.IMAGEURL}`
                });

                const chartData = historyResponse.data.Data.Data.map(item => ({
                    time: new Date(item.time * 1000).toLocaleTimeString(),
                    price: item.close.toFixed(2)
                }));
                setHistoricalData(chartData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [coin]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress size={30} sx={{ color: '#7c4dff' }} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 1, mb: 2 }}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 3, background: theme === 'dark' ? 'linear-gradient(145deg, #1e1e1e 0%, #2c2c2c 100%)' : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)' }}>
                {/* Header Section */}
                <Grid container spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <IconButton onClick={() => navigate(-1)} aria-label="back"> {/* Back button */}
                                <ArrowBackIcon />
                            </IconButton>
                            <img
                                src={marketData.imageUrl}
                                alt={coin}
                                style={{ width: 32, height: 32, borderRadius: '50%' }}
                            />
                            <Typography variant="h5" sx={{ textTransform: 'uppercase', color: theme === 'dark' ? 'white' : '#2c3e50', fontWeight: 600 }}>
                                {coin}/USDT <ShowChartIcon sx={{ fontSize: 20, color: '#7c4dff', verticalAlign: 'middle' }} />
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box display="flex" flexDirection="column" alignItems={{ xs: 'start', sm: 'end' }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: theme === 'dark' ? '#ffffff' : '#1a237e', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                                ${marketData.price}
                            </Typography>
                            <Chip
                                icon={parseFloat(marketData.change24h) >= 0 ? <TrendingUpIcon sx={{ color: 'success.main' }} /> : <TrendingDownIcon sx={{ color: 'error.main' }} />}
                                label={`${marketData.change24h}%`}
                                color={parseFloat(marketData.change24h) >= 0 ? 'success' : 'error'}
                                size="small"
                                sx={{ 
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    height: 24
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>

                {/* Chart Section */}
                <Paper elevation={1} sx={{ p: 1, mb: 2, borderRadius: 2, height: 300, background: theme === 'dark' ? '#2c2c2c' : '#ffffff' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={historicalData}>
                            <CartesianGrid strokeDasharray="2 2" stroke={theme === 'dark' ? '#444' : '#f0f0f0'} />
                            <XAxis 
                                dataKey="time" 
                                tick={{ fontSize: 10, fill: theme === 'dark' ? '#ffffff' : '#666' }}
                                interval={isMobile ? 6 : 2}
                            />
                            <YAxis 
                                tick={{ fontSize: 10, fill: theme === 'dark' ? '#ffffff' : '#666' }}
                                domain={['auto', 'auto']}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    background: theme === 'dark' ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke="#7c4dff"
                                fill="url(#colorGradient)"
                                strokeWidth={2}
                            />
                            <defs>
                                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7c4dff" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#7c4dff" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                        </AreaChart>
                    </ResponsiveContainer>
                </Paper>

                {/* Stats Grid */}
                <Grid container spacing={1}>
                    {[
                        { label: '24h High 📈', value: `$${marketData.high24h}`, color: '#2e7d32' },
                        { label: '24h Low 📉', value: `$${marketData.low24h}`, color: '#d32f2f' },
                        { label: '24h Volume 📊', value: `$${marketData.volume24h}`, color: '#1976d2' },
                        { label: 'Market Cap 💰', value: `$${marketData.marketCap}`, color: '#7c4dff' },
                        { label: 'Supply ⚡', value: marketData.supply, color: '#ed6c02' },
                    ].map((stat, index) => (
                        <Grid item xs={6} sm={4} md={2.4} key={index}>
                            <Paper elevation={1} sx={{ 
                                p: 1.5, 
                                borderRadius: 2,
                                height: '100%',
                                transition: 'transform 0.2s',
                                background: theme === 'dark' ? '#3c3c3c' : '#ffffff',
                                '&:hover': {
                                    transform: 'translateY(-2px)'
                                }
                            }}>
                                <Typography variant="caption" sx={{ color: theme === 'dark' ? '#ffffff' : 'text.secondary', fontSize: '0.7rem' }}>
                                    {stat.label}
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                    fontWeight: 600,
                                    color: stat.color,
                                    fontSize: '0.85rem'
                                }}>
                                    {stat.value}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Container>
    );
}