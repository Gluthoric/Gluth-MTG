import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // API base URL

export const extractPrices = (cards) => {
  return cards.map(card => {
    try {
      const prices = JSON.parse(card.prices);
      const usdPrice = prices.usd;
      const usdFoilPrice = prices.usd_foil;

      const quantity = card.quantity;
      const foilQuantity = quantity.foil;
      const nonfoilQuantity = quantity.nonfoil;

      return {
        ...card,
        usdPrice,
        usdFoilPrice,
        foilQuantity,
        nonfoilQuantity
      };
    } catch (error) {
      console.error('Error parsing prices JSON:', error);
      return {
        ...card,
        usd: null,
        usd_foil: null,
        foilQuantity: null,
        nonfoilQuantity: null
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
