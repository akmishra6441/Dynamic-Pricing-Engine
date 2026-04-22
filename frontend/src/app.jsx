import React, { useState } from 'react';
import { optimizePrice } from './services/api';

function App() {
  const [formData, setFormData] = useState({
    product_id: 'PROD-101',
    current_price: 50.0,
    competitor_price: 48.0,
    cost_price: 30.0,
    historical_sales_volume: 1000
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOptimize = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Parse to ensure correct data types for Python/Pydantic
      const payload = {
        product_id: formData.product_id,
        current_price: parseFloat(formData.current_price),
        competitor_price: parseFloat(formData.competitor_price),
        cost_price: parseFloat(formData.cost_price),
        historical_sales_volume: parseInt(formData.historical_sales_volume, 10)
      };
      
      const data = await optimizePrice(payload);
      setResult(data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  // Inline styling for simplicity without requiring Tailwind installation
  const styles = {
    container: { padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '600px', margin: '0 auto', color: '#333' },
    form: { display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' },
    input: { padding: '0.5rem', marginTop: '0.25rem', width: '100%', boxSizing: 'border-box' },
    button: { padding: '0.75rem', background: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    resultBox: { marginTop: '1.5rem', padding: '1.5rem', border: '1px solid #c3e6cb', borderRadius: '8px', background: '#d4edda', color: '#155724' }
  };

  return (
    <div style={styles.container}>
      <h2>📈 Dynamic Pricing Dashboard</h2>
      
      <form onSubmit={handleOptimize} style={styles.form}>
        <label>
          Product ID:
          <input style={styles.input} type="text" name="product_id" value={formData.product_id} onChange={handleChange} required />
        </label>
        <label>
          Our Current Price ($):
          <input style={styles.input} type="number" step="0.01" name="current_price" value={formData.current_price} onChange={handleChange} required />
        </label>
        <label>
          Competitor Price ($):
          <input style={styles.input} type="number" step="0.01" name="competitor_price" value={formData.competitor_price} onChange={handleChange} required />
        </label>
        <label>
          Our Cost Price ($):
          <input style={styles.input} type="number" step="0.01" name="cost_price" value={formData.cost_price} onChange={handleChange} required />
        </label>
        <label>
          Historical Demand (Units):
          <input style={styles.input} type="number" name="historical_sales_volume" value={formData.historical_sales_volume} onChange={handleChange} required />
        </label>
        
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Crunching Numbers...' : 'Calculate Optimal Price'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

      {result && (
        <div style={styles.resultBox}>
          <h3>Optimization Results for {result.product_id}</h3>
          <p><strong>Suggested Price:</strong> ${result.suggested_price.toFixed(2)}</p>
          <p><strong>Expected Demand:</strong> {result.expected_demand} units</p>
          <p><strong>Projected Revenue:</strong> ${result.projected_revenue.toFixed(2)}</p>
          <p><strong>Projected Profit:</strong> ${result.projected_profit.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

export default App;