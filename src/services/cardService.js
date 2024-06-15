import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // API base URL

export const fetchCardsByEdition = async (editionId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/editions/${editionId}/cards`);
    console.log(`Fetched cards for edition ${editionId} successfully`);

    const cardsWithDetails = response.data.map(card => {
      return {
        ...card,
        usdPrice: card.price_nonfoil,
        usdFoilPrice: card.price_foil,
        foilQuantity: card.quantity_foil,
        nonfoilQuantity: card.quantity_nonfoil
      };
    });

    return cardsWithDetails;
  } catch (error) {
    console.error(`Error fetching cards for edition ${editionId}:`, error.message, error.stack);
    throw error;
  }
};

export const updateCardQuantity = async (cardId, quantity_foil, quantity_nonfoil) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/cards/${cardId}`, { quantity_foil, quantity_nonfoil });
    console.log(`Updated quantity for card ${cardId} to foil: ${quantity_foil}, nonfoil: ${quantity_nonfoil}`);
    return response.data;
  } catch (error) {
    console.error(`Error updating quantity for card ${cardId}:`, error.message, error.stack);
    throw error;
  }
};

export const fetchKioskCards = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/kiosk`);
    console.log('Fetched cards for kiosk successfully');

    const cardsWithDetails = response.data.map(card => {
      return {
        ...card,
        usdPrice: card.price_nonfoil,
        usdFoilPrice: card.price_foil,
        foilQuantity: card.quantity_foil,
        nonfoilQuantity: card.quantity_nonfoil
      };
    });

    return cardsWithDetails;
  } catch (error) {
    console.error('Error fetching cards for kiosk:', error.message, error.stack);
    throw error;
  }
};
