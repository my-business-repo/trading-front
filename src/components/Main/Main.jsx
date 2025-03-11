import { Box, Container } from "@mui/material"
import { Routes, Route, useLocation } from 'react-router-dom';
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
import { useAppContext } from '../../context/AppContext'; // Importing context to access theme
import Orders from "../FrontMain/Orders/Orders";

export default function Main() {
    const location = useLocation();
    const isAuthPage = ['/signup', '/signin', '/trade/0'].includes(location.pathname);
    const { theme } = useAppContext(); // Accessing theme from context

    return (
        <Box sx={{ height: '100%', width: '100%', overflow: 'auto', marginTop: isAuthPage ? 0 : 5, background: theme === 'dark' ? '#121212' : '' }}>
            <Box sx={{  width: '99%', minHeight: '100%', background: theme === 'dark' ? '#1e1e1e' : '#eeeeee', padding: 0 , border: '1px solid transparent'}}>
                {!isAuthPage && <TopBar />}
                <Box sx={{ flexGrow: 1, background: theme === 'dark' ? '#1e1e1e' : '#eeeeee', paddingBottom: 1, margin: '0 auto' }}>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/market' element={<Market />} />
                        <Route path='/trade/:tabValue' element={<Trade />} />
                        <Route path='/asset' element={<Asset />} />
                        <Route path='/mine' element={<Mine />} />
                        <Route path='/trade-test' element={<TradeTest />} />
                        <Route path='/signup' element={<SignUp />} />
                        <Route path='/signin' element={<SignIn />} />
                        <Route path='/profile' element={<Profile />} />
                        <Route path='/deposit' element={<Deposit />} />
                        <Route path='/deposit/:coin' element={<DepositDetail />} />
                        <Route path='/transactions' element={<TransactionList />} />
                        <Route path='/market/:coin' element={<MarketDetail />} />
                        <Route path='/help' element={<HelpCenter />} />
                        <Route path='/trade-history' element={<TradeHistory />} />
                        {/* <Route path='/withdraw' element={<Withdraw />} /> */}
                        <Route path='/withdraw' element={<WithdrawDetail />} />
                        <Route path='/exchange-history' element={<ExchangeHistory />} />
                        <Route path='/change-password' element={<ChangePassword />} />
                        <Route path='/orders' element={<Orders />} />
                    </Routes>
                </Box>
            </Box>
        </Box>
    )
};