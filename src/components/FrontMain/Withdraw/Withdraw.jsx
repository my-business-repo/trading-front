import { Box, Container, Grid, Paper, Typography, IconButton } from '@mui/material';import { useNavigate } from 'react-router-dom';
import UsdtIcon from '../../../images/coin-icons/usdt.png';
import UsdcIcon from '../../../images/coin-icons/usdc.png';
import EthIcon from '../../../images/coin-icons/ethereum-cryptocurrency.svg';
import BtcIcon from '../../../images/coin-icons/bitcoin-cryptocurrency.svg';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import back button icon

const coins = [
    { id: 1, name: 'USDT', icon: UsdtIcon, network: 'TRC20', fee: '1 USDT' },
    { id: 2, name: 'USDC', icon: UsdcIcon, network: 'ERC20', fee: '10 USDC' },
    { id: 3, name: 'ETH', icon: EthIcon, network: 'ERC20', fee: '0.002 ETH' },
    { id: 4, name: 'BTC', icon: BtcIcon, network: 'BTC', fee: '0.0001 BTC' }
];

export default function Withdraw() {
    const navigate = useNavigate();
    return (
        <Container maxWidth="sm" sx={{ mt: 2, mb: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
                <IconButton onClick={() => navigate(-1)} aria-label="back">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" gutterBottom sx={{ pl: 1 }}>
                    Select Withdrawal Coin
                </Typography>
            </Box>
            <Grid container spacing={2}>
                {coins.map((coin) => (
                    <Grid item xs={6} sm={6} key={coin.id}>
                        <Paper 
                            elevation={2}
                            sx={{
                                p: 2,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }
                            }}
                            onClick={() => navigate(`/withdraw/${coin.name.toLowerCase()}`)}
                        >
                            <Box display="flex" alignItems="center" gap={1}>
                                <img 
                                    src={coin.icon} 
                                    alt={coin.name}
                                    style={{ width: 32, height: 32 }}
                                />
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="medium">
                                        {coin.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {coin.network}
                                    </Typography>
                                    <Typography variant="caption" color="error" display="block">
                                        Fee: {coin.fee}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
} 