import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // API base URL

export const extractPrices = (cards) => {
  return cards.map(card => {
    try {
      const prices = JSON.parse(card.prices);
      return {
        ...card,
        usd: prices.usd,
        usd_foil: prices.usd_foil
      };
    } catch (error) {
      console.error('Error parsing prices JSON:', error);
      return {
        ...card,
        usd: null,
        usd_foil: null
      };
    }
  });
};

export const fetchCardsByEdition = async (editionId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/editions/${editionId}/cards`);
    console.log('Fetched cards:', response.data);
    const cardsWithPrices = extractPrices(response.data);
    return cardsWithPrices;
  } catch (error) {
    console.error('Error fetching cards:', error.message, error.stack);
    throw error;
  }
};

export const updateCardQuantity = async (cardId, quantity) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/cards/${cardId}`, { quantity });
    console.log('Updated card quantity:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating quantity:', error.message, error.stack);
    throw error;
  }
};
