import axios from 'axios';
import { extractPrices } from '../utils/extractPrices';

const API_BASE_URL = 'http://localhost:3000'; // API base URL

export const fetchCardsByEdition = async (editionId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/editions/${editionId}/cards`);
    console.log(`Fetched cards for edition ${editionId} successfully`);

    const cardsWithDetails = response.data.map(card => {
      const prices = JSON.parse(card.prices);
      const usdPrice = prices.usd;
      const usdFoilPrice = prices.usd_foil;

      const quantity = JSON.parse(card.quantity);
      const foilQuantity = quantity.foil;
      const nonfoilQuantity = quantity.nonfoil;

      return {
        ...card,
        usdPrice,
        usdFoilPrice,
        foilQuantity,
        nonfoilQuantity
      };
    });

    return cardsWithDetails;
  } catch (error) {
    console.error(`Error fetching cards for edition ${editionId}:`, error.message, error.stack);
    throw error;
  }
};

export const updateCardQuantity = async (cardId, quantity) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/cards/${cardId}`, { quantity });
    console.log(`Updated quantity for card ${cardId} to ${quantity}`);
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
      const prices = JSON.parse(card.prices);
      const usdPrice = prices.usd;
      const usdFoilPrice = prices.usd_foil;

      const quantity = JSON.parse(card.quantity);
      const foilQuantity = quantity.foil;
      const nonfoilQuantity = quantity.nonfoil;

      return {
        ...card,
        usdPrice,
        usdFoilPrice,
        foilQuantity,
        nonfoilQuantity
      };
    });

    return cardsWithDetails;
  } catch (error) {
    console.error('Error fetching cards for kiosk:', error.message, error.stack);
    throw error;
  }
};
