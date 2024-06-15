import React from 'react';
import { Container } from 'react-bootstrap';
import logToFile from '../utils/logger.js';

logToFile('Home.jsx: Rendering started');
console.log('Home.jsx: Rendering started');

const Home = () => {
  return (
    <Container>
      <h2>Home Page</h2>
      <p>Welcome to the MTG Collection Tracker!</p>
    </Container>
  );
};

logToFile('Home.jsx: Rendering completed');
console.log('Home.jsx: Rendering completed');

export default Home;
