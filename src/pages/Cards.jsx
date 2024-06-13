import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button, Card as BootstrapCard } from 'react-bootstrap';
import { fetchCardsByEdition, updateCardQuantity } from '../services/cardService';
import SortingFilteringControls from '../components/SortingFilteringControls';

const Cards = () => {
  const { id } = useParams();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('');
  const [filterOption, setFilterOption] = useState('');

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const cardsData = await fetchCardsByEdition(id);
        setCards(cardsData);
        setLoading(false);
        console.log('Fetched cards successfully:', cardsData);
      } catch (err) {
        setError(err);
        setLoading(false);
        console.error('Error fetching cards:', err.message, err.stack);
      }
    };

    fetchCards();
  }, [id]);

  const handleUpdateQuantity = async (cardId, newQuantity) => {
    try {
      const updatedCard = await updateCardQuantity(cardId, newQuantity);
      setCards(cards.map(card => (card.id === cardId ? updatedCard : card)));
      console.log(`Updated quantity for card ${cardId} to ${newQuantity}`);
    } catch (err) {
      console.error('Error updating quantity:', err.message, err.stack);
    }
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    // Implement sorting logic based on the selected option
    const sortedCards = [...cards].sort((a, b) => {
      if (option === 'name') {
        return a.name.localeCompare(b.name);
      } else if (option === 'quantity') {
        return b.quantity - a.quantity;
      }
      return 0;
    });
    setCards(sortedCards);
  };

  const handleFilterChange = (option) => {
    setFilterOption(option);
    // Implement filtering logic based on the selected option
    const filteredCards = cards.filter(card => {
      if (option === 'owned') {
        return card.quantity > 0;
      } else if (option === 'unowned') {
        return card.quantity === 0;
      }
      return true;
    });
    setCards(filteredCards);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Edition {id} Cards</h2>
      <SortingFilteringControls
        sortOption={sortOption}
        filterOption={filterOption}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
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

export default Cards;