import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ListGroup, Container } from 'react-bootstrap';
import { useCardContext } from '../context/CardContext';

const Editions = () => {
  const { state, dispatch } = useCardContext();
  const { cards } = state;
  const [editions, setEditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEditions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/editions'); // Update the URL to match the backend
        setEditions(response.data);
        setLoading(false);
        console.log('Fetched editions successfully:', response.data);
      } catch (err) {
        setError(err);
        setLoading(false);
        console.error('Error fetching editions:', err.message, err.stack);
      }
    };

    fetchEditions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container>
      <h2>Editions Page</h2>
      <p>Here you can see all the editions.</p>
      <ListGroup>
        {editions.map((edition) => (
          <ListGroup.Item key={edition.id}>
            <Link to={`/editions/${edition.id}`}>{edition.name}</Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default Editions;