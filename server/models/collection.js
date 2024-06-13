
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
