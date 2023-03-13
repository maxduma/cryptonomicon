const API_KEY = 'e14ef8fed0c797833027f5a1d5e23f24835e382709e1a2b6f302cc0ac9d2b8cb';

const tickersHandlers = new Map();
const socket = newWebSocket(`wss://streamer.cryptocompare.com/v2&api_key=${API_KEY}`);

const AGGREGATE_INDEX = "5";

socket.addEventListener('message', (e) => {
  const {TYPE: type, FROMSYMBOL: currency, PRICE: newPrice} = JSON.parse(e.data);

  if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    return;
  }

  const handles = tickersHandlers.get(currency) ?? [];
  handles.forEach((fn) => {fn(newPrice)});
});

const sendToWebSocket = (message) => {
  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }
  socket.addEventListener(
    'open',
    () => {
    socket.send(stringifiedMessage);
  },
  {once: true}
  );
};

const subscribeToTickersOnWS = (ticker) => () => {
  sendToWebSocket({
    "action": "SubAdd",
    "subs": [`5~CCCAGG~${ticker}~USD`]
  });
};

const unsubscribeFromTickersOnWS = (ticker) => () => {
  sendToWebSocket({
    "action": "SubRemove",
    "subs": [`5~CCCAGG~${ticker}~USD`]
  });
};

export const subscribeToTickers = (ticker, cb) => {
  const subscribes = tickersHandlers.get(tickersHandlers) || [];
  tickersHandlers.set(ticker, [...subscribes, cb]);
  subscribeToTickersOnWS(ticker);
};

export const unsubscribeToTickers = (ticker) => {
  tickersHandlers.delete(ticker);
  unsubscribeFromTickersOnWS(ticker);
};