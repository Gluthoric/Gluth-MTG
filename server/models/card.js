
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Card = sequelize.define('Card', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  set_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  collector_number: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  scryfall_id: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true,
  },
  prices: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  quantity: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  oracle_text: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  type_line: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mana_cost: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  cmc: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  power: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  toughness: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  rarity: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  colors: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  color_identity: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  set_code: {
    type: DataTypes.STRING(36),
    allowNull: true,
  },
  released_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  edition_id: {
    type: DataTypes.STRING(36),
    allowNull: true,
    references: {
      model: 'Edition',
      key: 'id',
    },
  },
}, {
  tableName: 'cards',
  timestamps: false,
});

export default Card;
