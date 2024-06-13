import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Home from './pages/Home.jsx';
import Editions from './pages/Editions.jsx';
import Edition from './pages/Edition.jsx';
import Cards from './pages/Cards.jsx'; // Import the new Cards component
import Kiosk from './pages/Kiosk.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="editions" element={<Editions />} />
          <Route path="editions/:id" element={<Edition />} />
          <Route path="editions/:id/cards" element={<Cards />} /> {/* Add route for Cards */}
          <Route path="kiosk" element={<Kiosk />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);