
import express from 'express';
import cors from 'cors';
import editionsRoutes from './routes/editions.js';
import cardsRoutes from './routes/cards.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS middleware
const corsOptions = {
  origin: 'http://localhost:5173', // Update this to match the frontend's origin
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  try {
    res.status(200).send('Server is running');
  } catch (error) {
    console.error('Error handling root URL request:', error.message, error.stack);
    res.status(500).send('Internal Server Error');
  }
});

// Use the editions and cards routes
app.use('/editions', editionsRoutes);
app.use('/', cardsRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message, err.stack);
  res.status(500).send('Internal Server Error');
});

// Dynamically import Sequelize configuration and start server
(async () => {
  try {
    const { default: sequelize } = await import('./config/database.js');
    await sequelize.authenticate();
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database:', err.message, err.stack);
  }
})();
