// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Home from './pages/Home.jsx';
import Editions from './pages/Editions.jsx';
import Edition from './pages/Edition.jsx';
import Cards from './pages/Cards.jsx';
import Kiosk from './pages/Kiosk.jsx';
import { CardProvider } from './context/CardContext.jsx';
import logToFile from './utils/logger.js';

// Log rendering start
logToFile('main.jsx: Rendering started');
console.log('main.jsx: Rendering started');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <CardProvider>
        <Routes>
          <Route path='/' element={<App />}>
            <Route index element={<Home />} />
            <Route path='editions' element={<Editions />} />
            <Route path='editions/:id' element={<Edition />} />
            <Route path='editions/:id/cards' element={<Cards />} />
            <Route path='kiosk' element={<Kiosk />} />
          </Route>
        </Routes>
      </CardProvider>
    </Router>
  </React.StrictMode>
);

// Log rendering completion
logToFile('main.jsx: Rendering completed');
console.log('main.jsx: Rendering completed');
