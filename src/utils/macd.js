export const calculateEMA = (data, period) => {
    const k = 2 / (period + 1);
    let emaArray = [data[0]];
  
    for (let i = 1; i < data.length; i++) {
      emaArray.push(data[i] * k + emaArray[i - 1] * (1 - k));
    }
    return emaArray;
  };
  
  export const calculateMACD = (closePrices) => {
    const ema12 = calculateEMA(closePrices, 12);
    const ema26 = calculateEMA(closePrices, 26);
    const dif = ema12.map((val, index) => val - ema26[index]);
    const dea = calculateEMA(dif, 9);
    const macd = dif.map((val, index) => val - dea[index]);
  
    return { dif, dea, macd };
  };
  