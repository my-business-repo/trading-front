import { Box } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Bar, Line, ComposedChart, LineChart, Brush, Cell } from "recharts";
import { calculateMACD } from "../../../utils/macd";
import { useInterval } from "react-use";

export default function InfoBarChart({ focusCoin }) {
    const [macdData, setMacdData] = useState([]);
    const fetchHistoricalData = async () => {
        // const urlHist = 'https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USDT&limit=60';
        const urlHist = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${focusCoin}&tsym=USD&limit=60`;

        try {
            const responseHist = await axios.get(urlHist);
            const histData = responseHist.data.Data.Data;
            // Calculate MACD
            const closePrices = histData.map(item => item.close);
            const macdValues = calculateMACD(closePrices);
            const macdWithTime = histData.map((item, index) => ({
                time: item.time,
                dif: macdValues.dif[index],
                dea: macdValues.dea[index],
                macd: macdValues.macd[index],
            }));

            setMacdData(macdWithTime);
        } catch (error) {
            console.error('Error fetching historical data:', error);
        }
    };
    useInterval(() => {
        fetchHistoricalData();
    }, [1000])
    useEffect(() => {
        fetchHistoricalData();
    }, []);

    return (
        <Box display='flex' justifyContent='center' alignItems='center' sx={{ background: 'white' }} pb={3}>
            <Box sx={{ width: '90%', maxWidth: '100%', '@media (max-width: 600px)': { width: '100%' } }}>
                <ResponsiveContainer width="100%" height={200}>
                    <ComposedChart data={macdData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" tickFormatter={(tick) => new Date(tick * 1000).toLocaleTimeString()} />
                        <YAxis orientation="right" />
                        <Tooltip />
                        <Legend verticalAlign="top" align="left" />
                        <Bar dataKey="macd" fill="#8884d8" name="MACD" barSize={1}>
                            {macdData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.macd >= 0 ? 'green' : 'red'} />
                            ))}
                        </Bar>
                        {macdData.length > 0 && (<>
                            <Line type="monotone" dataKey="dif" stroke="#82ca9d" name="DIF (MACD)" dot={false} />
                            <Line type="monotone" dataKey="dea" stroke="#ff7300" name="DEA (Signal)" dot={false} /></>)}
                    </ComposedChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    )
}