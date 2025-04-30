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
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || '/api'; // Use Vite environment variable
axios.defaults.withCredentials = true;

// Add request interceptor to include token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle 401 errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
      console.error('Unauthorized request - please login again');
      // You might want to add logic to redirect to login here
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