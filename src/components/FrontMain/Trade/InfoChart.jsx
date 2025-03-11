import { Box } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Area, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, ComposedChart, Legend } from "recharts";
import { convertTimestampToLocalTime, formatNumber } from "../../../utils/utils";
import { useInterval } from "react-use";


export default function InfoChart({ focusCoin, isDarkTheme, timeFrame }) {
    const [data, setData] = useState([]);
    const [averageMA, setAverageMA] = useState({ ma5: 0, ma10: 0, ma20: 0 });
    const CustomLegend = () => {
        return (
            <Box>
                <p>MA5 : {averageMA.ma5.toFixed(2)}</p>
                <p>MA10 : {averageMA.ma10.toFixed(2)}</p>
                <p>MA20 : {averageMA.ma20.toFixed(2)}</p>
            </Box>
        );
    };

    const fetchData = async () => {
        try {
            const API = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${focusCoin}&tsym=USD&limit=${timeFrame}`;
            const response = await axios.get(API);

            let data = response.data.Data.Data;
            data = data.map((item) => {
                return {
                    time: convertTimestampToLocalTime(item.time),
                    open: item.open,
                    high: item.high,
                    low: item.low,
                    close: item.close,
                };
            });
            
            // Calculate moving averages
            const dataWithMA = data.map((item, index, array) => {
                const closePrices = array.slice(Math.max(index - 19, 0), index + 1).map(i => i.close);
                const ma5 = closePrices.slice(-5).reduce((a, b) => a + b, 0) / Math.min(5, closePrices.length);
                const ma10 = closePrices.slice(-10).reduce((a, b) => a + b, 0) / Math.min(10, closePrices.length);
                const ma20 = closePrices.slice(-20).reduce((a, b) => a + b, 0) / Math.min(20, closePrices.length);
                return { ...item, ma5, ma10, ma20 };
            });
            // Calculate the average values for MA5, MA10, MA20
            const sumMA5 = dataWithMA.reduce((acc, cur) => acc + (cur.ma5 || 0), 0);
            const sumMA10 = dataWithMA.reduce((acc, cur) => acc + (cur.ma10 || 0), 0);
            const sumMA20 = dataWithMA.reduce((acc, cur) => acc + (cur.ma20 || 0), 0);
            const avgMA5 = sumMA5 / dataWithMA.length;
            const avgMA10 = sumMA10 / dataWithMA.length;
            const avgMA20 = sumMA20 / dataWithMA.length;

            setAverageMA({ ma5: avgMA5, ma10: avgMA10, ma20: avgMA20 });
            setData(dataWithMA);
        } catch (error) {
            console.error(error);
        }
    };
    useInterval(() => {
        fetchData();
    }, [1000])

    useEffect(() => {
        fetchData();
    }, []);
    
    const chartBackground = isDarkTheme ? '#1e1e1e' : 'white';
    const gridStroke = isDarkTheme ? '#555' : '#ccc';
    const lineColorMA5 = '#82ca9d';
    const lineColorMA10 = '#ffc658';
    const lineColorMA20 = '#ff7300';
    const areaColor = isDarkTheme ? 'rgba(130, 202, 157, 0.8)' : 'rgba(130, 202, 157, 0.5)';

    return (
        <Box display='flex' justifyContent='center' alignItems='center' sx={{ background: chartBackground }} pb={3}>
            <Box sx={{ width: '90%', maxWidth: '100%', '@media (max-width: 600px)': { width: '100%' } }}>
                <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={data}>
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="55%" stopColor={areaColor} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={areaColor} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="6 6" stroke={gridStroke} />
                        <XAxis dataKey="time" />
                        <YAxis domain={[(dataMin) => dataMin - 50, 'dataMax']} orientation="right" tickFormatter={formatNumber} />
                        <Tooltip />
                        <Legend verticalAlign="top" align="left" />
                        <Area type="monotone" dataKey="close" name="Closing Price" fillOpacity={1} fill="url(#colorUv)" />
                        {data.length > 0 && <>
                            <Line type="monotone" dataKey="ma5" stroke={lineColorMA5} name="MA5" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="ma10" stroke={lineColorMA10} name="MA10" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="ma20" stroke={lineColorMA20} name="MA20" strokeWidth={2} dot={false} />
                        </>}
                    </ComposedChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    )
}