import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Add Axios interceptor to include Bearer token
axios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token'); // Retrieve token from sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add Bearer token to Authorization header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
