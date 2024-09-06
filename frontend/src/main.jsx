import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './tailwind.css'; 
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/ReactToastify.css';
import 'typeface-audiowide';



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
