import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card as BootstrapCard, Form, Container, Row, Col } from 'react-bootstrap';
import SortingFilteringControls from '../components/SortingFilteringControls';
import { useCardContext } from '../context/CardContext';

const Kiosk = () => {
  const { state, dispatch } = useCardContext();
  const { cards, sortOption, filterOption } = state;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get('http://localhost:3000/kiosk');
        let fetchedCards = response.data;

        dispatch({ type: 'SET_CARDS', payload: fetchedCards });
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        console.error('Error fetching cards:', err.message, err.stack);
      }
    };

    fetchCards();
  }, [dispatch]);

  const handleUpdateQuantity = async (cardId, newQuantity) => {
    try {
      const updatedCard = await axios.patch(`http://localhost:3000/cards/${cardId}`, { quantity: newQuantity });
      dispatch({ type: 'UPDATE_CARD_QUANTITY', payload: { id: cardId, quantity: newQuantity } });
      console.log(`Updated quantity for card ${cardId} to ${newQuantity}`);
    } catch (err) {
      console.error('Error updating quantity:', err.message, err.stack);
    }
  };

  const handleSortChange = (option) => {
    dispatch({ type: 'SET_SORT_OPTION', payload: option });
    // Implement sorting logic based on the selected option
    const sortedCards = [...cards].sort((a, b) => {
      if (option === 'name') {
        return a.name.localeCompare(b.name);
      } else if (option === 'quantity') {
        return b.quantity - a.quantity;
      }
      return 0;
    });
    dispatch({ type: 'SET_CARDS', payload: sortedCards });
  };

  const handleFilterChange = (option) => {
    dispatch({ type: 'SET_FILTER_OPTION', payload: option });
    // Implement filtering logic based on the selected option
    const filteredCards = cards.filter(card => {
      if (option === 'owned') {
        return card.quantity > 0;
      } else if (option === 'unowned') {
        return card.quantity === 0;
      }
      return true;
    });
    dispatch({ type: 'SET_CARDS', payload: filteredCards });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container>
      <h2>Kiosk Page</h2>
      <SortingFilteringControls
        sortOption={sortOption}
        filterOption={filterOption}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
      />
      <Row className="card-grid">
        {cards.map(card => (
          <Col key={card.id} xs={12} sm={6} md={4} className={`card-item ${card.quantity > 0 ? 'owned' : 'unowned'}`}>
            <BootstrapCard>
              <BootstrapCard.Body>
                <BootstrapCard.Title>{card.name}</BootstrapCard.Title>
                <Form>
                  <Form.Group controlId={`card-quantity-${card.id}`}>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      value={card.quantity}
                      onChange={e => handleUpdateQuantity(card.id, parseInt(e.target.value))}
                      min="0"
                    />
                  </Form.Group>
                </Form>
              </BootstrapCard.Body>
            </BootstrapCard>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Kiosk;