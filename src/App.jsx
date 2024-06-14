import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import './App.css';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <div className="app-container">
      <NavigationBar />
      <Container className="content-container">
        <h1>react-gluth-mtg</h1>
        <Outlet />
      </Container>
    </div>
  );
}

export default App;