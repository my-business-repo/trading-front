import { 
    Box, 
    Container, 
    Typography, 
    Accordion, 
    AccordionSummary, 
    AccordionDetails,
    Paper,
    Divider,
    IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpIcon from '@mui/icons-material/Help';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import back icon
import { useAppContext } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const helpTopics = [
    {
        title: "Getting Started",
        items: [
            {
                question: "How do I create an account?",
                answer: "To create an account, click on the 'Sign Up' button and fill in your email, name, phone number, and password. Follow the verification process to activate your account."
            },
            {
                question: "How do I verify my account?",
                answer: "Account verification requires completing Primary Certification and Advanced Authentication. Visit your profile page and follow the verification steps."
            }
        ]
    },
    {
        title: "Deposits & Withdrawals",
        items: [
            {
                question: "How do I deposit funds?",
                answer: "To deposit funds, go to the Assets page and click on 'Deposit'. Select your preferred cryptocurrency, scan the QR code or copy the address, and send your funds."
            },
            {
                question: "What are the withdrawal limits?",
                answer: "Withdrawal limits vary based on your verification level. Basic verified accounts can withdraw up to 2 BTC daily, while fully verified accounts have higher limits."
            }
        ]
    },
    {
        title: "Trading",
        items: [
            {
                question: "How do I start trading?",
                answer: "Visit the Market page to view available trading pairs. Click on any pair to view detailed charts and place buy/sell orders."
            },
            {
                question: "What trading fees do you charge?",
                answer: "Trading fees start at 0.1% per trade and can be reduced based on your trading volume and account level."
            }
        ]
    },
    {
        title: "Security",
        items: [
            {
                question: "How do I enable 2FA?",
                answer: "Go to your profile settings, select 'Security', and follow the steps to enable two-factor authentication using Google Authenticator or similar apps."
            },
            {
                question: "What should I do if I forget my password?",
                answer: "Click 'Forgot Password' on the login page and follow the reset instructions sent to your registered email address."
            }
        ]
    }
];

export default function HelpCenter() {
    const { theme } = useAppContext();
    const navigate = useNavigate(); // Initialize useNavigate

    return (
        <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
            <Paper elevation={2} sx={{ 
                p: 3, 
                borderRadius: 2,
                background: theme === 'dark' ? 'linear-gradient(145deg, #1e1e1e 0%, #2c2c2c 100%)' : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <IconButton onClick={() => navigate(-1)} color="primary" size="small"> {/* Back button to navigate */}
                        <ArrowBackIcon />
                    </IconButton>
                    <HelpIcon color="primary" />
                    <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: theme === 'dark' ? 'white' : 'black' }}>
                        Help Center
                    </Typography>
                </Box>

                <Typography variant="body2" color={theme === 'dark' ? 'grey.300' : 'text.secondary'} sx={{ mb: 3 }}>
                    Find answers to common questions and learn how to use our platform effectively.
                </Typography>

                {helpTopics.map((topic, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                mb: 2,
                                color: theme === 'dark' ? 'lightblue' : 'primary.main',
                                fontWeight: 500
                            }}
                        >
                            {topic.title}
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {topic.items.map((item, itemIndex) => (
                            <Accordion 
                                key={itemIndex}
                                elevation={0}
                                sx={{ 
                                    mb: 1,
                                    '&:before': { display: 'none' },
                                    background: theme === 'dark' ? '#2c2c2c' : 'transparent',
                                    border: '1px solid',
                                    borderColor: theme === 'dark' ? 'grey.700' : 'divider',
                                    borderRadius: '8px !important',
                                    '&:not(:last-child)': { mb: 1 },
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    sx={{ 
                                        borderRadius: '8px',
                                        '&:hover': { backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.02)' }
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 500, color: theme === 'dark' ? 'white' : 'black' }}>
                                        {item.question}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography color={theme === 'dark' ? 'grey.300' : 'text.secondary'}>
                                        {item.answer}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                ))}
            </Paper>
        </Container>
    );
} 