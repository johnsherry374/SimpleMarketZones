
import React, { useEffect, useState } from 'react';

const pairs = [
  'XAU/USD',
  'XAG/USD',
  'GBP/USD',
  'USD/CHF',
  'USD/JPY',
  'AUD/USD',
  'EUR/USD',
  'FTSE 100',
  'S&P 500',
];

const getRandomPrice = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

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
    const generateData = () => {
      const items = pairs.map((pair) => {
        const high = parseFloat(getRandomPrice(100, 200));
        const low = parseFloat(getRandomPrice(50, 99));
        const current = parseFloat(getRandomPrice(low, high));
        const status = calculateZoneStatus(current, high, low);
        return { pair, high, low, current, status };
      });
      setData(items);
    };

    generateData();
    const interval = setInterval(generateData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ textAlign: 'center' }}>Market Zone Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {data.map(({ pair, high, low, current, status }) => (
          <div key={pair} style={{ padding: '1rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>{pair}</h2>
            <p>High: {high}</p>
            <p>Low: {low}</p>
            <p>Current: {current}</p>
            <p>
              Status: <strong style={{ color: status === 'Buy Zone' ? 'green' : status === 'Sell Zone' ? 'red' : 'gray' }}>{status}</strong>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
