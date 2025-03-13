import { Box, Typography, Chip } from "@mui/material";
import btcIcon from '../../../images/coin-icons/bitcoin-cryptocurrency.svg';
import ethIcon from '../../../images/coin-icons/ethereum-cryptocurrency.svg';
import usdtIcon from '../../../images/coin-icons/usdt.png';
import usdcIcon from '../../../images/coin-icons/usdc.png';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AssetCard({ data, theme }) {
    const [estimatedValue, setEstimatedValue] = useState('********');
    const [unknownCoinIcon, setUnknownCoinIcon] = useState('');

    const getCoinIcon = (symbol) => {
        switch (symbol.toUpperCase()) {
            case 'BTC':
                return btcIcon;
            case 'ETH':
                return ethIcon;
            case 'USDT':
                return usdtIcon;
            case 'USDC':
                return usdcIcon;
            default:
                return null;
        }
    };


    const findCoinIcon = async (symbol) => {
        if (symbol) {
            const response = await axios.get('https://min-api.cryptocompare.com/data/pricemultifull', {
                params: {
                    fsyms: symbol,
                    tsyms: 'USD'
                }
            });
            const rawData = response.data.RAW;
            setUnknownCoinIcon(`https://www.cryptocompare.com${rawData[symbol]["USD"].IMAGEURL}`);
            return `https://www.cryptocompare.com${rawData[symbol]["USD"].IMAGEURL}`;
        }
    };

    useEffect(() => {
        const fetchEstimatedValue = async () => {
            if (data.available && !isNaN(parseFloat(data.available))) {
                try {
                    const response = await axios.get('https://min-api.cryptocompare.com/data/price', {
                        params: {
                            fsym: data.name,
                            tsyms: 'USD'
                        }
                    });
                    const price = response.data.USD;
                    const totalValue = (parseFloat(data.available) * price).toFixed(2);
                    setEstimatedValue(`${totalValue} USD`);
                } catch (error) {
                    console.error('Error fetching estimated value:', error);
                }
            }
        };

        fetchEstimatedValue();
    }, [data.available, data.name]);

    return (
        <Box display='flex' flexDirection='column' sx={{
            background: theme === 'dark' ? '#1e1e1e' : 'white',
            borderRadius: '10px',
            marginBottom: 2,
            padding: 2,
            boxShadow: theme === 'dark' ? '0 2px 8px rgba(255, 255, 255, 0.1)' : '0 2px 8px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme === 'dark' ? '0 4px 12px rgba(255, 255, 255, 0.2)' : '0 4px 12px rgba(0,0,0,0.1)'
            }
        }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                    {getCoinIcon(data.name) ? (
                        <img
                            src={getCoinIcon(data.name)}
                            alt={data.name}
                            style={{ width: 24, height: 24 }}
                        />
                    ) : (
                        findCoinIcon(data.name) && (
                            <img
                                src={unknownCoinIcon}
                                alt={data.name}
                                style={{ width: 24, height: 24 }}
                            />
                        )
                    )}
                    <Typography
                        variant="h6"
                        color={theme === 'dark' ? 'white' : 'primary'}
                        sx={{ fontWeight: 600 }}
                    >
                        {data.name}
                    </Typography>
                </Box>
                <Chip
                    label={data.isActive ? 'Active' : 'Inactive'}
                    color={data.isActive ? 'success' : 'default'}
                    size="small"
                    sx={{ height: 24 }}
                />
            </Box>

            <Box display='flex' justifyContent='space-between' gap={2}>
                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="caption"
                        color={theme === 'dark' ? 'grey.400' : 'text.secondary'}
                        sx={{ mb: 0.5, display: 'block' }}
                    >
                        Available Balance
                    </Typography>
                    <Typography
                        variant="body1"
                        color={theme === 'dark' ? 'white' : 'primary.main'}
                        sx={{ fontWeight: 600 }}
                    >
                        {data.available} {data.name}
                    </Typography>
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="caption"
                        color={theme === 'dark' ? 'grey.400' : 'text.secondary'}
                        sx={{ mb: 0.5, display: 'block' }}
                    >
                        In Review
                    </Typography>
                    <Typography
                        variant="body1"
                        color="warning.main"
                        sx={{ fontWeight: 600 }}
                    >
                        {data.inreview} {data.name}
                    </Typography>
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="caption"
                        color={theme === 'dark' ? 'grey.400' : 'text.secondary'}
                        sx={{ mb: 0.5, display: 'block' }}
                    >
                        Estimated (USD)
                    </Typography>
                    <Typography
                        variant="body1"
                        color="success.main"
                        sx={{ fontWeight: 600 }}
                    >
                        {estimatedValue}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
} 