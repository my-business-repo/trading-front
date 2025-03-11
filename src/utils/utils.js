export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export function convertTimestampToLocalTime(timestamp) {
  let date = new Date(timestamp * 1000);
  let localDate = date.toLocaleDateString();
  let localTime = date.toLocaleTimeString();
  return `${localDate} ${localTime}`;
}

export function formatNumberWithMillions(num) {
  if (num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else {
      return num.toFixed(2);
    }
  }
}


export function getCoinStringList(){
  return "BTC,ETH,XRP,USDT,SOL,BNB,USDC,DOGE,ADA,TRX,LINK,XLM,AVAX,SUI,LTC,SHIB,TON,HBAR,LEO,HYPE,DOT,OM,BCH,USDe,BGB,UNI,DAI,XMR,PEPE,NEAR,ONDO,AAVE,TRUMP,MNT,APT,ICP,OKB,ETC,TAO,KAS,POL,VET,JUP,ALGO,RENDER,CRO,FIL,FDUSD,GT,ARB,ATOM,FET,TIA,LDO,OP,RAY,KCS,INJ,XDC,S,DEXE,STX,ENA,IMX,BONK,THETA,MOVE,GRT,FLR,WLD,QNT,SEI,JASMY,EOS,SAND,ENS,FLOKI,JTO,XTZ,NEXO,BITT,GALA,VIRTUAL,MKR,IOTA,FLOW,BSV,KAIA,RON,NEO,PYTH,XCN,CAKE,FTT,XAUt,SPX,AXS,HNT,WIF,CRV";
}

