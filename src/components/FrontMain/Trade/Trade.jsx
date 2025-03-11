import { BottomNavigation, BottomNavigationAction, Box, Button, Checkbox, CircularProgress, Drawer, IconButton, List, ListItem, ListItemText, Typography, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab } from "@mui/material";
import AssignmentIcon from '@mui/icons-material/Assignment';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useState } from "react";
import InfoChart from "./InfoChart";
import axios from "axios";
import { convertTimestampToLocalTime, formatNumberWithMillions, getCoinStringList } from "../../../utils/utils";
import InfoBarChart from "./InfoBarChart";
import InfoHistChart from "./InfoHistChart";
import { useInterval } from "react-use";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ConfirmModal from "./ConfirmModal";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { useAppContext } from "../../../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import LoginIcon from '@mui/icons-material/Login';
import Exchange from "../Exchange/Exchange";
import CandleChart from "./CandleChart";
import ChartV2 from "../chart/ChartV2";

export default function Trade() {
    const { tabValue } = useParams();
    const [value, setValue] = useState(parseInt(tabValue) || 0);
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [focusCoin, setFocusCoin] = useState('BTC');
    const [focusCoinImage, setFocusCoinImage] = useState('https://www.cryptocompare.com/media/37746251/btc.png');
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [tradeType, setTradeType] = useState('');
    const { customer, theme, setTheme } = useAppContext();
    const navigate = useNavigate();

    const [previousTheme, setPreviousTheme] = useState(theme);

    const [cryptoPairs, setCryptoPairs] = useState([]);
    const [timeFrame, setTimeFrame] = useState(30); // New state for timeframe

    const handleTradeClick = (type) => {
        if (!customer) {
            setLoginDialogOpen(true);
        } else {
            setTradeType(type);
            setOpen(true);
        }
    };

    const handleLoginDialogClose = () => {
        setLoginDialogOpen(false);
    };

    const navigateToLogin = () => {
        setLoginDialogOpen(false);
        navigate('/signin');
    };

    const fetchCryptoPairs = async () => {
        try {
            const response = await axios.get('https://min-api.cryptocompare.com/data/pricemultifull', {
                params: {
                    fsyms: getCoinStringList(),
                    tsyms: 'USDT'
                }
            });
            const rawData = response.data.RAW;

            const formattedPairs = Object.entries(rawData).map(([symbol, data]) => ({
                symbol: symbol,
                pair: `${symbol}/USDT`,
                price: data.USDT.PRICE.toFixed(2),
                change24h: data.USDT.CHANGEPCT24HOUR.toFixed(2),
                volume24h: data.USDT.VOLUME24HOUR.toFixed(2),
                imageUrl: `https://www.cryptocompare.com${data.USDT.IMAGEURL}` // Add image URL
            }));

            setCryptoPairs(formattedPairs);
        } catch (error) {
            console.error('Error fetching crypto pairs:', error);
        }
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const fetchData = async (timeFrame) => {
        try {
            const API = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${focusCoin}&tsym=USD&limit=${timeFrame}`;
            const response = await axios.get(API);
            let data = response.data.Data.Data;
            let finalData = {
                time: convertTimestampToLocalTime(data[data.length - 1].time),
                open: data[data.length - 1].open,
                high: data[data.length - 1].high,
                low: data[data.length - 1].low,
                close: data[data.length - 1].close,
                volumn: data[data.length - 1].volumeto,
                increase: (data[data.length - 1].open - data[data.length - 2].open).toFixed(2),
                increasePercent: (((data[data.length - 1].open - data[data.length - 2].open) / data[data.length - 2].open) * 100).toFixed(2)
            }
            setData(finalData);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };

    useInterval(() => {
        fetchData(timeFrame); // Fetch data every 5 seconds for the last timeframe
    }, [5000])



    useEffect(() => {
        setTheme('dark');

        return () => {
            console.log('unmounting');
            setTheme(previousTheme);
        };
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchData(timeFrame); // Fetch data for the last timeframe
        fetchCryptoPairs();
    }, [focusCoin, timeFrame]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark'); // Toggle theme state
    };

    const handleChange = (event, newValue) => {
        setTimeFrame(newValue);
        fetchData(newValue);
    };

    return (
        <Box sx={{ background: theme === 'dark' ? '#121212' : 'white', color: theme === 'dark' ? 'white' : 'black', paddingBottom:10 }}>
            {/** Navigation */}
            <Box pb={1} sx={{
                overflow: 'hidden',
                margin: 0,
                background: theme === 'dark' ? '#1e1e1e' : 'white'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', background: theme === 'dark' ? '#1e1e1e' : 'white', color: theme === 'dark' ? 'white' : 'black' }}>

                    {value === 0 && (
                        <IconButton onClick={toggleDrawer(true)}>
                            <MenuIcon sx={{ color: theme === 'dark' ? 'white' : 'black' }} />
                        </IconButton>
                    )}

                    <BottomNavigation
                        sx={{ padding: 1, margin: 0, flexGrow: 1, background: theme === 'dark' ? '#1e1e1e' : 'white', color: theme === 'dark' ? 'white' : 'black' }}
                        showLabels
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue)
                        }}
                    >
                        <BottomNavigationAction label="Trade" sx={{
                            color: theme === 'dark' ? 'white' : 'black',
                            '&.Mui-selected': {
                                borderBottom: '2px solid #2196f3',
                                fontWeight: 'bold',
                            },
                        }} />
                        <BottomNavigationAction label="Exchange" sx={{
                            color: theme === 'dark' ? 'white' : 'black',
                            '&.Mui-selected': {
                                borderBottom: '2px solid #2196f3',
                                fontWeight: 'bold',
                            },
                        }} />
                    </BottomNavigation>
                </Box>
            </Box>

            {value === 0 && (
                <>
                    <Drawer
                        anchor="left"
                        open={drawerOpen}
                        onClose={toggleDrawer(false)}
                    >
                        <Box
                            sx={{ width: 250 }}
                            role="presentation"
                            onClick={toggleDrawer(false)}
                            onKeyDown={toggleDrawer(false)}
                        >
                            <List>
                                {cryptoPairs.map((item, index) => (
                                    <ListItem
                                        key={index}
                                        divider
                                        onClick={() => {
                                            setFocusCoin(item.symbol);
                                            setFocusCoinImage(item.imageUrl);
                                        }}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                            <Avatar
                                                src={item.imageUrl}
                                                sx={{ width: 24, height: 24, marginRight: 1 }}
                                            />
                                            <ListItemText
                                                primary={item.pair}
                                                secondary={item.price}
                                                primaryTypographyProps={{
                                                    style: { fontWeight: 'bold', color: theme === 'dark' ? 'white' : 'black' }
                                                }}
                                                secondaryTypographyProps={{
                                                    style: { color: '#2196f3' }
                                                }}
                                            />
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Drawer>
                    {/** settings  */}

                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', background: theme === 'dark' ? '#1e1e1e' : 'white' }}>
                        <Box p={1} sx={{ background: theme === 'dark' ? '#1e1e1e' : 'white', width: '90%', maxWidth: '100%', '@media (max-width: 600px)': { width: '100%' } }} display='flex' justifyContent='space-between'>
                            <Box display='flex' alignItems='center' justifyContent='center'>
                                <Typography variant="body2" color="primary">
                                    <Box display="flex" alignItems="center">
                                        <Avatar src="https://www.cryptocompare.com/media/37746338/usdt.png" sx={{ width: 15, height: 15, marginRight: 1 }} /> USDT
                                        <CompareArrowsIcon sx={{ mx: 1 }} />
                                        <Avatar src={focusCoinImage} sx={{ width: 15, height: 15, marginRight: 1 }} />
                                        {focusCoin}
                                    </Box>
                                </Typography>
                            </Box>
                            <Box display='flex' alignItems='center' justifyContent='center'>
                                <AssignmentIcon color="primary" />
                                <Typography variant="body2" color={theme === 'dark' ? 'white' : 'grey'}>Position</Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/** info */}
                    <Box sx={{ minHeight: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', background: theme === 'dark' ? '#1e1e1e' : 'white' }}>
                        {loading ? (<CircularProgress />) : (
                            <Box sx={{ display: 'flex', width: '85%', maxWidth: '100%', '@media (max-width: 600px)': { width: '100%' } }} pt={1} pb={1}>
                                <Box p={1} sx={{ flexGrow: 1 }}>
                                    <Box>
                                        <Typography sx={{ marginBottom: 1 }} variant="body2" color='GrayText' fontSize="0.875rem">Current</Typography>
                                        <Typography sx={{ marginBottom: 1 }} variant="h6" color={Math.sign(data.increase) === 1 ? 'green' : 'red'} fontWeight='bold' fontSize="1rem">{data.open}</Typography>
                                        <Box display='flex'>
                                            <Typography sx={{ marginRight: 1 }} variant="body2" color={Math.sign(data.increase) === 1 ? 'green' : 'red'} fontWeight='bold' fontSize="0.875rem">{Math.abs(data.increase)}</Typography>
                                            <Typography variant="body2" color={Math.sign(data.increase) === 1 ? 'green' : 'red'} fontWeight='bold' fontSize="0.875rem">{Math.abs(data.increasePercent)} %</Typography>

                                            {Math.sign(data.increase) === 1 ? <ArrowUpwardIcon fontSize="small" sx={{ color: 'green' }} /> : <ArrowDownwardIcon fontSize="small" sx={{ color: 'red' }} />}
                                        </Box>
                                    </Box>
                                </Box>
                                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="body2" color='GrayText' fontSize="0.875rem">Opening</Typography>
                                        <Typography fontSize="0.875rem">{data.open}</Typography>
                                        <Typography variant="body2" color='GrayText' fontSize="0.875rem">Lowest</Typography>
                                        <Typography fontSize="0.875rem">{data.low}</Typography>
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="body2" color='GrayText' fontSize="0.875rem">Volumn</Typography>
                                        <Typography fontSize="0.875rem">{formatNumberWithMillions(data.volumn)}</Typography>
                                        <Typography variant="body2" color='GrayText' fontSize="0.875rem">Highest</Typography>
                                        <Typography fontSize="0.875rem">{data.high}</Typography>
                                    </Box>
                                </Box>
                            </Box>)}
                    </Box>

                    {/** graph control */}
                    {/* <Box pb={3} sx={{
                        overflow: 'auto',
                        margin: 'auto',
                        padding: 0,
                        background: theme === 'dark' ? '#1e1e1e' : 'white',
                        justifyContent: 'center',
                    }}>
                        <Tabs value={timeFrame} onChange={handleChange} aria-label="basic tabs example" variant="scrollable" scrollButtons="auto" sx={{ color: theme === 'dark' ? 'white' : 'inherit' }}>
                            <Tab label="5 M" value={5} sx={{ color: theme === 'dark' ? 'white' : 'inherit' }} />
                            <Tab label="10 M" value={10} sx={{ color: theme === 'dark' ? 'white' : 'inherit' }} />
                            <Tab label="15 M" value={15} sx={{ color: theme === 'dark' ? 'white' : 'inherit' }} />
                            <Tab label="30 M" value={30} sx={{ color: theme === 'dark' ? 'white' : 'inherit' }} />
                            <Tab label="1 H" value={60} sx={{ color: theme === 'dark' ? 'white' : 'inherit' }} />
                            <Tab label="2 H" value={120} sx={{ color: theme === 'dark' ? 'white' : 'inherit' }} />
                            <Tab label="4 H" value={240} sx={{ color: theme === 'dark' ? 'white' : 'inherit' }} />
                            <Tab label="1 D" value={1440} sx={{ color: theme === 'dark' ? 'white' : 'inherit' }} />
                            <Tab label="1 W" value={10080} sx={{ color: theme === 'dark' ? 'white' : 'inherit' }} />
                        </Tabs>
                    </Box> */}


                    {/* <Box sx={{ padding: '20px', background: theme === 'dark' ? '#1e1e1e' : 'white', marginBottom: '50px' }}>
                        <CandleChart focusCoin={focusCoin} isDarkTheme={theme === 'dark'} timeFrame={timeFrame} />
                    </Box> */}

                    <ChartV2 focusCoin={focusCoin} timeFrame={timeFrame} />



                    <Box sx={{
                        position: 'fixed',
                        bottom: 51,
                        left: 0,
                        right: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: theme === 'dark' ? '#1e1e1e' : 'white',
                        zIndex: 1000 // Ensure it stays above other content
                    }}>
                        <Box sx={{ background: theme === 'dark' ? '#1e1e1e' : 'white', display: 'flex', justifyContent: 'space-between', width: '90%', maxWidth: '100%', '@media (max-width: 600px)': { width: '100%' } }}>
                            <Button
                                onClick={() => handleTradeClick('long')}
                                variant="contained" color="success"
                                sx={{ borderRadius: '5px', marginRight: 1, width: '100%' }}>Long</Button>
                            <Button
                                onClick={() => handleTradeClick('short')}
                                variant="contained" color="error"
                                sx={{ borderRadius: '5px', width: '100%' }}>Short</Button>
                        </Box>
                    </Box>
                </>)}

            {value === 1 && (
                <Exchange setValue={setValue}/>
            )}

            <ConfirmModal
                focusCoin={focusCoin}
                tradeType={tradeType}
                open={open}
                handleClose={() => { setOpen(false) }}
                setOpen={setOpen}
            />

            <Dialog
                open={loginDialogOpen}
                onClose={handleLoginDialogClose}
                PaperProps={{
                    sx: {
                        borderRadius: '15px',
                        padding: '10px'
                    }
                }}
            >
                <DialogTitle sx={{ textAlign: 'center', color: 'primary.main' }}>
                    Sign In Required
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                        <LoginIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                        <Typography variant="body1" sx={{ textAlign: 'center', mb: 2 }}>
                            Please sign in to start trading
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                    <Button onClick={handleLoginDialogClose} variant="outlined" sx={{ borderRadius: '20px', mr: 1 }}>
                        Cancel
                    </Button>
                    <Button onClick={navigateToLogin} variant="contained" sx={{ borderRadius: '20px' }}>
                        Sign In
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    )
}