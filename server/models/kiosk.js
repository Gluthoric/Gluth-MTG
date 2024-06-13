
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
