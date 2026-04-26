import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    axios.get('http://localhost:5000/api/test')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setMessage('Network Error or Backend not running');
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Budget Tracker</h1>
        <p>Backend Status: {message}</p>
      </header>
    </div>
  );
}

export default App;
