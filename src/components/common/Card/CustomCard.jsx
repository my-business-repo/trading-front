import { Box, Button, Typography, Paper } from "@mui/material";

export default function CustomCard({ data }) {
    return (
        <Box 
            sx={{ 
                m: 1, 
                p: 2, 
                cursor: 'pointer', 
                transition: 'transform 0.2s, box-shadow 0.2s', 
                '&:hover': { 
                    borderRadius: '10px',
                    transform: 'scale(1.02)', 
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' 
                } 
            }} 
            onClick={() => window.location.href = `/market/${data.name.toLowerCase()}`}
        >
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: '20%' }}>
                    <Box sx={{ width: 40, height: 40 }}>
                        <img 
                            src={data.imageUrl} 
                            alt={data.name}
                            style={{ 
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain'
                            }}
                        />
                    </Box>
                    <Box>
                        <Typography variant="text.secondary" component="div" fontWeight={'bold'} sx={{ color: 'blueviolet' }}>
                            {data.name || ''}/
                            <Typography 
                                component="span" 
                                sx={{ fontSize: 14 }} 
                                color="text.secondary"
                            >
                                {data.currency}
                            </Typography>
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ 
                    display: 'flex', 
                    minWidth: '20%',
                    justifyContent: 'center'
                }}>
                    <Typography 
                        sx={{ fontSize: 16 }} 
                        fontWeight={'bold'}
                        color={Math.sign(data.change) === -1 ? 'error.main' : 'success.main'}
                    >
                        ${data.price || ''}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', minWidth: '20%', justifyContent: 'flex-end' }}>
                    <Button 
                        variant="contained" 
                        color={Math.sign(data.change) === -1 ? 'error' : 'success'}
                        sx={{ 
                            borderRadius: 2,
                            minWidth: 100,
                            fontSize: 13,
                            fontWeight: 'bold'
                        }}
                    >
                        {Math.sign(data.change) === -1 ? '' : '+'}{data.change}%
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}