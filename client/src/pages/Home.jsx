import { useState } from 'react';
import { testBackend } from '../services/api';

const Home = () => {
  const [apiResponse, setApiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTestClick = async () => {
    setLoading(true);
    setApiResponse("");
    try {
        const data = await testBackend();
        // Shows the standard "API working" text, and adds a note if it's from DB
        setApiResponse(data.message + (data.fromDatabase ? " (from MongoDB!)" : ""));
    } catch (error) {
        setApiResponse("Failed to connect to backend. Is the server running?");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <h1>AI Budget Tracker Setup Test</h1>
      
      <button 
        onClick={handleTestClick}
        disabled={loading}
        style={{ 
          padding: '12px 24px', 
          fontSize: '16px', 
          cursor: 'pointer', 
          backgroundColor: '#2563EB', 
          color: 'white', 
          border: 'none', 
          borderRadius: '6px',
          fontWeight: '600'
        }}
      >
        {loading ? "Testing..." : "Test Backend"}
      </button>

      {apiResponse && (
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: '#F3F4F6', 
          borderRadius: '8px', 
          display: 'inline-block',
          border: '1px solid #D1D5DB'
        }}>
            <p style={{ 
              margin: 0, 
              color: apiResponse.includes("Failed") ? '#DC2626' : '#16A34A', 
              fontWeight: 'bold',
              fontSize: '18px'
            }}>
                {apiResponse}
            </p>
        </div>
      )}
    </div>
  );
};

export default Home;
