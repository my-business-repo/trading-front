import { Avatar, Box, Button, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from 'react-router-dom';

export default function MarketCard({ theme, data }) {
    const themeUi = useTheme();
    const isMobile = useMediaQuery(themeUi.breakpoints.down('sm'));
    const navigate = useNavigate();
    const isDarkTheme = theme === 'dark';

    return (
        <Box 
            onClick={() => navigate(`/market/${data.name.toLowerCase()}`)}
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: { xs: 1, sm: 2 },
                background: isDarkTheme ? '#1e1e1e' : 'white',
                borderRadius: '10px',
                marginBottom: 1.5,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: isDarkTheme ? '0 4px 8px rgba(255, 255, 255, 0.2)' : '0 4px 8px rgba(0,0,0,0.1)',
                    background: isDarkTheme ? 'linear-gradient(to right, #2a2a2a, #1e1e1e)' : 'linear-gradient(to right, #ffffff, #f8f9fa)'
                }
            }}
        >
            <Box sx={{ minWidth: '20%', maxWidth: '40%', display: 'flex', alignItems: 'center' }}>
                <Avatar 
                    src={data.imageUrl} 
                    sx={{ 
                        width: { xs: 25, sm: 35 }, 
                        height: { xs: 25, sm: 35 },
                        marginRight: 1,
                        boxShadow: isDarkTheme ? '0 2px 4px rgba(255, 255, 255, 0.2)' : '0 2px 4px rgba(0,0,0,0.1)'
                    }} 
                />
                <Box>
                    <Typography 
                        variant={isMobile ? "body2" : "body1"} 
                        component="div" 
                        fontWeight="bold"
                        sx={{ display: 'inline', color: isDarkTheme ? '#ffffff' : 'inherit' }}
                    >
                        {data.name}
                    </Typography>
                    <Typography 
                        sx={{ 
                            fontSize: { xs: 10, sm: 12 },
                            color: isDarkTheme ? '#bbbbbb' : 'text.secondary',
                            display: 'inline',
                            marginLeft: 0.5
                        }}
                    >
                        /{data.currency}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ 
                display: 'flex', 
                minWidth: '20%', 
                maxWidth: '30%', 
                alignItems: 'center',
                color: parseFloat(data.change) < 0 ? '#ff1744' : '#00c853',
                fontWeight: 'bold'
            }}>
                <Typography sx={{ fontSize: { xs: 13, sm: 15 }, color: isDarkTheme ? '#ffffff' : 'inherit' }}>
                    ${data.price}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', minWidth: '20%', maxWidth: '30%', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Button 
                    variant="contained" 
                    color={parseFloat(data.change) < 0 ? 'error' : 'success'}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                        borderRadius: '20px',
                        fontSize: { xs: 11, sm: 13 },
                        fontWeight: 'bold',
                        minWidth: { xs: '60px', sm: '80px' },
                        boxShadow: isDarkTheme ? '0 2px 4px rgba(255, 255, 255, 0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
                        '&:hover': {
                            transform: 'scale(1.05)',
                            backgroundColor: isDarkTheme ? '#333333' : 'inherit'
                        }
                    }}
                >
                    {parseFloat(data.change) < 0 ? '' : '+'}{data.change}%
                </Button>
            </Box>
        </Box>
    );
}