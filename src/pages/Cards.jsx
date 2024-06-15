import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Container, Row, Col } from 'react-bootstrap';
import { fetchCardsByEdition, updateCardQuantity } from '../services/cardService';
import SortingFilteringControls from '../components/SortingFilteringControls';
import { useCardContext } from '../context/CardContext';
import CardItem from '../components/CardItem';

const Cards = () => {
  const { id } = useParams();
  const { state, dispatch } = useCardContext();
  const { cards, sortOption, filterOption, loading, error } = state;

  useEffect(() => {
    const fetchCards = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const cardsData = await fetchCardsByEdition(id);
        dispatch({ type: 'SET_CARDS', payload: cardsData });
        console.log('Fetched cards successfully:', cardsData);
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err });
        console.error('Error fetching cards:', err.message, err.stack);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchCards();
  }, [id, dispatch]);

  const handleUpdateQuantity = async (cardId, type, newQuantity) => {
    try {
      const updatedCard = await updateCardQuantity(cardId, newQuantity);
      dispatch({ type: 'UPDATE_CARD_QUANTITY', payload: { id: cardId, [type === 'foil' ? 'quantity_foil' : 'quantity_nonfoil']: newQuantity } });
      console.log(`Updated ${type} quantity for card ${cardId} to ${newQuantity}`);
    } catch (err) {
      console.error('Error updating quantity:', err.message, err.stack);
    }
  };

  const handleSortChange = (option) => {
    dispatch({ type: 'SET_SORT_OPTION', payload: option });
    const sortedCards = [...cards].sort((a, b) => {
      if (option === 'name') {
        return a.name.localeCompare(b.name);
      } else if (option === 'quantity') {
        return (b.quantity_foil + b.quantity_nonfoil) - (a.quantity_foil + a.quantity_nonfoil);
      }
      return 0;
    });
    dispatch({ type: 'SET_CARDS', payload: sortedCards });
  };

  const handleFilterChange = (option) => {
    dispatch({ type: 'SET_FILTER_OPTION', payload: option });
    const filteredCards = cards.filter(card => {
      if (option === 'owned') {
        return (card.quantity_foil + card.quantity_nonfoil) > 0;
      } else if (option === 'unowned') {
        return (card.quantity_foil + card.quantity_nonfoil) === 0;
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
      <h2>Edition {id} Cards</h2>
      <SortingFilteringControls
        sortOption={sortOption}
        filterOption={filterOption}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
      />
      <Row className="card-grid">
        {cards.map(card => (
          <Col key={card.id} xs={12} sm={6} md={4} className={`card-item ${(card.quantity_foil + card.quantity_nonfoil) > 0 ? 'owned' : 'unowned'}`}>
            <CardItem card={card} handleUpdateQuantity={handleUpdateQuantity} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Cards;
