import { Box } from "@mui/material";
import AssetCard from "./AssetCard";

export default function AccountAsset({ assets, showBalance, theme }) {
    return (
        <Box sx={{
            background: theme === 'dark' ? '#1e1e1e' : 'white', // Dark theme background
            border: theme === 'dark' ? '1px solid #555' : '1px solid #ccc', // Border color for dark theme
            position: 'relative',
            borderTopRightRadius: '10px',
            borderTopLeftRadius: '10px',
            zIndex: 2,
            padding: 2, // Added padding for better spacing
        }}>
            {assets.map((asset, index) => (
                <AssetCard
                    theme={theme}
                    key={asset.accountNo} 
                    data={{
                        name: asset.currency.toUpperCase(),
                        available: showBalance ? asset.balance : '******',
                        inreview: showBalance ? asset.inreview_balance : '******',
                        isActive: asset.isActive
                    }} 
                />
            ))}
        </Box>
    );
}