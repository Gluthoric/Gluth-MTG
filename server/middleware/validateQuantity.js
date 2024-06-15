const validateQuantity = (req, res, next) => {
  const { quantity } = req.body;

  // Check if quantity is an object
  if (typeof quantity !== 'object' || quantity === null) {
    console.error('Invalid quantity:', quantity);
    return res.status(400).json({ error: 'Invalid quantity. Quantity must be an object with non-negative numbers for foil and nonfoil.' });
  }

  // Check if both foil and nonfoil are non-negative numbers
  const { foil, nonfoil } = quantity;
  if (typeof foil !== 'number' || foil < 0 || typeof nonfoil !== 'number' || nonfoil < 0) {
    console.error('Invalid quantity:', quantity);
    return res.status(400).json({ error: 'Invalid quantity. Both foil and nonfoil must be non-negative numbers.' });
  }

  next();
};

export default validateQuantity;
