import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Alert, Row, Col } from 'react-bootstrap';
import { useCardContext } from '../context/CardContext';
import EditionCard from '../components/EditionCard';

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
    return <Alert variant="danger">Error: {error.message}</Alert>;
  }

  return (
    <Container>
      <h2>Editions Page</h2>
      <p>Here you can see all the editions.</p>
      <Row>
        {editions.map((edition) => (
          <Col key={edition.id} xs={12} sm={6} md={4} lg={3}>
            <EditionCard
              id={edition.id}
              name={edition.name}
              iconSvgUri={edition.icon_svg_uri}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Editions;
