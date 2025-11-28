// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Tailwind CSS import
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from "./theme-support/ThemeContext"; // 👈 Import the provider

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <BrowserRouter>
    <ThemeProvider>
      <App />
    </ThemeProvider>
    </BrowserRouter>
  // </React.StrictMode>
);
