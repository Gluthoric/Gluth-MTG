## server/index.js
{{
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
    const { sequelize } = await import('./models/index.js');
    await sequelize.authenticate();

    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database:', err.message, err.stack);
  }
})();

}}

## server/middleware/validateQuantity.js
{{
const validateQuantity = (req, res, next) => {
    const { quantity } = req.body;
  
    // Detailed logging of request body
    console.log('Request Body:', req.body);
  
    // Check if quantity is an object
    if (typeof quantity !== 'object' || quantity === null) {
      console.error('Invalid quantity object:', JSON.stringify(quantity));
      return res.status(400).json({ error: 'Invalid quantity. Quantity must be an object with non-negative numbers for foil and nonfoil.' });
    }
  
    // Check if both foil and nonfoil are non-negative numbers
    const { foil, nonfoil } = quantity;
    if (typeof foil !== 'number' || foil < 0 || typeof nonfoil !== 'number' || nonfoil < 0) {
      console.error('Invalid quantity values:', JSON.stringify(quantity));
      return res.status(400).json({ error: 'Invalid quantity. Both foil and nonfoil must be non-negative numbers.' });
    }
  
    next();
  };
  
  export default validateQuantity;
  
}}

## server/models/kiosk.js
{{

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Kiosk = sequelize.define('Kiosk', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  card_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Card',
      key: 'card_id',
    },
  },
  quantity_foil: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  quantity_nonfoil: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'kiosk',
  timestamps: false,
});

export default Kiosk;

}}

## server/models/collection.js
{{
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Collection = sequelize.define('Collection', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  card_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Card',
      key: 'card_id',
    },
  },
  quantity_foil: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  quantity_nonfoil: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'collections',
  timestamps: false,
});



export default Collection;

}}

## server/models/index.js
{{
import { Sequelize } from 'sequelize';
import sequelize from '../config/database.js';

import Edition from './edition.js';
import Card from './card.js';
import Collection from './collection.js';
import Kiosk from './kiosk.js';

// Initialize relationships
Edition.hasMany(Card, { foreignKey: 'edition_id' });
Card.belongsTo(Edition, { foreignKey: 'edition_id' });

Card.hasMany(Collection, { foreignKey: 'card_id' });
Collection.belongsTo(Card, { foreignKey: 'card_id' });

Card.hasMany(Kiosk, { foreignKey: 'card_id' });
Kiosk.belongsTo(Card, { foreignKey: 'card_id' });

export { sequelize, Edition, Card, Collection, Kiosk };
}}

## server/models/card.js
{{
import { DataTypes, Model } from 'sequelize';
import sequelize from './index.js';

class Card extends Model {}

Card.init({
  id: {
    type: DataTypes.STRING(50),
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  set_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  collector_number: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  scryfall_id: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  oracle_text: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type_line: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  mana_cost: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  cmc: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  power: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  toughness: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  rarity: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  colors: {
    type: DataTypes.JSON,
    allowNull: true
  },
  color_identity: {
    type: DataTypes.JSON,
    allowNull: true
  },
  set_code: {
    type: DataTypes.STRING(36),
    allowNull: true
  },
  released_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  edition_id: {
    type: DataTypes.STRING(36),
    allowNull: true
  },
  price_nonfoil: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  price_foil: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  quantity_foil: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  quantity_nonfoil: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'Card',
  tableName: 'cards',
  timestamps: false
});

export default Card;

}}

## server/models/edition.js
{{
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Edition = sequelize.define('Edition', {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  released_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  set_type: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  card_count: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  digital: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  nonfoil_only: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  foil_only: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  icon_svg_uri: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'editions',
  timestamps: false,
});

export default Edition;

}}

## server/routes/cards.js
{{
import express from 'express';
import { Card } from '../models/index.js';

const router = express.Router();

// PATCH /cards/:id - Update the quantity of a specific card
router.patch('/cards/:id', async (req, res) => {
  const { id } = req.params;
  const { price_nonfoil, price_foil, quantity_foil, quantity_nonfoil } = req.body;

  try {
    const card = await Card.findByPk(id);
    if (!card) {
      console.error();
      return res.status(404).json({ error: 'Card not found' });
    }

    // Apply updates
    card.price_nonfoil = price_nonfoil;
    card.price_foil = price_foil;
    card.quantity_foil = quantity_foil;
    card.quantity_nonfoil = quantity_nonfoil;
    await card.save();

    console.log();
    res.status(200).json(card);
  } catch (error) {
    console.error(, error.message, error.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

}}

## server/routes/editions.js
{{
import express from 'express';
import Edition from '../models/edition.js';

const router = express.Router();

// GET /editions - Fetch all editions
router.get('/', async (req, res) => {
  try {
    const editions = await Edition.findAll({
      attributes: ['id', 'name', 'icon_svg_uri'] // Include icon_svg_uri in the response
    });
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
}}

## server/config/database.js
{{
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err.message, err.stack);
  });

export default sequelize;

}}

## src/App.jsx
{{
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import './App.css';
import { Container } from 'react-bootstrap';
import { CardProvider } from './context/CardContext';
import logToFile from './utils/logger.js';

logToFile('App.jsx: Rendering started');
console.log('App.jsx: Rendering started');

function App() {
  return (
    <CardProvider>
      <div className='app-container' style={{ width: '100%', height: '100%' }}>
        <NavigationBar />
        <Container className='content-container' style={{ width: '100%', height: '100%' }}>
          <h1>react-gluth-mtg</h1>
          <Outlet />
        </Container>
      </div>
    </CardProvider>
  );
}

logToFile('App.jsx: Rendering completed');
console.log('App.jsx: Rendering completed');

export default App;

}}

## src/config.js
{{
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SortingFilteringControls from '../components/SortingFilteringControls';
import { Card as BootstrapCard, Form } from 'react-bootstrap';

const Kiosk = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('');
  const [filterOption, setFilterOption] = useState('');

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get('http://localhost:3000/kiosk');
        let fetchedCards = response.data;

        // Apply initial sorting and filtering
        fetchedCards = applySortingFiltering(fetchedCards, sortOption, filterOption);

        setCards(fetchedCards);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        console.error('Error fetching cards:', err.message, err.stack);
      }
    };

    fetchCards();
  }, [sortOption, filterOption]);

  const applySortingFiltering = (cards, sort, filter) => {
    let filteredCards = cards;

    // Filtering
    if (filter === 'owned') {
      filteredCards = cards.filter(card => card.quantity > 0);
    } else if (filter === 'unowned') {
      filteredCards = cards.filter(card => card.quantity === 0);
    }

    // Sorting
    if (sort === 'name') {
      filteredCards.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'quantity') {
      filteredCards.sort((a, b) => b.quantity - a.quantity);
    }

    return filteredCards;
  };

  const handleUpdateQuantity = async (cardId, newQuantity) => {
    try {
      const updatedCard = await axios.patch(`http://localhost:3000/cards/${cardId}`, { quantity: newQuantity });
      setCards(cards.map(card => (card.id === cardId ? updatedCard.data : card)));
      console.log(`Updated quantity for card ${cardId} to ${newQuantity}`);
    } catch (err) {
      console.error('Error updating quantity:', err.message, err.stack);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Kiosk Page</h2>
      <SortingFilteringControls
        sortOption={sortOption}
        filterOption={filterOption}
        onSortChange={setSortOption}
        onFilterChange={setFilterOption}
      />
      <div className="card-grid">
        {cards.map(card => (
          <BootstrapCard
            key={card.id}
            className={`card-item ${card.quantity > 0 ? 'owned' : 'unowned'}`}
          >
            <BootstrapCard.Body>
              <BootstrapCard.Title>{card.name}</BootstrapCard.Title>
              <Form>
                <Form.Group controlId={`card-quantity-${card.id}`}>
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    value={card.quantity}
                    onChange={e => handleUpdateQuantity(card.id, parseInt(e.target.value))}
                    min="0"
                  />
                </Form.Group>
              </Form>
            </BootstrapCard.Body>
          </BootstrapCard>
        ))}
      </div>
    </div>
  );
};

export default Kiosk;
}}

## src/index.css
{{
:root {
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}


}}

## src/App.css
{{
#root {
  width: 100%;
  height: 100%;
  padding: 2rem;
  text-align: center;
}

.sorting-filtering-controls {
  margin-bottom: 1rem;
}

.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card-item {
  flex: 1 1 calc(33.333% - 1rem);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.card-item:hover {
  transform: translateY(-5px);
}

.card-item.owned {
  background-color: #d4edda;
}

.card-item.unowned {
  background-color: #f8d7da;
}

.edition-card {
  margin-bottom: 1rem;
  text-align: center;
}

.edition-card img {
  max-width: 100%;
  height: auto;
}

.edition-card .card-title {
  margin-top: 0.5rem;
  font-size: 1.2rem;
  font-weight: bold;
}
}}

## src/main.jsx
{{
// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Home from './pages/Home.jsx';
import Editions from './pages/Editions.jsx';
import Edition from './pages/Edition.jsx';
import Cards from './pages/Cards.jsx';
import Kiosk from './pages/Kiosk.jsx';
import { CardProvider } from './context/CardContext.jsx';
import logToFile from './utils/logger.js';

// Log rendering start
logToFile('main.jsx: Rendering started');
console.log('main.jsx: Rendering started');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <CardProvider>
        <Routes>
          <Route path='/' element={<App />}>
            <Route index element={<Home />} />
            <Route path='editions' element={<Editions />} />
            <Route path='editions/:id' element={<Edition />} />
            <Route path='editions/:id/cards' element={<Cards />} />
            <Route path='kiosk' element={<Kiosk />} />
          </Route>
        </Routes>
      </CardProvider>
    </Router>
  </React.StrictMode>
);

// Log rendering completion
logToFile('main.jsx: Rendering completed');
console.log('main.jsx: Rendering completed');

}}

## src/pages/Cards.jsx
{{
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Container, Row, Col } from 'react-bootstrap';
import { fetchCardsByEdition, updateCardQuantity } from '../services/cardService';
import SortingFilteringControls from '../components/SortingFilteringControls';
import { useCardContext } from '../context/CardContext';
import CardItem from '../components/CardItem';

const Cards = () => {
  const { id } = useParams();
  const { state, dispatch } = useCardContext();
  const { cards, sortOption, filterOption, loading, error } = state;

  useEffect(() => {
    const fetchCards = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const cardsData = await fetchCardsByEdition(id);
        dispatch({ type: 'SET_CARDS', payload: cardsData });
        console.log('Fetched cards successfully:', cardsData);
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err });
        console.error('Error fetching cards:', err.message, err.stack);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchCards();
  }, [id, dispatch]);

  const handleUpdateQuantity = async (cardId, type, newQuantity) => {
    try {
      const card = cards.find(card => card.id === cardId);
      const updatedQuantity = {
        ...JSON.parse(card.quantity),
        [type]: newQuantity
      };
      const updatedCard = await updateCardQuantity(cardId, JSON.stringify(updatedQuantity));
      dispatch({ type: 'UPDATE_CARD_QUANTITY', payload: { id: cardId, [type === 'foil' ? 'quantity_foil' : 'quantity_nonfoil']: newQuantity } });
      console.log(`Updated ${type} quantity for card ${cardId} to ${newQuantity}`);
    } catch (err) {
      console.error('Error updating quantity:', err.message, err.stack);
    }
  };

  const handleSortChange = (option) => {
    dispatch({ type: 'SET_SORT_OPTION', payload: option });
    const sortedCards = [...cards].sort((a, b) => {
      if (option === 'name') {
        return a.name.localeCompare(b.name);
      } else if (option === 'quantity') {
        return (b.quantity_foil + b.quantity_nonfoil) - (a.quantity_foil + a.quantity_nonfoil);
      }
      return 0;
    });
    dispatch({ type: 'SET_CARDS', payload: sortedCards });
  };

  const handleFilterChange = (option) => {
    dispatch({ type: 'SET_FILTER_OPTION', payload: option });
    const filteredCards = cards.filter(card => {
      if (option === 'owned') {
        return (card.quantity_foil + card.quantity_nonfoil) > 0;
      } else if (option === 'unowned') {
        return (card.quantity_foil + card.quantity_nonfoil) === 0;
      }
      return true;
    });
    dispatch({ type: 'SET_CARDS', payload: filteredCards });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container>
      <h2>Edition {id} Cards</h2>
      <SortingFilteringControls
        sortOption={sortOption}
        filterOption={filterOption}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
      />
      <Row className="card-grid">
        {cards.map(card => (
          <Col key={card.id} xs={12} sm={6} md={4} className={`card-item ${(card.quantity_foil + card.quantity_nonfoil) > 0 ? 'owned' : 'unowned'}`}>
            <CardItem card={card} handleUpdateQuantity={handleUpdateQuantity} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Cards;

}}

## src/pages/Home.jsx
{{
import React from 'react';
import { Container } from 'react-bootstrap';
import logToFile from '../utils/logger.js';

logToFile('Home.jsx: Rendering started');
console.log('Home.jsx: Rendering started');

const Home = () => {
  return (
    <Container>
      <h2>Home Page</h2>
      <p>Welcome to the MTG Collection Tracker!</p>
    </Container>
  );
};

logToFile('Home.jsx: Rendering completed');
console.log('Home.jsx: Rendering completed');

export default Home;

}}

## src/pages/Kiosk.jsx
{{
// src/pages/Kiosk.jsx

import React, { useEffect } from 'react';
import axios from 'axios';
import { Card as BootstrapCard, Form, Container, Row, Col } from 'react-bootstrap';
import SortingFilteringControls from '../components/SortingFilteringControls';
import { useCardContext } from '../context/CardContext';
import CardItem from '../components/CardItem';

const Kiosk = () => {
  const { state, dispatch } = useCardContext();
  const { cards, sortOption, filterOption, loading, error } = state;

  useEffect(() => {
    const fetchCards = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        console.log('Fetching cards for kiosk');
        const response = await axios.get('http://localhost:3000/kiosk');
        let fetchedCards = response.data;

        dispatch({ type: 'SET_CARDS', payload: fetchedCards });
        console.log('Fetched cards successfully:', fetchedCards);
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err });
        console.error('Error fetching cards:', err.message, err.stack);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchCards();
  }, [dispatch]);

  const handleUpdateQuantity = async (cardId, type, newQuantity) => {
    try {
      console.log(`Updating quantity for card ${cardId} to ${newQuantity}`);
      await axios.patch(`http://localhost:3000/cards/${cardId}`, { quantity: newQuantity });
      dispatch({ type: 'UPDATE_CARD_QUANTITY', payload: { id: cardId, [type === 'foil' ? 'quantity_foil' : 'quantity_nonfoil']: newQuantity } });
      console.log(`Updated ${type} quantity for card ${cardId} to ${newQuantity}`);
    } catch (err) {
      console.error('Error updating quantity:', err.message, err.stack);
    }
  };

  const handleSortChange = (option) => {
    dispatch({ type: 'SET_SORT_OPTION', payload: option });
    const sortedCards = [...cards].sort((a, b) => {
      if (option === 'name') {
        return a.name.localeCompare(b.name);
      } else if (option === 'quantity') {
        return (b.quantity_foil + b.quantity_nonfoil) - (a.quantity_foil + a.quantity_nonfoil);
      }
      return 0;
    });
    dispatch({ type: 'SET_CARDS', payload: sortedCards });
  };

  const handleFilterChange = (option) => {
    dispatch({ type: 'SET_FILTER_OPTION', payload: option });
    const filteredCards = cards.filter(card => {
      if (option === 'owned') {
        return (card.quantity_foil + card.quantity_nonfoil) > 0;
      } else if (option === 'unowned') {
        return (card.quantity_foil + card.quantity_nonfoil) === 0;
      }
      return true;
    });
    dispatch({ type: 'SET_CARDS', payload: filteredCards });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container>
      <h2>Kiosk Page</h2>
      <SortingFilteringControls
        sortOption={sortOption}
        filterOption={filterOption}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
      />
      <Row className="card-grid">
        {cards.map(card => (
          <Col key={card.id} xs={12} sm={6} md={4} className={`card-item ${(card.quantity_foil + card.quantity_nonfoil) > 0 ? 'owned' : 'unowned'}`}>
            <CardItem card={card} handleUpdateQuantity={handleUpdateQuantity} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Kiosk;

}}

## src/pages/Editions.jsx
{{
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Alert, Row, Col } from 'react-bootstrap';
import { useCardContext } from '../context/CardContext';
import EditionCard from '../components/EditionCard';

const Editions = () => {
  const { state, dispatch } = useCardContext();
  const { cards } = state;
  const [editions, setEditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEditions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/editions'); // Update the URL to match the backend
        setEditions(response.data);
        setLoading(false);
        console.log('Fetched editions successfully:', response.data);
      } catch (err) {
        setError(err);
        setLoading(false);
        console.error('Error fetching editions:', err.message, err.stack);
      }
    };

    fetchEditions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <Alert variant="danger">Error: {error.message}</Alert>;
  }

  return (
    <Container>
      <h2>Editions Page</h2>
      <p>Here you can see all the editions.</p>
      <Row>
        {editions.map((edition) => (
          <Col key={edition.id} xs={12} sm={6} md={4} lg={3}>
            <EditionCard
              id={edition.id}
              name={edition.name}
              iconSvgUri={edition.icon_svg_uri}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Editions;

}}

## src/pages/Edition.jsx
{{
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Alert, Row, Col } from 'react-bootstrap';
import { useCardContext } from '../context/CardContext';
import axios from 'axios';
import CardItem from '../components/CardItem';

const Edition = () => {
  const { id } = useParams();
  const { state, dispatch } = useCardContext();
  const { cards, loading, error } = state;

  useEffect(() => {
    const fetchCards = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        console.log(`Fetching cards for edition ${id}`);
        const response = await axios.get(`http://localhost:3000/editions/${id}/cards`);
        dispatch({ type: 'SET_CARDS', payload: response.data });
        console.log("Fetched cards data:", response.data);
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err });
        console.error(`Error fetching cards for edition ${id}:`, err.message, err.stack);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchCards();
  }, [id, dispatch]);

  const handleUpdateQuantity = async (cardId, newQuantity) => {
    try {
      console.log(`Updating quantity for card ${cardId} to ${newQuantity}`);
      const updatedCard = await axios.patch(`http://localhost:3000/cards/${cardId}`, { quantity: newQuantity });
      dispatch({ type: 'UPDATE_CARD_QUANTITY', payload: { id: cardId, quantity: newQuantity } });
      console.log(`Updated quantity for card ${cardId} to ${newQuantity}`);
    } catch (err) {
      console.error('Error updating quantity:', err.message, err.stack);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <Alert variant="danger">Error: {error.message}</Alert>;
  }

  return (
    <Container fluid>
      <h2>Edition {id} Cards</h2>
      <Row className="card-grid">
        {cards.map((card) => (
          <Col key={card.id} xs={12} sm={6} md={4}>
            <CardItem card={card} handleUpdateQuantity={handleUpdateQuantity} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Edition;
}}

## src/utils/extractPrices.js
{{
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // API base URL

export const extractPrices = (cards) => {
  return cards.map(card => {
    try {
      const prices = card.prices ? JSON.parse(card.prices) : {};
      const usdPrice = prices.usd;
      const usdFoilPrice = prices.usd_foil;

      const quantity = card.quantity ? JSON.parse(card.quantity) : {};
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
      console.error('Error parsing prices or quantities JSON:', error);
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

}}

## src/utils/sortingFiltering.js
{{
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Container, Row, Col } from 'react-bootstrap';
import { fetchCardsByEdition, updateCardQuantity } from '../services/cardService';
import SortingFilteringControls from '../components/SortingFilteringControls';
import { useCardContext } from '../context/CardContext';
import CardItem from '../components/CardItem';

const Cards = () => {
  const { id } = useParams();
  const { state, dispatch } = useCardContext();
  const { cards, sortOption, filterOption, loading, error } = state;

  useEffect(() => {
    const fetchCards = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const cardsData = await fetchCardsByEdition(id);
        dispatch({ type: 'SET_CARDS', payload: cardsData });
        console.log('Fetched cards successfully:', cardsData);
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err });
        console.error('Error fetching cards:', err.message, err.stack);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchCards();
  }, [id, dispatch]);

  const handleUpdateQuantity = async (cardId, type, newQuantity) => {
    try {
      const updatedCard = await updateCardQuantity(cardId, newQuantity);
      dispatch({ type: 'UPDATE_CARD_QUANTITY', payload: { id: cardId, [type === 'foil' ? 'quantity_foil' : 'quantity_nonfoil']: newQuantity } });
      console.log(`Updated ${type} quantity for card ${cardId} to ${newQuantity}`);
    } catch (err) {
      console.error('Error updating quantity:', err.message, err.stack);
    }
  };

  const handleSortChange = (option) => {
    dispatch({ type: 'SET_SORT_OPTION', payload: option });
    // Implement sorting logic based on the selected option
    const sortedCards = [...cards].sort((a, b) => {
      if (option === 'name') {
        return a.name.localeCompare(b.name);
      } else if (option === 'quantity') {
        return (b.quantity_foil + b.quantity_nonfoil) - (a.quantity_foil + a.quantity_nonfoil);
      }
      return 0;
    });
    dispatch({ type: 'SET_CARDS', payload: sortedCards });
  };

  const handleFilterChange = (option) => {
    dispatch({ type: 'SET_FILTER_OPTION', payload: option });
    // Implement filtering logic based on the selected option
    const filteredCards = cards.filter(card => {
      if (option === 'owned') {
        return (card.quantity_foil + card.quantity_nonfoil) > 0;
      } else if (option === 'unowned') {
        return (card.quantity_foil + card.quantity_nonfoil) === 0;
      }
      return true;
    });
    dispatch({ type: 'SET_CARDS', payload: filteredCards });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container>
      <h2>Edition {id} Cards</h2>
      <SortingFilteringControls
        sortOption={sortOption}
        filterOption={filterOption}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
      />
      <Row className="card-grid">
        {cards.map(card => (
          <Col key={card.id} xs={12} sm={6} md={4} className={`card-item ${(card.quantity_foil + card.quantity_nonfoil) > 0 ? 'owned' : 'unowned'}`}>
            <CardItem card={card} handleUpdateQuantity={handleUpdateQuantity} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Cards;
}}

## src/utils/logger.js
{{
// src/utils/logger.js

const logToFile = (message) => {
  const logMessage = new Date().toISOString() + ' - ' + message;
  console.log(logMessage);
};

export default logToFile;

}}

## src/components/Navbar.jsx
{{
import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logToFile from '../utils/logger.js';

logToFile('Rendering Navbar.jsx');
console.log('Rendering Navbar.jsx');

const NavigationBar = () => {
  return (
    <Navbar bg='dark' variant='dark' expand='lg'>
      <Navbar.Brand as={Link} to='/'>
        MTG Collection Tracker
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Navbar.Collapse id='basic-navbar-nav'>
        <Nav className='mr-auto'>
          <Nav.Link as={Link} to='/'>Home</Nav.Link>
          <Nav.Link as={Link} to='/editions'>Editions</Nav.Link>
          <Nav.Link as={Link} to='/kiosk'>Kiosk</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;

}}

## src/components/CardItem.jsx
{{
import React from 'react';
import { Card as BootstrapCard, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

const CardItem = ({ card, handleUpdateQuantity }) => {
  const { id, name, image_url, quantity_foil, quantity_nonfoil, price_foil, price_nonfoil } = card;

  return (
    <BootstrapCard className={`card-item ${(quantity_foil + quantity_nonfoil) > 0 ? 'owned' : 'unowned'}`}>
      <BootstrapCard.Body>
        <BootstrapCard.Title>{name}</BootstrapCard.Title>
        <img src={image_url} alt={name} style={{ width: '100%' }} />
        <Form>
          <Form.Group controlId={`card-quantity-foil-${id}`}>
            <Form.Label>Foil Quantity</Form.Label>
            <Form.Control
              type="number"
              value={quantity_foil}
              onChange={e => handleUpdateQuantity(id, 'foil', parseInt(e.target.value))}
              min="0"
            />
          </Form.Group>
          <Form.Group controlId={`card-quantity-nonfoil-${id}`}>
            <Form.Label>Non-Foil Quantity</Form.Label>
            <Form.Control
              type="number"
              value={quantity_nonfoil}
              onChange={e => handleUpdateQuantity(id, 'nonfoil', parseInt(e.target.value))}
              min="0"
            />
          </Form.Group>
        </Form>
        <div className="card-prices">
          <p>Foil Price: ${price_foil}</p>
          <p>Non-Foil Price: ${price_nonfoil}</p>
        </div>
      </BootstrapCard.Body>
    </BootstrapCard>
  );
};

CardItem.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image_url: PropTypes.string,
    quantity_foil: PropTypes.number,
    quantity_nonfoil: PropTypes.number,
    price_foil: PropTypes.number,
    price_nonfoil: PropTypes.number,
  }).isRequired,
  handleUpdateQuantity: PropTypes.func.isRequired,
};

export default CardItem;

}}

## src/components/EditionCard.jsx
{{
import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const EditionCard = ({ id, name, iconSvgUri }) => {
  return (
    <Card className="edition-card">
      <Card.Body>
        <Link to={`/editions/${id}/cards`}>
          <Card.Img variant="top" src={iconSvgUri} alt={`${name} set symbol`} />
          <Card.Title>{name}</Card.Title>
        </Link>
      </Card.Body>
    </Card>
  );
};

EditionCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  iconSvgUri: PropTypes.string.isRequired,
};

export default EditionCard;
}}

## src/components/SortingFilteringControls.jsx
{{
import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useCardContext } from '../context/CardContext';

const SortingFilteringControls = () => {
  const { state, dispatch } = useCardContext();
  const { sortOption, filterOption } = state;

  const handleSortChange = (e) => {
    dispatch({ type: 'SET_SORT_OPTION', payload: e.target.value });
  };

  const handleFilterChange = (e) => {
    dispatch({ type: 'SET_FILTER_OPTION', payload: e.target.value });
  };

  return (
    <div className="sorting-filtering-controls">
      <Row>
        <Col>
          <Form.Group controlId="sortOptions">
            <Form.Label>Sort By</Form.Label>
            <Form.Control
              as="select"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="">Select...</option>
              <option value="name">Name</option>
              <option value="quantity">Quantity</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="filterOptions">
            <Form.Label>Filter By</Form.Label>
            <Form.Control
              as="select"
              value={filterOption}
              onChange={handleFilterChange}
            >
              <option value="">Select...</option>
              <option value="owned">Owned</option>
              <option value="unowned">Unowned</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
};

export default SortingFilteringControls;
}}

## src/assets/.gitkeep
{{

}}

## src/context/CardContext.jsx
{{
import React, { createContext, useReducer, useContext } from 'react';

const CardContext = createContext();

const initialState = {
  cards: [],
  sortOption: '',
  filterOption: '',
  loading: true,
  error: null,
};

const cardReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CARDS':
      return { ...state, cards: action.payload, loading: false, error: null };
    case 'UPDATE_CARD_QUANTITY':
      return {
        ...state,
        cards: state.cards.map(card =>
          card.id === action.payload.id
            ? { ...card, quantity_foil: action.payload.quantity_foil, quantity_nonfoil: action.payload.quantity_nonfoil }
            : card
        ),
      };
    case 'SET_SORT_OPTION':
      return { ...state, sortOption: action.payload };
    case 'SET_FILTER_OPTION':
      return { ...state, filterOption: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const CardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cardReducer, initialState);

  return (
    <CardContext.Provider value={{ state, dispatch }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCardContext = () => useContext(CardContext);

}}

## src/services/cardService.js
{{
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

}}

