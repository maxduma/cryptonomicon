const API_KEY = 'e14ef8fed0c797833027f5a1d5e23f24835e382709e1a2b6f302cc0ac9d2b8cb';


export const loadTicker = (tickerName) => {
fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=USD&api_key=${API_KEY}`
  ).then(r => r.json());
}