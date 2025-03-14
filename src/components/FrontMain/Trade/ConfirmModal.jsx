import { Box, Button, Card, Modal, TextField, Typography, Dialog, CircularProgress, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useInterval } from "react-use";
import { useAppContext } from "../../../context/AppContext";
import { toast, ToastContainer } from "react-toastify";
import CloseIcon from '@mui/icons-material/Close';

const style = {

    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '10px',
    pt: 2,
    px: 4,
    pb: 3,
};

const ration = {
    30: 40,
    60: 50,
    120: 70,
    300: 100
}

const DisplayCard = ({ s, p, selected, onClick }) => {
    return (
        <Card
            onClick={onClick}
            sx={{
                height: 60,
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                flexGrow: 1,
                cursor: 'pointer',
                border: selected ? '2px solid #1e88e5' : 'none'
            }}
            fullWidth
        >
            <Box sx={{
                flexGrow: 1,
                width: '100%',
                background: selected ? '#1565c0' : '#1e88e5',
                height: 30,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }} >
                <Typography color='white' textAlign='center' variant="h6">{s}s</Typography>
            </Box>
            <Box sx={{
                flexGrow: 1,
                width: '100%',
                height: 30,
                background: selected ? '#64b5f6' : '#90caf9',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }} >
                <Typography textAlign='center' sx={{ flexGrow: 1 }} variant="body2">{p}.0%</Typography>
            </Box>
        </Card>
    )
}

export default function ConfirmModal({ focusCoin, tradeType, open, handleClose, setOpen }) {
    const [currentPrice, setCurrentPrice] = useState(null);
    const [priceChange, setPriceChange] = useState(0);
    const [balance, setBalance] = useState("0");
    const [selectedTime, setSelectedTime] = useState(null);
    const [amount, setAmount] = useState();
    const [showProgress, setShowProgress] = useState(false);
    const [progress, setProgress] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [expectedOutcome, setExpectedOutcome] = useState(null);
    const { customer } = useAppContext();
    const [tradeRequest, setTradeRequest] = useState(null);
    const [sequence, setSequence] = useState([]);
    const [i, setI] = useState(0);
    const [tradeFinished, setTradeFinished] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [tradeResult, setTradeResult] = useState(null);
    const [loading, setLoading] = useState(false); // New loading state

    const handleModalClose = () => {
        handleClose();
        setAmount(null);
    };

    const fetchBalance = async () => {
        try {
            const baseUrl = process.env.REACT_APP_API_URL;
            const response = await axios.get(`${baseUrl}/api/v1/customer/coin/balance?currency=USDT`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            setBalance(parseFloat(response.data.balance).toFixed(4));
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    const fetchPrice = async () => {
        try {
            const response = await axios.get('https://min-api.cryptocompare.com/data/pricemultifull', {
                params: {
                    fsyms: focusCoin,
                    tsyms: 'USDT'
                }
            });
            const data = response.data.RAW[focusCoin].USDT;
            const price = data.PRICE;
            const change = data.CHANGEPCTHOUR;

            setCurrentPrice(price);
            setPriceChange(change);
        } catch (error) {
            console.error('Error fetching price:', error);
        }
    };

    useEffect(() => {
        if (open) {
            fetchPrice();
            fetchBalance();
            setShowProgress(false);
            setProgress(0);
            setTimeLeft(0);
        }
    }, [open, focusCoin]);

    useInterval(() => {
        if (open) { // open is trade model
            fetchPrice();
        }

        if (open && showProgress) {
            if (timeLeft > 0) {
                setTimeLeft(prev => prev - 1);
                setProgress((selectedTime - timeLeft) / selectedTime * 100);
                // const outcome = Math.random() > 0.5 ? 'win' : 'lose';
                const outcome = sequence[i] == 1 ? 'win' : 'lose';
                setExpectedOutcome({
                    type: outcome,
                    value: outcome === 'win' ? parseFloat((amount * (ration[selectedTime] / 100)).toFixed(3)) : -amount
                });
                console.log('value i:', sequence[i]);
                setI(i + 1);
            } else {
                setOpen(false);
                setTradeRequest(null);
                setShowProgress(false);
                console.log('tradeRequest:', tradeRequest);
                const API_URL = process.env.REACT_APP_API_URL;
                axios.post(`${API_URL}/api/v1/trade-success`, {
                    tradeId: tradeRequest.id,
                    customerId: customer.id,
                    outcome: expectedOutcome.type
                }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        if (response.status === 200 || response.status === 201) {

                            console.log('response:', response.data);
                            const expectedOutcome = {
                                type: response.data.result,
                                value: response.data.profit
                            }

                            setTradeResult(expectedOutcome);
                            setShowResult(true);
                        } else {
                            toast.error("Failed to record trade result");
                            handleModalClose();
                        }
                        setI(0);
                    })
                    .catch(err => {
                        toast.error("Failed to record trade result");
                        handleModalClose();
                        setI(0);
                    });
            }
        }
    }, 1000);

    const handleConfirmOrder = async () => {
        const API_URL = process.env.REACT_APP_API_URL;

        // Set loading state before making the request
        setLoading(true); // Set loading to true

        try {
            const response = await axios.post(`${API_URL}/api/v1/trade-request`, {
                currency: "USDT",
                customerId: customer.id,
                tradeType: tradeType.toUpperCase(),
                period: selectedTime,
                tradeQuantity: parseInt(amount)
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200 || response.status === 201) {
                console.log(response.data);
                setSequence(response.data.sequence);
                setTradeRequest(response.data.trade);
                setShowProgress(true);
                setTimeLeft(selectedTime);
                setProgress(0);
            } else {
                toast.error("Trade request failed, please try again later");
            }
        } catch (res) {
            toast.error("Trade request failed  : " + res.response.data.error)
        } finally {
            setLoading(false); // Reset loading state after request
        }
    };

    return (
        <>
            <ToastContainer />
            <Modal
                open={open && !showProgress}
                onClose={handleModalClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{
                    ...style,
                    width: { xs: '75%', sm: '50%', md: '30%', lg: '20%', xl: '15%' },
                    maxHeight: 500,
                    backgroundColor: '#09122C',
                    color: 'white'
                }}>
                    <h2 id="parent-modal-title">Order Confirmation</h2>
                    <Box mb={1}>
                        <Box display='flex' justifyContent='space-between'>
                            <Typography>Name </Typography>
                            <Typography>{focusCoin}/USDT</Typography>
                        </Box>
                        <Box display='flex' justifyContent='space-between'>
                            <Typography>Direction </Typography>
                            <Typography color={tradeType === 'long' ? 'success.main' : 'error.main'} sx={{ fontWeight: 'bold' }}>{tradeType.toUpperCase()}</Typography>
                        </Box>
                        <Box display='flex' justifyContent='space-between'>
                            <Typography>Current price</Typography>
                            <Typography color={priceChange >= 0 ? 'success.main' : 'error.main'}>
                                {currentPrice ? currentPrice.toFixed(2) : '...'} ({priceChange ? priceChange.toFixed(2) : '0'}%)
                            </Typography>
                        </Box>
                    </Box>

                    <Typography variant="body2" gutterBottom sx={{ color: 'white' }}>
                        Choose the expiry time (left-sliding yields higher)
                    </Typography>

                    <Box display='flex' gap={1} mb={2}>
                        <DisplayCard s={30} p={40} selected={selectedTime === 30} onClick={() => setSelectedTime(30)} />
                        <DisplayCard s={60} p={50} selected={selectedTime === 60} onClick={() => setSelectedTime(60)} />
                        <DisplayCard s={120} p={70} selected={selectedTime === 120} onClick={() => setSelectedTime(120)} />
                        <DisplayCard s={300} p={100} selected={selectedTime === 300} onClick={() => setSelectedTime(300)} />
                    </Box>

                    <Box mb={1}>
                        <TextField
                            label="Quantity to buy"
                            variant="outlined"
                            fullWidth
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            type="number"
                            inputProps={{ min: "0", step: "any" }}
                            size="small"
                            sx={{ border: '1px solid lightgray', borderRadius: 1 }}
                            InputLabelProps={{
                                style: { color: 'white' }
                            }}
                            InputProps={{
                                style: { color: 'white' }
                            }}
                        />
                    </Box>
                    <Box display='flex' justifyContent='space-between' mb={1}>
                        <Typography variant="body2" gutterBottom>
                            Available balance: <Typography component="span" color="primary.main" display="inline">{balance}</Typography> USDT
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        size="small"
                        sx={{
                            height: 50, borderRadius: 10, backgroundColor: 'blue',
                            "&.Mui-disabled": {
                                color: 'white',
                                background: '#3D3BF3'
                            }
                        }} // Set primary color text to white
                        fullWidth
                        onClick={handleConfirmOrder}
                        disabled={!selectedTime || !amount}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Order Confirmation'} {/* Show loading spinner */}
                    </Button>
                </Box>
            </Modal>

            {/** Progress Dialog */}
            <Dialog
                open={showProgress}
                onClose={() => {
                    setShowProgress(false);
                    setAmount(0);
                }}
                PaperProps={{
                    sx: { borderRadius: '10px', minWidth: 400, width: '98%' }
                }}
            >
                <Box sx={{ p: 3, background: 'linear-gradient(to right,rgb(44, 0, 92),rgb(82, 0, 170))' }}>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                        <Typography variant="h6" color="white">{focusCoin}</Typography>

                        <Box position="relative" display="inline-flex">
                            <Box position="relative" display="inline-flex">
                                <CircularProgress
                                    variant="determinate"
                                    value={100} // Always full
                                    size={120}
                                    thickness={2}
                                    sx={{
                                        color: "#3D3BF3", // Custom trace (incomplete) color
                                    }}
                                />
                                <CircularProgress
                                    variant="determinate"
                                    value={progress}
                                    size={120}
                                    thickness={2}
                                    color="primary"
                                    sx={{
                                        position: "absolute",
                                        left: 0,
                                        color: '#e0e0e0',
                                    }}
                                />
                            </Box>
                            <Box
                                sx={{
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    position: 'absolute',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                }}
                            >
                                <Typography variant="caption" component="div" color="white">
                                    {timeLeft}s
                                </Typography>
                            </Box>
                        </Box>

                        <Box width="100%" sx={{
                            p: 2,
                            borderRadius: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.1,
                            color: 'white'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderRadius: 1
                            }}>
                                <Typography sx={{
                                    color: priceChange >= 0 ? 'violet' : 'violet'
                                }}>
                                    Current Price
                                </Typography>
                                <Typography sx={{
                                    color: priceChange >= 0 ? 'violet' : 'violet',
                                    fontWeight: 'bold'
                                }}>
                                    <span style={{ color: priceChange >= 0 ? 'violet' : 'violet' }}>{currentPrice?.toFixed(2)}</span>
                                </Typography>
                            </Box>

                            <Box display='flex' justifyContent='space-between'>
                                <Typography sx={{
                                    textAlign: 'left',
                                    borderRadius: 1
                                }}>
                                    Direction
                                </Typography>
                                <Typography sx={{
                                    textAlign: 'left',
                                    color: tradeType === 'long' ? '#2e7d32' : '#d32f2f',
                                    borderRadius: 1
                                }}>
                                    {tradeType}
                                </Typography>
                            </Box>

                            <Box display='flex' justifyContent='space-between'>
                                <Typography sx={{
                                    textAlign: 'left',
                                    borderRadius: 1
                                }}>
                                    Name
                                </Typography>
                                <Typography sx={{
                                    textAlign: 'left',
                                    borderRadius: 1
                                }}>
                                    {focusCoin}
                                </Typography>
                            </Box>
                            <Box display='flex' justifyContent='space-between'>
                                <Typography sx={{
                                    textAlign: 'left',
                                    borderRadius: 1,
                                }}>
                                    Amount
                                </Typography>
                                <Typography sx={{
                                    textAlign: 'left',
                                    borderRadius: 1,
                                }}>
                                    {amount} USDT
                                </Typography>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderRadius: 1
                            }}>
                                <Typography sx={{
                                }}>
                                    Price
                                </Typography>
                                <Typography sx={{
                                }}>
                                    <span style={{ color: priceChange >= 0 ? 'violet' : 'violet' }}>{currentPrice?.toFixed(2)}</span>
                                </Typography>
                            </Box>

                            <Box display='flex' justifyContent='space-between'>
                                {expectedOutcome ?
                                    <>
                                        <Typography sx={{
                                            color: expectedOutcome ? expectedOutcome.type === 'win' ? '#2e7d32' : '#d32f2f' : 'gray',
                                        }}></Typography>
                                        Expected {expectedOutcome.type}
                                        <Typography />
                                        <Typography sx={{
                                            color: expectedOutcome ? expectedOutcome.type === 'win' ? '#2e7d32' : '#d32f2f' : 'gray',
                                        }}></Typography>
                                        {expectedOutcome.value} USDT
                                        <Typography />
                                    </>
                                    :
                                    'Waiting for the result...'
                                }

                            </Box>


                        </Box>
                    </Box>
                </Box>
            </Dialog>

            {/** Result Dialog showResult */}
            <Dialog
                open={showResult}
                onClose={() => {
                    setShowResult(false);
                    handleModalClose();
                }}
                PaperProps={{
                    sx: { borderRadius: '10px', minWidth: 400, width: '98%', overflow: 'hidden' }
                }}
            >
                <IconButton
                    aria-label="close"
                    onClick={() => {
                        setShowResult(false);
                        handleModalClose();
                    }}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <Box display="flex" flexDirection="column" alignItems="center"
                    sx={{ background: 'linear-gradient(to right,rgb(44, 0, 92),rgb(82, 0, 170))' }}
                >
                    <Box display='flex' flexDirection='column' p={2}>
                        <Typography variant="h6" color='white' textAlign='center'>
                            {focusCoin}
                        </Typography>
                    </Box>
                    <Box display='flex' flexDirection='column' alignItems="center">
                        <Box sx={{ display: 'flex', direction: 'column', alignItems: 'center', mt: 3 }}>
                            <Typography variant="h6" color={tradeResult?.type === 'win' ? 'success.main' : 'error.main'}>
                                {tradeResult?.type === 'win' ? '+' : ''}
                            </Typography>

                            <Typography variant="h6" color={tradeResult?.type === 'win' ? 'success.main' : 'error.main'}>
                                {tradeResult?.value} USDT
                            </Typography>
                        </Box>
                        <Typography variant="body2" color='gray' mb={3}>
                            Completion of maturity settlement
                        </Typography>
                    </Box>

                    <Box display='flex' flexDirection='column' width='100%'>
                        <Box p={2}>
                            <Box sx={{
                                display: 'flex',
                                width: '100%',
                                justifyContent: 'space-between',
                                borderRadius: 1,
                                color: 'white'
                            }}>
                                <Typography sx={{
                                }}>
                                    Selection period
                                </Typography>
                                <Typography sx={{
                                }}>
                                    {selectedTime}s
                                </Typography>
                            </Box>


                            <Box sx={{
                                display: 'flex',
                                width: '100%',
                                justifyContent: 'space-between',
                                borderRadius: 1,
                                color: 'white'
                            }}>
                                <Typography sx={{
                                }}>
                                    Current price
                                </Typography>
                                <Typography sx={{
                                }}>
                                    {currentPrice?.toFixed(2)}
                                </Typography>
                            </Box>


                            <Box sx={{
                                display: 'flex',
                                width: '100%',
                                justifyContent: 'space-between',
                                borderRadius: 1,
                                color: 'white'
                            }}>
                                <Typography sx={{
                                }}>
                                    Direction
                                </Typography>
                                <Typography sx={{
                                }}>
                                    {tradeType}
                                </Typography>
                            </Box>


                            <Box sx={{
                                display: 'flex',
                                width: '100%',
                                justifyContent: 'space-between',
                                borderRadius: 1,
                                color: 'white'
                            }}>
                                <Typography sx={{
                                }}>
                                    Amount
                                </Typography>
                                <Typography sx={{
                                }}>
                                    {amount} USDT
                                </Typography>
                            </Box>


                            <Box sx={{
                                display: 'flex',
                                width: '100%',
                                justifyContent: 'space-between',
                                borderRadius: 1,
                                color: 'white'
                            }}>
                                <Typography sx={{
                                }}>
                                    Price
                                </Typography>
                                <Typography sx={{
                                }}>
                                    {currentPrice?.toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>


                </Box>
            </Dialog>
        </>
    );
}