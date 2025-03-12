import { Box, Container } from "@mui/material"
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from "../FrontMain/Home/Home"
import Market from "../FrontMain/Market/Market"
import Trade from "../FrontMain/Trade/Trade"
import Asset from "../FrontMain/Asset/Asset"
import Mine from "../FrontMain/Mine/Mine"
import TradeTest from "../FrontMain/Trade/TradeTest";
import TopBar from '../TopBar/TopBar';
import SignUp from "../Auth/SignUp";
import SignIn from "../Auth/SignIn";
import Profile from "../Profile/Profile";
import Deposit from "../FrontMain/Deposit/Deposit";
import DepositDetail from "../FrontMain/Deposit/DepositDetail";
import TransactionList from "../Transaction/TransactionList";
import MarketDetail from "../FrontMain/Market/MarketDetail";
import HelpCenter from "../FrontMain/Help/HelpCenter";
import TradeHistory from "../Trade/TradeHistory";
import Withdraw from "../FrontMain/Withdraw/Withdraw";
import WithdrawDetail from "../FrontMain/Withdraw/WithdrawDetail";
import ExchangeHistory from "../Exchange/ExchangeHistory";
import ChangePassword from "../Auth/ChangePassword";
import { useAppContext } from '../../context/AppContext';
import Orders from "../FrontMain/Orders/Orders";
import { useEffect } from 'react';
import axios from 'axios';

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const { token, setToken } = useAppContext();

    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/customer/validate`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.data.error === "Invalid or expired token") {
                    localStorage.removeItem('token');
                    setToken(null);
                }
            } catch (error) {
                console.error('Token validation error:', error);
                localStorage.removeItem('token');
                setToken(null);
            }
        };

        if (token) {
            console.log("token", token);
            validateToken();
        }
    }, [token, setToken]);

    if (!token) {
        return <Navigate to="/signin" />;
    }
    return children;
};

export default function Main() {
    const location = useLocation();
    const isAuthPage = ['/signup', '/signin', '/trade/0'].includes(location.pathname);
    const { theme } = useAppContext();

    return (
        <Box sx={{ height: '100%', width: '100%', overflow: 'auto', marginTop: isAuthPage ? 0 : 5, background: theme === 'dark' ? '#121212' : '' }}>
            <Box sx={{ width: '99%', minHeight: '100%', background: theme === 'dark' ? '#1e1e1e' : '#eeeeee', padding: 0, border: '1px solid transparent' }}>
                {!isAuthPage && <TopBar />}
                <Box sx={{ flexGrow: 1, background: theme === 'dark' ? '#1e1e1e' : '#eeeeee', paddingBottom: 1, margin: '0 auto' }}>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/market' element={<ProtectedRoute><Market /></ProtectedRoute>} />
                        <Route path='/trade/:tabValue' element={<ProtectedRoute><Trade /></ProtectedRoute>} />
                        <Route path='/asset' element={<ProtectedRoute><Asset /></ProtectedRoute>} />
                        <Route path='/mine' element={<ProtectedRoute><Mine /></ProtectedRoute>} />
                        <Route path='/trade-test' element={<ProtectedRoute><TradeTest /></ProtectedRoute>} />
                        <Route path='/signup' element={<SignUp />} />
                        <Route path='/signin' element={<SignIn />} />
                        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route path='/deposit' element={<ProtectedRoute><Deposit /></ProtectedRoute>} />
                        <Route path='/deposit/:coin' element={<ProtectedRoute><DepositDetail /></ProtectedRoute>} />
                        <Route path='/transactions' element={<ProtectedRoute><TransactionList /></ProtectedRoute>} />
                        <Route path='/market/:coin' element={<ProtectedRoute><MarketDetail /></ProtectedRoute>} />
                        <Route path='/help' element={<ProtectedRoute><HelpCenter /></ProtectedRoute>} />
                        <Route path='/trade-history' element={<ProtectedRoute><TradeHistory /></ProtectedRoute>} />
                        <Route path='/withdraw' element={<ProtectedRoute><WithdrawDetail /></ProtectedRoute>} />
                        <Route path='/exchange-history' element={<ProtectedRoute><ExchangeHistory /></ProtectedRoute>} />
                        <Route path='/change-password' element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
                        <Route path='/orders' element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                    </Routes>
                </Box>
            </Box>
        </Box>
    )
};