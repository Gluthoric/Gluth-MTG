// server/routes/cards.js

import express from 'express';
import Sequelize from 'sequelize'; // Import Sequelize for operators
import Card from '../models/card.js';
import validateQuantity from '../middleware/validateQuantity.js';

const router = express.Router();

// GET /editions/:id/cards - Fetch all cards within a specific edition
router.get('/editions/:id/cards', async (req, res) => {
  const { id } = req.params;
  try {
    const cards = await Card.findAll({
      where: { edition_id: id },
      attributes: [
        'id', 'name', 
        [Sequelize.fn('JSON_UNQUOTE', Sequelize.json('prices')), 'prices'], 
        [Sequelize.fn('JSON_UNQUOTE', Sequelize.json('quantity')), 'quantity'], 
        'image_url', 'oracle_text', 'type_line',
        'mana_cost', 'cmc', 'power', 'toughness', 'rarity', 'colors',
        'color_identity', 'set_code', 'released_at'
      ]
    });
    if (cards.length > 0) {
      console.log(`Fetched cards for edition ${id} successfully:`, cards); // Log fetched cards
    } else {
      console.log(`No cards found for edition ${id}`);
    }
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

    // Update the quantity
    card.quantity = quantity;
    await card.save();

    console.log(`Updated quantity for card ${id} to ${JSON.stringify(quantity)}`);
    res.status(200).json(card);
  } catch (error) {
    console.error(`Error updating quantity for card ${id}:`, error.message, error.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /kiosk - Fetch all cards with quantities greater than 1
router.get('/kiosk', async (req, res) => {
  try {
    const cards = await Card.findAll({
      where: {
        [Sequelize.Op.or]: [
          { quantity_foil: { [Sequelize.Op.gt]: 1 } },
          { quantity_nonfoil: { [Sequelize.Op.gt]: 1 } }
        ]
      },
      attributes: [
        'id', 'name', 
        [Sequelize.fn('JSON_UNQUOTE', Sequelize.json('prices')), 'prices'], 
        [Sequelize.fn('JSON_UNQUOTE', Sequelize.json('quantity')), 'quantity'], 
        'image_url', 'oracle_text', 'type_line',
        'mana_cost', 'cmc', 'power', 'toughness', 'rarity', 'colors',
        'color_identity', 'set_code', 'released_at'
      ]
    });
    if (cards.length > 0) {
      console.log('Fetched cards for kiosk successfully:', cards); // Log fetched cards
    } else {
      console.log('No cards found for kiosk');
    }
    res.status(200).json(cards);
  } catch (error) {
    console.error('Error fetching cards for kiosk:', error.message, error.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
