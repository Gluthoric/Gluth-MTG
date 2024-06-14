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