const API_KEY = 'e14ef8fed0c797833027f5a1d5e23f24835e382709e1a2b6f302cc0ac9d2b8cb';

const tickersHandlers = new Map();

const loadtickersHandlers = (tickersHandlers) => {
  if (tickersHandlers.size === 0) { 
    return;
  }

  fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
    ...tickersHandlers.keys()]
  .join(",")}&tsyms=USD&api_key=${API_KEY}`)
    .then((r) => r.json())
    .then((rawData) => {
      const updatedPrices = Object.fromEntries(
        Object.entries(rawData.map(([value, key]) => {[ key, value.USD ]}));
    )

    Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
      const handles = tickersHandlers.get(currency) ?? [];
      handles.forEach((fn) => {fn(newPrice)});
    })
  });
};

export const subscribeTotickersHandlers = (ticker, cb) => {
  const subscribes = tickersHandlers.get(tickersHandlers) || [];
  tickersHandlers.set(ticker, [...subscribes, cb]);
};

export const unsubscribeTotickersHandlers = (ticker, cb) => {
  const subscribes = tickersHandlers.get(tickersHandlers) || [];
  tickersHandlers.set(ticker, subscribes.filter((fn) => {fn !== cb}));
};

setImmediate(loadtickersHandlers, 5000);