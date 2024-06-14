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
