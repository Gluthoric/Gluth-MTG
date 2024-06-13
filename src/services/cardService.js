import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // INPUT_REQUIRED {API base URL}

export const fetchCardsByEdition = async (editionId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/editions/${editionId}/cards`);
    console.log(`Fetched cards for edition ${editionId} successfully`);
    return response.data;
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
