import express from 'express';
import Card from '../models/card.js';

const router = express.Router();

// Middleware to validate the quantity field in the request body
const validateQuantity = (req, res, next) => {
  const { quantity } = req.body;
  if (typeof quantity !== 'number' || quantity < 0) {
    console.error('Invalid quantity:', quantity);
    return res.status(400).json({ error: 'Invalid quantity. Quantity must be a non-negative number.' });
  }
  next();
};

// GET /editions/:id/cards - Fetch all cards within a specific edition
router.get('/editions/:id/cards', async (req, res) => {
  const { id } = req.params;
  try {
    const cards = await Card.findAll({ where: { edition_id: id } });
    console.log(`Fetched cards for edition ${id} successfully`);
    res.status(200).json(cards);
  } catch (error) {
    console.error(`Error fetching cards for edition ${id}:`, error.message, error.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PATCH /cards/:id - Update the quantity of a specific card
router.patch('/cards/:id', validateQuantity, async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const card = await Card.findByPk(id);
    if (!card) {
      console.error(`Card with id ${id} not found`);
      return res.status(404).json({ error: 'Card not found' });
    }

    card.quantity = quantity;
    await card.save();

    console.log(`Updated quantity for card ${id} to ${quantity}`);
    res.status(200).json(card);
  } catch (error) {
    console.error(`Error updating quantity for card ${id}:`, error.message, error.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
