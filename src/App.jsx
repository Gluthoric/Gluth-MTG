import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <NavigationBar />
      <div className="content-container">
        <h1>react-gluth-mtg</h1>
        <Outlet />
      </div>
    </div>
  );
}

export default App;