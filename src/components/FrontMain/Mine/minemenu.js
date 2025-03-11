import CreditScoreIcon from '@mui/icons-material/CreditScore';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import btc from '../../../images/coin-icons/bitcoin-cryptocurrency.svg';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import QuizIcon from '@mui/icons-material/Quiz';
import { Avatar } from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { CurrencyExchange } from '@mui/icons-material';

export const minemenu = [
    {
        id: 1,
        name: 'Primary Certification',
        status: 'Not Verified',
        icon: <CreditScoreIcon style={{ color: '#009688', fontSize: 45 }} />,
        color: '#009688'
    },
    {
        id: 2,
        name: 'Advanced authentication',
        status: 'Not Verified',
        icon: <HowToRegIcon style={{ color: '#4a148c', fontSize: 45 }} />,
    },
    {
        id: 9,
        name: 'Online Customer Service',
        status: null,
        icon: <SupportAgentIcon style={{ color: '#37474f', fontSize: 45 }} />,
    },
    {
        id: 3,
        name: 'Order Records',
        status: null,
        icon: <AssignmentIcon style={{ color: '#01579b', fontSize: 45 }} />,
    },
    // {
    //     id: 4,
    //     name: 'Trading Records',
    //     status: null,
    //     icon: <AssignmentIcon style={{ color: '#616161', fontSize: 45 }} />,
    // },
    // {
    //     id: 4,
    //     name: 'Trading Records',
    //     status: null,
    //     icon: <AssignmentIcon style={{ color: '#616161', fontSize: 45 }} />,
    // },
    {
        id: 5,
        name: 'Exchange Records',
        status: null,
        icon: <CurrencyExchange style={{ color: '#616161', fontSize: 45 }} />,
    },
    {
        id: 8,
        name: 'I want to share',
        status: null,
        icon: <ScreenShareIcon style={{ color: '#e65100', fontSize: 45 }} />,
    },
    {
        id: 10,
        name: 'Help Center',
        status: null,
        icon: <QuizIcon style={{ color: '#00b0ff', fontSize: 45 }} />,
    },
    {
        id: 11,
        name: 'Suggestions',
        status: null,
        icon: <FeedbackIcon style={{ color: '#00b0ff', fontSize: 45 }} />,
    },
    {
        id: 7,
        name: 'Payment Method Management',
        status: null,
        icon: <AccountBalanceWalletIcon style={{ color: '#0091ea', fontSize: 45 }} />,
    },
]