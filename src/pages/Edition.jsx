import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Alert, Row, Col } from 'react-bootstrap';
import { useCardContext } from '../context/CardContext';
import axios from 'axios';
import CardItem from '../components/CardItem';

const Edition = () => {
  const { id } = useParams();
  const { state, dispatch } = useCardContext();
  const { cards, loading, error } = state;

  useEffect(() => {
    const fetchCards = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        console.log(`Fetching cards for edition ${id}`);
        const response = await axios.get(`http://localhost:3000/editions/${id}/cards`);
        dispatch({ type: 'SET_CARDS', payload: response.data });
        console.log("Fetched cards data:", response.data);
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err });
        console.error(`Error fetching cards for edition ${id}:`, err.message, err.stack);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchCards();
  }, [id, dispatch]);

  const handleUpdateQuantity = async (cardId, newQuantity) => {
    try {
      console.log(`Updating quantity for card ${cardId} to ${newQuantity}`);
      const updatedCard = await axios.patch(`http://localhost:3000/cards/${cardId}`, { quantity: newQuantity });
      dispatch({ type: 'UPDATE_CARD_QUANTITY', payload: { id: cardId, quantity: newQuantity } });
      console.log(`Updated quantity for card ${cardId} to ${newQuantity}`);
    } catch (err) {
      console.error('Error updating quantity:', err.message, err.stack);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <Alert variant="danger">Error: {error.message}</Alert>;
  }

  return (
    <Container fluid>
      <h2>Edition {id} Cards</h2>
      <Row className="card-grid">
        {cards.map((card) => (
          <Col key={card.id} xs={12} sm={6} md={4}>
            <CardItem card={card} handleUpdateQuantity={handleUpdateQuantity} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Edition;