import { Box } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { formatNumber } from "../../../utils/utils";
import { useInterval } from "react-use";

export default function InfoHistChart({ focusCoin }) {
    const [data, setData] = useState([]);
    const fetchHistoricalData = async () => {
        // const urlHist = 'https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USDT&limit=60';
        const urlHist = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${focusCoin}&tsym=USD&limit=60`;
        try {
            const responseHist = await axios.get(urlHist);
            const histData = responseHist.data.Data.Data;

            // Calculate volume moving averages
            const dataWithVolMA = histData.map((item, index, array) => {
                const volumes = array.slice(Math.max(index - 49, 0), index + 1).map(i => i.volumeto);
                const ma5 = volumes.slice(-5).reduce((a, b) => a + b, 0) / Math.min(5, volumes.length);
                const ma10 = volumes.slice(-10).reduce((a, b) => a + b, 0) / Math.min(10, volumes.length);
                return { ...item, ma5, ma10 };
            });

            setData(dataWithVolMA);
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
                    <ComposedChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" tickFormatter={(tick) => new Date(tick * 1000).toLocaleTimeString()} />
                        <YAxis orientation="right" tickFormatter={formatNumber} />
                        <Tooltip />
                        <Legend verticalAlign="top" align="left" />
                        <Bar dataKey="volumeto" fill="#8884d8" name="Volume" />
                        {data.length > 0 && (<><Line type="monotone" dataKey="ma5" stroke="#82ca9d" name="MA5" dot={false} />
                            <Line type="monotone" dataKey="ma10" stroke="#ff7300" name="MA10" dot={false} /></>)}
                    </ComposedChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    )

}
