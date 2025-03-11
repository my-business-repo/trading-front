import { Box, Card, CardContent, Typography, Avatar } from "@mui/material";

export default function CoinCard({ coin }) {
    return (
        <Card sx={{ 
            background: 'white', 
            margin: 1,
            borderRadius: '10px',
            transition: 'transform 0.2s',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }
        }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar
                        src={coin.imageUrl}
                        sx={{
                            width: 30,
                            height: 30,
                            marginRight: 1,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    />
                    <Box>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: '#7c4dff', display: 'inline' }}>
                            {coin.name}
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ 
                                fontSize: 12,
                                color: 'text.secondary',
                                display: 'inline',
                                marginLeft: 0.5
                            }}
                        >
                            /{coin.currency}
                        </Typography>
                    </Box>
                </Box>

                <Typography 
                    variant="h6" 
                    sx={{ 
                        fontWeight: 'bold',
                        color: parseFloat(coin.change) < 0 ? '#ff1744' : '#00c853'
                    }}
                >
                    ${coin.price}
                </Typography>

                <Typography 
                    sx={{ 
                        fontSize: 14,
                        color: parseFloat(coin.change) < 0 ? '#ff1744' : '#00c853',
                        fontWeight: 'bold'
                    }}
                >
                    {parseFloat(coin.change) > 0 ? '+' : ''}{coin.change}%
                </Typography>
            </CardContent>
        </Card>
    );
}