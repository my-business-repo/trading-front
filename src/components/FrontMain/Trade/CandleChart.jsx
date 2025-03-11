import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import { Box } from '@mui/material';

const CandleChart = ({ focusCoin, isDarkTheme, timeFrame }) => {
    const [state, setState] = useState({
        series: [{
            name: 'candle',
            data: []
        }, {
            name: 'MA5',
            data: []
        }, {
            name: 'MA10',
            data: []
        }, {
            name: 'MA20',
            data: []
        }],
        options: {
            chart: {
                height: 350,
                type: 'candlestick',
                stacked: false,
            },
            title: {
                text: `${focusCoin} Candle Chart`,
                align: 'left'
            },
            tooltip: {
                enabled: true,
            },
            xaxis: {
                type: 'datetime',
            },
            yaxis: {
                title: {
                    text: 'Price' // Shortened y-axis label
                },
                labels: {
                    formatter: (value) => {
                        return value >= 1000000 ? (value / 1000000).toFixed(0) + 'M' : value; // Format y-axis values
                    }
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });

    const fetchData = async () => {
        const API = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${focusCoin}&tsym=USD&limit=${timeFrame}`;
        try {
            const response = await axios.get(API);
            const fetchedCandleData = response.data.Data.Data.map(item => ({
                x: new Date(item.time * 1000), // Convert timestamp to Date object
                y: [item.open, item.high, item.low, item.close] // Candlestick format
            }));

            // Calculate moving averages
            const closePrices = response.data.Data.Data.map(item => item.close);
            const ma5 = closePrices.map((_, index) => {
                if (index < 4) return null; // Not enough data for MA5
                return {
                    x: new Date(response.data.Data.Data[index].time * 1000),
                    y: closePrices.slice(index - 4, index + 1).reduce((a, b) => a + b, 0) / 5
                };
            }).filter(Boolean);

            const ma10 = closePrices.map((_, index) => {
                if (index < 9) return null; // Not enough data for MA10
                return {
                    x: new Date(response.data.Data.Data[index].time * 1000),
                    y: closePrices.slice(index - 9, index + 1).reduce((a, b) => a + b, 0) / 10
                };
            }).filter(Boolean);

            const ma20 = closePrices.map((_, index) => {
                if (index < 19) return null; // Not enough data for MA20
                return {
                    x: new Date(response.data.Data.Data[index].time * 1000),
                    y: closePrices.slice(index - 19, index + 1).reduce((a, b) => a + b, 0) / 20
                };
            }).filter(Boolean);

            setState(prevState => ({
                ...prevState,
                series: [{
                    name: 'candle',
                    data: fetchedCandleData
                }, {
                    name: 'MA5',
                    data: ma5
                }, {
                    name: 'MA10',
                    data: ma10
                }, {
                    name: 'MA20',
                    data: ma20
                }]
            }));
        } catch (error) {
            console.error('Error fetching candle chart data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [focusCoin, timeFrame]);

    return (
        <Box sx={{border: '1px solid #ccc', borderRadius: '10px', padding: '20px', background: isDarkTheme ? 'black' : 'white'}}>
            <ReactApexChart options={state.options} series={state.series} type="candlestick" height={350} />
        </Box>
    );
};

export default CandleChart;