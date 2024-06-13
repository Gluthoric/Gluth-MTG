import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SortingFilteringControls from '../components/SortingFilteringControls';
import { Card as BootstrapCard, Form } from 'react-bootstrap';

const Kiosk = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('');
  const [filterOption, setFilterOption] = useState('');

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get('http://localhost:3000/kiosk');
        let fetchedCards = response.data;

        // Apply initial sorting and filtering
        fetchedCards = applySortingFiltering(fetchedCards, sortOption, filterOption);

        setCards(fetchedCards);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        console.error('Error fetching cards:', err.message, err.stack);
      }
    };

    fetchCards();
  }, [sortOption, filterOption]);

  const applySortingFiltering = (cards, sort, filter) => {
    let filteredCards = cards;

    // Filtering
    if (filter === 'owned') {
      filteredCards = cards.filter(card => card.quantity > 0);
    } else if (filter === 'unowned') {
      filteredCards = cards.filter(card => card.quantity === 0);
    }

    // Sorting
    if (sort === 'name') {
      filteredCards.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'quantity') {
      filteredCards.sort((a, b) => b.quantity - a.quantity);
    }

    return filteredCards;
  };

  const handleUpdateQuantity = async (cardId, newQuantity) => {
    try {
      const updatedCard = await axios.patch(`http://localhost:3000/cards/${cardId}`, { quantity: newQuantity });
      setCards(cards.map(card => (card.id === cardId ? updatedCard.data : card)));
      console.log(`Updated quantity for card ${cardId} to ${newQuantity}`);
    } catch (err) {
      console.error('Error updating quantity:', err.message, err.stack);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Kiosk Page</h2>
      <SortingFilteringControls
        sortOption={sortOption}
        filterOption={filterOption}
        onSortChange={setSortOption}
        onFilterChange={setFilterOption}
      />
      <div className="card-grid">
        {cards.map(card => (
          <BootstrapCard
            key={card.id}
            className={`card-item ${card.quantity > 0 ? 'owned' : 'unowned'}`}
          >
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
        ))}
      </div>
    </div>
  );
};

export default Kiosk;