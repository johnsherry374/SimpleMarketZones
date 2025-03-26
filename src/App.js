
import React, { useEffect, useState } from 'react';

const pairs = [
  { symbol: 'XAU/USD', code: 'XAU/USD' },
  { symbol: 'XAG/USD', code: 'XAG/USD' },
  { symbol: 'GBP/USD', code: 'GBP/USD' },
  { symbol: 'USD/CHF', code: 'USD/CHF' },
  { symbol: 'USD/JPY', code: 'USD/JPY' },
  { symbol: 'AUD/USD', code: 'AUD/USD' },
  { symbol: 'EUR/USD', code: 'EUR/USD' },
  { symbol: 'FTSE 100', code: 'UKX' },
  { symbol: 'S&P 500', code: 'SPX' },
];

const calculateZoneStatus = (price, high, low) => {
  const range = high - low;
  const topZone = high - 0.1 * range;
  const bottomZone = low + 0.1 * range;
  if (price >= topZone) return 'Sell Zone';
  if (price <= bottomZone) return 'Buy Zone';
  return 'Neutral';
};

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const results = await Promise.all(
        pairs.map(async ({ symbol, code }) => {
          try {
            const res = await fetch(`https://api.twelvedata.com/time_series?symbol=${code}&interval=1h&outputsize=500&apikey=28c16fa1e508453aa2d3d66eb7b5caa0`);
            const json = await res.json();
            const values = json.values || [];
            const highs = values.map(v => parseFloat(v.high));
            const lows = values.map(v => parseFloat(v.low));
            const high = Math.max(...highs);
            const low = Math.min(...lows);
            const current = parseFloat(values[0].close);
            const status = calculateZoneStatus(current, high, low);
            return { symbol, high, low, current, status };
          } catch (err) {
            return { symbol, high: 0, low: 0, current: 0, status: 'Error' };
          }
        })
      );
      setData(results);
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ textAlign: 'center' }}>Market Zone Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {data.map(({ symbol, high, low, current, status }) => (
          <div key={symbol} style={{ padding: '1rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h2>{symbol}</h2>
            <p>High: {high.toFixed(2)}</p>
            <p>Low: {low.toFixed(2)}</p>
            <p>Current: {current.toFixed(2)}</p>
            <p>
              Status: <strong style={{ color: status === 'Buy Zone' ? 'green' : status === 'Sell Zone' ? 'red' : 'gray' }}>
                {status}
              </strong>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
