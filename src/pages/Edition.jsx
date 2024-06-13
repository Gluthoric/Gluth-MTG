
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SortingFilteringControls from '../components/SortingFilteringControls';

const Edition = () => {
  const { id } = useParams();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('');
  const [filterOption, setFilterOption] = useState('');

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get(`/editions/${id}/cards`);
        let fetchedCards = response.data;
        
        // Apply initial sorting and filtering
        fetchedCards = applySortingFiltering(fetchedCards, sortOption, filterOption);
        
        setCards(fetchedCards);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        console.error('Error fetching cards:', err);
      }
    };

    fetchCards();
  }, [id, sortOption, filterOption]);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Edition {id}</h2>
      <p>Here you can see all the cards in edition {id}.</p>
      
      <SortingFilteringControls
        sortOption={sortOption}
        filterOption={filterOption}
        onSortChange={setSortOption}
        onFilterChange={setFilterOption}
      />

      <ul>
        {cards.map((card) => (
          <li key={card.id}>{card.name} - Quantity: {card.quantity}</li>
        ))}
      </ul>
    </div>
  );
};

export default Edition;
