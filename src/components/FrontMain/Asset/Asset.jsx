import { Avatar, Box, Typography, IconButton } from "@mui/material";
import deposit from '../../../images/general/deposit.png';
import withdraw from '../../../images/general/withdraw.png';
import exchange from '../../../images/general/exchange.png';
import { useState, useEffect } from "react";
import AccountAsset from "./AccountAsset";
import CoinAsset from "./CoinAsset";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { useAppContext } from "../../../context/AppContext";


export default function Asset() {
    const [value, setValue] = useState(0);
    const [showBalance, setShowBalance] = useState(true);
    const { assetCtx, setAssetCtx } = useAppContext();
    const [assets, setAssets] = useState(assetCtx);
    const [totalBalance, setTotalBalance] = useState(0);
    const navigate = useNavigate();
    const { theme } = useAppContext();

    const mockAssets = [
        {
            accountNo: "DEFAULT_USDC",
            balance: "0",
            inreview_balance: "0",
            currency: "USDC",
            isActive: true
        },
        {
            accountNo: "DEFAULT_BTC",
            balance: "0",
            inreview_balance: "0",
            currency: "BTC",
            isActive: true
        },
        {
            accountNo: "DEFAULT_ETH",
            balance: "0",
            inreview_balance: "0",
            currency: "ETH",
            isActive: true
        },
        {
            accountNo: "DEFAULT_USDT",
            balance: "0",
            inreview_balance: "0",
            currency: "USDT",
            isActive: true
        }
    ];

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/customer/assets`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                const accounts = response.data.data.accounts;

                if (!accounts || accounts.length === 0) {
                    setAssets(mockAssets);
                    setTotalBalance("0.00");
                    return;
                }

                // Add default crypto assets if not present
                const cryptos = ['BTC', 'ETH', 'USDT', 'USDC'];
                const allAssets = [...accounts];


                console.log("all assets::", allAssets)

                cryptos.forEach(crypto => {
                    if (!accounts.find(a => a.currency.toUpperCase() === crypto)) {
                        allAssets.push({
                            accountNo: `DEFAULT_${crypto}`,
                            balance: "0",
                            inreview_balance: "0",
                            currency: crypto,
                            isActive: true
                        });
                    }
                });

                setAssets(allAssets);
                setAssetCtx(allAssets);

                // Get crypto prices from CryptoCompare
                const pricePromises = allAssets.map(async (account) => {
                    if (['btc', 'eth', 'usdt', 'usdc'].includes(account.currency.toLowerCase())) {
                        try {
                            const priceResponse = await axios.get(
                                `https://min-api.cryptocompare.com/data/price?fsym=${account.currency}&tsyms=USD`
                            );
                            const usdPrice = priceResponse.data.USD;
                            if (usdPrice)
                                return parseFloat(account.balance) * usdPrice;
                            else
                                return 0;
                        } catch (error) {
                            console.log(`Error fetching price for ${account.currency}:`, error);
                            return parseFloat(account.balance);
                        }
                    }
                    return parseFloat(account.balance);
                });

                const usdValues = await Promise.all(pricePromises);
                const total = usdValues.reduce((sum, value) => sum + value, 0);
                setTotalBalance(total.toFixed(2));

            } catch (error) {
                console.error('Error fetching assets:', error);
                setAssets(mockAssets);
                setTotalBalance("0.00");
            }
        };

        fetchAssets();
    }, []);

    const toggleBalance = () => {
        setShowBalance(!showBalance);
    };

    return (
        <Box pb={1}>
            <Box
                sx={{
                    backgroundSize: 'cover',
                    backgroundColor: theme === 'dark' ? '#1e1e1e' : '#0091ea',
                    backgroundPosition: 'center',
                    height: '20vh',
                    overflow: 'hidden'
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: "100%", flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body" color='white'>Total Asset</Typography>
                        <IconButton onClick={toggleBalance} size="small" sx={{ color: 'white' }}>
                            {showBalance ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                    </Box>
                    <Typography variant="h5" color='white'>
                        {showBalance ? `${totalBalance} USD` : '********'}
                    </Typography>
                </Box>
            </Box>

            <Box
                p={1}
                pb={5}
                sx={{
                    background: theme === 'dark' ? '#2c2c2c' : 'white',
                    borderTopRightRadius: '10px',
                    borderTopLeftRadius: '10px',
                    position: 'relative',
                    marginTop: '-10px',
                    height: '100%'
                }}>

                <Box sx={{ display: 'flex', justifyContent: 'space-around', marginBottom: 1 }}>
                    <Box>
                        <Box
                            onClick={() => navigate('/deposit')}
                            sx={{
                                cursor: 'pointer',
                                textDecoration: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                        >
                            <img src={deposit} width={50} alt="deposit" />
                            <Typography variant="body" color={theme === 'dark' ? 'white' : 'MenuText'}>Deposit</Typography>
                        </Box>
                    </Box>

                    <Box>
                        <Box
                            onClick={() => navigate('/withdraw')}
                            sx={{
                                cursor: 'pointer',
                                textDecoration: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                        >
                            <img src={withdraw} width={50} alt="withdraw" />
                            <Typography variant="body" color={theme === 'dark' ? 'white' : 'MenuText'}>Withdraw</Typography>
                        </Box>
                    </Box>

                    <Box>
                        <Box
                            onClick={() => {
                                navigate('/trade/1');
                            }}
                            sx={{
                                cursor: 'pointer',
                                textDecoration: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                        >
                            <img src={exchange} width={50} alt="exchange" />
                            <Typography variant="body" color={theme === 'dark' ? 'white' : 'MenuText'}>Exchange</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {assets && (value === 0 ?
                <AccountAsset assets={assets} showBalance={showBalance} theme={theme} />
                : <CoinAsset assets={assets} showBalance={showBalance} theme={theme} />)}

        </Box>
    )
}