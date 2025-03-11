import Box from '@mui/material/Box';
import { Typography, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getCoinStringList } from '../../../utils/utils';
import MarketBTC from './MarketBTC';
import { useAppContext } from '../../../context/AppContext';

export default function Market() {
    const [value, setValue] = useState(0);
    const [selectedCurrency, setSelectedCurrency] = useState('USDT');
    const [loading, setLoading] = useState(false);
    const { theme,currencyDataCtx, setCurrencyDataCtx } = useAppContext();
    const [currencyData, setCurrencyData] = useState(currencyDataCtx);

    const fetchCryptoPairs = async () => {
        try {
            const response = await axios.get('https://min-api.cryptocompare.com/data/pricemultifull', {
                params: {
                    fsyms: getCoinStringList(),
                    tsyms: selectedCurrency
                }
            });
            const rawData = response.data.RAW;

            const formattedData = Object.entries(rawData).map(([symbol, data]) => ({
                name: symbol,
                currency: selectedCurrency,
                price: data[selectedCurrency].PRICE.toFixed(3),
                change: data[selectedCurrency].CHANGEPCT24HOUR.toFixed(3),
                imageUrl: `https://www.cryptocompare.com${data[selectedCurrency].IMAGEURL}`
            }));

            setCurrencyData(formattedData);
        } catch (error) {
            console.error('Error fetching crypto data:', error);
        }
    };

    const forceFetchCryptoPairs = async () => {
        currencyData.length ===0 && setLoading(true);
        try {
            const response = await axios.get('https://min-api.cryptocompare.com/data/pricemultifull', {
                params: {
                    fsyms: getCoinStringList(),
                    tsyms: selectedCurrency
                }
            });
            const rawData = response.data.RAW;

            const formattedData = Object.entries(rawData).map(([symbol, data]) => ({
                name: symbol,
                currency: selectedCurrency,
                price: data[selectedCurrency].PRICE.toFixed(3),
                change: data[selectedCurrency].CHANGEPCT24HOUR.toFixed(3),
                imageUrl: `https://www.cryptocompare.com${data[selectedCurrency].IMAGEURL}`
            }));

            setCurrencyData(formattedData);
            // store in appContext
            setCurrencyDataCtx(formattedData);

        } catch (error) {
            console.error('Error fetching crypto data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        forceFetchCryptoPairs();
    }, [selectedCurrency]);

    useEffect(() => {
        forceFetchCryptoPairs();
        const interval = setInterval(fetchCryptoPairs, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box sx={{
            alignSelf: 'flex-end',
            width: '100%',
            background: theme === 'dark' ? 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
            minHeight: '100vh'
        }}>
            <Box display='flex' justifyContent='center' sx={{
                background: theme === 'dark' ? 'rgba(30, 30, 30, 0.9)' : 'rgba(240, 240, 240, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.5)',
                borderRadius: '0 0 20px 20px'
            }}>
                <Typography variant="h5" sx={{
                    margin: 2,
                    color: theme === 'dark' ? '#bb86fc' : '#6200ea',
                    fontWeight: 'bold',
                    textShadow: theme === 'dark' ? '2px 2px 4px rgba(187,134,252,0.1)' : 'none'
                }}>
                    Market Overview
                </Typography>
            </Box>
            <Box sx={{ overflow: 'hidden', margin: 0, padding: 3 }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%'
                }}>
                    <Box sx={{
                        minWidth: 250,
                        background: theme === 'dark' ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '15px',
                        boxShadow: '0 4px 15px rgba(187,134,252,0.15)',
                        transition: 'transform 0.2s',
                        '&:hover': {
                            transform: 'translateY(-2px)'
                        }
                    }}>
                        <select
                            value={selectedCurrency}
                            onChange={(e) => setSelectedCurrency(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 20px',
                                border: '2px solid #3a3a3a',
                                borderRadius: '15px',
                                fontSize: '16px',
                                color: '#bb86fc',
                                cursor: 'pointer',
                                outline: 'none',
                                background: 'transparent',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                            }}
                        >
                            <option value="USDT">USDT</option>
                            <option value="USDC">USDC</option>
                            <option value="ETH">ETH</option>
                            <option value="BTC">BTC</option>
                        </select>
                    </Box>
                </Box>
            </Box>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress sx={{ color: '#bb86fc' }} />
                </Box>
            ) : (
                <MarketBTC data={currencyData} />
            )}
        </Box>
    );
}
