import express from 'express';
import Edition from '../models/edition.js';

const router = express.Router();

// GET /editions - Fetch all editions
router.get('/', async (req, res) => {
  try {
    const editions = await Edition.findAll();
    if (editions.length > 0) {
      console.log('Fetched all editions successfully:', editions); // Log fetched editions
    } else {
      console.log('No editions found');
    }
    res.status(200).json(editions);
  } catch (error) {
    console.error('Error fetching editions:', error.message, error.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
