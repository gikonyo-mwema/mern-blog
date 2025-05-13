import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { store, persistor } from './redux/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import ThemeProvider from './components/ThemeProvider.jsx';
import React from 'react';
import axios from 'axios';

// Axios Global Configuration
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || ''; // Changed from '/api'
axios.defaults.withCredentials = true;

// Enhanced request interceptor
axios.interceptors.request.use((config) => {
  // Check both localStorage and cookies for token
  const token = localStorage.getItem('token') || 
                document.cookie.split('; ')
                  .find(row => row.startsWith('token='))
                  ?.split('=')[1];
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Enhanced response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state and redirect
      localStorage.removeItem('token');
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>
        <ThemeProvider>     
          <App />        
        </ThemeProvider>
      </Provider>
    </PersistGate>
  </React.StrictMode>
);