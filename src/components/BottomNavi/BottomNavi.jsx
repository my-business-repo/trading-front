import React, { useEffect, useState } from 'react'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import HomeIcon from '@mui/icons-material/Home'
import StorefrontIcon from '@mui/icons-material/Storefront'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import PersonIcon from '@mui/icons-material/Person'
import { Box } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const BottomNavi = () => {
    const [value, setValue] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = useAppContext();

    useEffect(() => {
        switch (location.pathname) {
            case '/': setValue(0); break;
            case '/market': setValue(1); break;
            case '/trade': setValue(2); break;
            case '/asset': setValue(3); break;
            case '/mine': setValue(4); break;
            default: break;
        }
    }, [location.pathname]);

    return (
        <Box sx={{ alignSelf: 'flex-end', width: '100%', borderTop: theme === 'dark' ? '1px solid #424242' : '1px solid #b3e5fc' }}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue)
                    switch (newValue) {
                        case 0: navigate('/'); break;
                        case 1: navigate('/market'); break;
                        case 2: navigate('/trade/0'); break;
                        case 3: navigate('/asset'); break;
                        case 4: navigate('/mine'); break;
                        default: break;
                    }
                }}
                sx={{ backgroundColor: theme === 'dark' ? '#303030' : '#ffffff', color: theme === 'dark' ? '#ffffff' : '#000000' }}
            >
                <BottomNavigationAction sx={{color:theme==='dark'?'#ffffff':'#000000'}} label="Home" icon={<HomeIcon sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }} />} />
                <BottomNavigationAction sx={{color:theme==='dark'?'#ffffff':'#000000'}} label="Market" icon={<StorefrontIcon sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }} />} />
                <BottomNavigationAction sx={{color:theme==='dark'?'#ffffff':'#000000'}} label="Trade" icon={<SwapVertIcon sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }} />} />
                <BottomNavigationAction sx={{color:theme==='dark'?'#ffffff':'#000000'}} label="Wallet" icon={<AccountBalanceWalletIcon sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }} />} />
                <BottomNavigationAction sx={{color:theme==='dark'?'#ffffff':'#000000'}} label="Mine" icon={<PersonIcon sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }} />} />
            </BottomNavigation>
        </Box>
    )
}

export default BottomNavi
