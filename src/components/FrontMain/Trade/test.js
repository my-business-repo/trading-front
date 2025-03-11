useEffect(() => {
    // Fetch historical data for moving averages and closing prices
    const fetchHistoricalData = async () => {
        // const apiKey = 'YOUR_API_KEY'; // Replace with your CryptoCompare API key
        const urlHist = 'https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USDT&limit=20';


        try {
            const responseHist = await axios.get(urlHist);
            const histData = responseHist.data.Data.Data;

            // Calculate moving averages
            const dataWithMA = histData.map((item, index, array) => {
                const closePrices = array.slice(Math.max(index - 19, 0), index + 1).map(i => i.close);
                const ma5 = closePrices.slice(-5).reduce((a, b) => a + b, 0) / Math.min(5, closePrices.length);
                const ma10 = closePrices.slice(-10).reduce((a, b) => a + b, 0) / Math.min(10, closePrices.length);
                const ma20 = closePrices.slice(-20).reduce((a, b) => a + b, 0) / Math.min(20, closePrices.length);
                return { ...item, ma5, ma10, ma20 };
            });

            setData(dataWithMA);
        } catch (error) {
            console.error('Error fetching historical data:', error);
        }
    };

    // Fetch current price
    const fetchCurrentPrice = async () => {
        const apiKey = 'YOUR_API_KEY'; // Replace with your CryptoCompare API key
        const urlCurrent = 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsym=USDT';
        const paramsCurrent = {
            fsym: 'BTC',
            tsyms: 'USDT',
            api_key: apiKey,
        };

        try {
            const responseCurrent = await axios.get(urlCurrent, { params: paramsCurrent });
            setCurrentPrice(responseCurrent.data.USDT);
        } catch (error) {
            console.error('Error fetching current price:', error);
        }
    };

    fetchHistoricalData();
    fetchCurrentPrice();
}, []);