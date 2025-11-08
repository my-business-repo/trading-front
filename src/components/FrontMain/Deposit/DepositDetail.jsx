import { useState } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    IconButton,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    Chip,
    CircularProgress // Import CircularProgress for loading indicator
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';
import { toast, ToastContainer } from 'react-toastify';
import { QRCodeCanvas } from "qrcode.react";
import axios from 'axios';
import { useAppContext } from '../../../context/AppContext';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

const VisuallyHiddenInput = styled('input')`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
`;

const dummyAddresses = {
    btc: 'bc1q6lrj9cg96knyfm4s3jlfhffysru4s5udd5r8yy',          // 'bc1qxtrlrddw8pjr35vmxsp8w0qr9q3gqf5pletmt2',
    eth: '0x204284B6BAd90DA8f92A0821b3e4A5A4d087802E',  //'0x1A1260Dc8F60d6b43FbC980904b925593012cE59',
    usdt: '0x204284B6BAd90DA8f92A0821b3e4A5A4d087802E', // '0x1A1260Dc8F60d6b43FbC980904b925593012cE59',
    usdc: '0x204284B6BAd90DA8f92A0821b3e4A5A4d087802E', //'0x1A1260Dc8F60d6b43FbC980904b925593012cE59',
    ada: '0x7c42f2bca4dff459a3c98a36a004147117fb2d09',
    sol: '9unFZygjQnM9Enwtq9efHyeFRYDg55VpZyLnsc8bHDR5',
    xrp: '0xd647b5e728f8a09f3b9b5e8a950adc304060eaa8',
    doge: 'DHerMJKwomHPnG1HEKv4Kh15unN8N2N318'
};

export default function DepositDetail() {
    const { coin } = useParams();
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [transaction, setTransaction] = useState(null);
    const { theme } = useAppContext();

    const address = dummyAddresses[coin];
    const navigate = useNavigate();

    const handleCopy = () => {
        navigator.clipboard.writeText(address);
        toast.success('Address copied!');
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                setFile(file);
                // Create preview URL for the image
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
                toast.success('Screenshot uploaded!');
            } else {
                toast.error('Please upload an image file');
            }
        }
    };

    const handleSubmit = async () => {
        try {
            // check if not logged in
            if (!localStorage.getItem('token')) {
                toast.error('Please login to deposit 🔒');
                navigate('/signin');
                return;
            }
            setLoading(true);
            const formData = new FormData();
            formData.append('amount', amount);
            formData.append('description', description);
            formData.append('file', file);
            formData.append('currency', coin);

            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const response = await axios.post(`${API_URL}/api/v2/transactions/deposit-request`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(formData);

            setTransaction(response.data.transaction);
            setOpenDialog(true);
            setAmount('');
            setDescription('');
            setFile(null);
            setPreviewUrl(null);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Oops! Deposit failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: { xs: 1, sm: 2 }, mb: { xs: 2, sm: 4 } }}>
            <ToastContainer />
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, backgroundColor: theme === 'dark' ? '#2a2a2a' : '#ffffff' }}>
                <IconButton
                    onClick={() => navigate('/deposit')} // Navigate back to deposit page
                    sx={{ mb: 2, color: theme === 'dark' ? '#ffffff' : '#000000' }}
                >
                    <KeyboardArrowLeftIcon />
                </IconButton>
                <Typography variant="h6" gutterBottom align="center" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' }, color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                    Deposit {coin?.toUpperCase()}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, mt: 6 }}>
                    <QRCodeCanvas value={address} size={140} level="H" />
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    mb: 6,
                    p: 1.5,
                }}>
                    <Typography variant="body2" sx={{ flexGrow: 1, wordBreak: 'break-all', fontSize: '1rem', color: theme === 'dark' ? '#ffffff' : '#000000', textAlign: 'center' }}>
                        {address}
                    </Typography>
                    <Button variant="outlined" onClick={handleCopy} size="small" color="primary" sx={{ p: 0.5, px: 2 }} startIcon={<ContentCopyIcon fontSize="small" />}>
                        COPY
                    </Button>
                </Box>

                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <TextField
                        label="Amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        size="small"
                        required
                        sx={{
                            borderRadius: 2,
                            border: '1px solid #bdbdbd',
                            '& .MuiInputLabel-root': {
                                color: theme === 'dark' ? '#ffffff' : '#000000'
                            },
                            '& .MuiInputBase-input': {
                                color: theme === 'dark' ? '#ffffff' : '#000000' // Added input color
                            }
                        }}
                    />

                    {/* <TextField
                        label="Description"
                        multiline
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        size="small"
                        sx={{ '& .MuiInputBase-input': { fontSize: '0.9rem', backgroundColor: theme === 'dark' ? 'white' : '#ffffff', color: theme === 'dark' ? '#ffffff' : '#000000' } }}
                    /> */}

                    <Box sx={{
                        border: '1px dashed #bdbdbd',
                        borderRadius: 2,
                        p: 1.5,
                        textAlign: 'center',
                        backgroundColor: theme === 'dark' ? '#2c2c2c' : '#fafafa'
                    }}>
                        <Button
                            component="label"
                            startIcon={<PhotoCamera />}
                            size="small"
                            sx={{ mb: 0.5, color: theme === 'dark' ? '#ffffff' : '#000000' }}
                        >
                            Upload Screenshot
                            <VisuallyHiddenInput
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Button>
                        <Typography variant="caption" display="block" color="text.secondary" sx={{ fontSize: '0.7rem', color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                            {file ? `📎 ${file.name}` : 'No file selected'}
                        </Typography>
                        {previewUrl && (
                            <Box sx={{ mt: 2, maxWidth: '100%', overflow: 'hidden' }}>
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    style={{
                                        width: '100%',
                                        maxHeight: '200px',
                                        objectFit: 'contain',
                                        borderRadius: '4px'
                                    }}
                                />
                            </Box>
                        )}
                    </Box>

                    <Alert severity="warning" sx={{
                        mt: 1,
                        '& .MuiAlert-message': {
                            fontSize: '0.8rem',
                            color: theme === 'dark' ? '#ffffff' : '#000000'
                        },
                        backgroundColor: theme === 'dark' ? '#333333' : '#f8f9fa'
                    }}>
                        Please ensure you're sending {coin?.toUpperCase()} on the correct network
                    </Alert>

                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            mt: 1,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '0.9rem',
                            backgroundColor: theme === 'dark' ? '#bb86fc' : '#6200ea',
                            color: '#ffffff',
                            '&:disabled': {
                                color: theme === 'dark' ? '#ffffff' : '#000000'
                            }
                        }}
                        disabled={!amount || !file || loading}
                        onClick={handleSubmit}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Deposit'}
                    </Button>
                </Box>
            </Paper>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{ sx: { borderRadius: 2, backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff' } }}
            >
                <DialogTitle sx={{ textAlign: 'center', pb: 1, fontSize: '1.1rem', color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                    Deposit Submitted Successfully!
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, py: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Chip
                                label={transaction?.status}
                                color="warning"
                                variant="outlined"
                                size="small"
                                sx={{ fontSize: '0.8rem' }}
                            />
                        </Box>

                        <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: 500, color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                            ID: {transaction?.transactionId}
                        </Typography>

                        <Box sx={{
                            backgroundColor: theme === 'dark' ? '#2c2c2c' : '#f8f9fa',
                            p: 1.5,
                            borderRadius: 2,
                            fontSize: '0.8rem'
                        }}>
                            <Typography variant="body2" sx={{ mb: 0.5, color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                                {transaction?.amount} {coin?.toUpperCase()}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 0.5, color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                                {transaction?.description}
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                                {new Date(transaction?.createdAt).toLocaleString()}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Button
                                variant="outlined"
                                onClick={() => setOpenDialog(false)}
                                size="small"
                                sx={{ borderRadius: 2, textTransform: 'none', color: theme === 'dark' ? '#ffffff' : '#000000' }}
                            >
                                Close
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/transactions')}
                                size="small"
                                sx={{ borderRadius: 2, textTransform: 'none', backgroundColor: theme === 'dark' ? '#bb86fc' : '#6200ea', color: theme === 'dark' ? 'white' : '#000000' }}
                            >
                                View Transactions
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </Container>
    );
}