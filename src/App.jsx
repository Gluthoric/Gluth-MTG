import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import './App.css';
import { Container } from 'react-bootstrap';
import { CardProvider } from './context/CardContext';
import logToFile from './utils/logger.js';

logToFile('App.jsx: Rendering started');
console.log('App.jsx: Rendering started');

function App() {
  return (
    <CardProvider>
      <div className='app-container' style={{ width: '100%', height: '100%' }}>
        <NavigationBar />
        <Container className='content-container' style={{ width: '100%', height: '100%' }}>
          <h1>react-gluth-mtg</h1>
          <Outlet />
        </Container>
      </div>
    </CardProvider>
  );
}

logToFile('App.jsx: Rendering completed');
console.log('App.jsx: Rendering completed');

export default App;
