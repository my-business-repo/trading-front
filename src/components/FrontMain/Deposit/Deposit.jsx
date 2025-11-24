import { Box, Container, Grid, Paper, Typography, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UsdtIcon from '../../../images/coin-icons/usdt.png';
import UsdcIcon from '../../../images/coin-icons/usdc.png';
import EthIcon from '../../../images/coin-icons/ethereum-cryptocurrency.svg';
import BtcIcon from '../../../images/coin-icons/bitcoin-cryptocurrency.svg';
import AdaIcon from '../../../images/coin-icons/ada.png';
import SolIcon from '../../../images/coin-icons/sol.png';
import XrpIcon from '../../../images/coin-icons/xrp.png';
import DogeIcon from '../../../images/coin-icons/doge.png';
import ZecIcon from '../../../images/coin-icons/zec-coin.png';
import { useAppContext } from '../../../context/AppContext';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';


const coins = [
    { id: 1, name: 'USDT', icon: UsdtIcon, network: 'ERC20' },
    { id: 2, name: 'USDC', icon: UsdcIcon, network: 'ERC20' },
    { id: 3, name: 'ETH', icon: EthIcon, network: 'ERC20' },
    { id: 4, name: 'BTC', icon: BtcIcon, network: 'BTC' },
    { id: 5, name: 'ADA', icon: AdaIcon, network: 'BNB' },
    { id: 6, name: 'SOL', icon: SolIcon, network: 'OFFICIAL TRUMP' },
    { id: 7, name: 'XRP', icon: XrpIcon, network: 'XRP' },
    { id: 8, name: 'DOGE', icon: DogeIcon, network: 'DOGE' },
    { id: 9, name: '$ZEC', icon: ZecIcon, network: 'ZEC' },
];

export default function Deposit() {
    const navigate = useNavigate();
    const { theme } = useAppContext();

    return (
        <Container height='100%' maxWidth="sm" sx={{ mt: 2, mb: 2, backgroundColor: theme === 'dark' ? '#121212' : '#ffffff', borderRadius: 2, p: 2, border: '1px solid #bb86fc' }}>
            <IconButton
                onClick={() => navigate("/")}
                sx={{ mb: 2, color: theme === 'dark' ? '#bb86fc' : '#6200ea', borderColor: theme === 'dark' ? '#bb86fc' : '#6200ea' }}
            >
                <KeyboardArrowLeftIcon />
            </IconButton>
            <Typography variant="h6" gutterBottom sx={{ pl: 1, color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                Select Deposit Coin
            </Typography>
            <Grid container spacing={2}>
                {coins.map((coin) => (
                    <Grid item xs={12} key={coin.id}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 2,
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                backgroundColor: theme === 'dark' ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.02)'
                                }
                            }}
                            onClick={() => navigate(`/deposit/${coin.name.toLowerCase()}`)}
                        >
                            <Box display="flex" alignItems="center" gap={1}>
                                <img
                                    src={coin.icon}
                                    alt={coin.name}
                                    style={{ width: 32, height: 32 }}
                                />
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="medium" sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                                        {coin.name}
                                    </Typography>
                                    <Typography variant="caption" color={theme === 'dark' ? 'lightgray' : 'text.primary'}>
                                        {coin.network}
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