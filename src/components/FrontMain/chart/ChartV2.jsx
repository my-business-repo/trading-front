import { useEffect } from "react";


const ChartV2 = ({ focusCoin, timeFrame }) => {

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/tv.js";
        script.async = true;
        let widget;
        script.onload = () => {
             widget = new window.TradingView.widget({
                // "autosize": true,
                "width": "100%",
                "height": window.innerHeight / 1.7,
                "symbol": `COINBASE:${focusCoin ? focusCoin : 'BTC'}USDT`, // btc/usdt
                "interval": "1", 
                "timezone": "Etc/UTC",
                "theme": "dark",
                "style": "1",
                "locale": "en",
                "hide_top_toolbar": false,
                "hide_side_toolbar": true,
                "allow_symbol_change": true,
                "save_image": false,
                "calendar": false,
                "hide_volume": true,
                "details":true,
                "studies": [
                    // "BB@tv-basicstudies",
                ],
                container_id: "tradingview_chart",
            });
            console.log(widget);
        };
        document.body.appendChild(script);
    }, [focusCoin, timeFrame]);


    return (
        <div
            id="tradingview_chart"
            style={{
                position: "relative",
                overflow: "hidden",
                width: "100%",
                maxWidth: "1200px",
                margin: "0 auto",
            }}
        />
    )
}

export default ChartV2;
