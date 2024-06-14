import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const Edition = () => {
  const { id } = useParams();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/editions/${id}/cards`);
        setCards(response.data);
        setLoading(false);
        console.log(`Fetched cards for edition ${id} successfully:`, response.data);
      } catch (err) {
        setError(err);
        setLoading(false);
        console.error(`Error fetching cards for edition ${id}:`, err.message, err.stack);
      }
    };

    fetchCards();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container>
      <h2>Edition {id} Cards</h2>
      <ListGroup>
        {cards.map((card) => (
          <ListGroup.Item key={card.id}>
            {card.name} - Quantity: {card.quantity}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default Edition;