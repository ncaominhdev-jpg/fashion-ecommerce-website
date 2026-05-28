const connection = require('../database');
const { DataTypes } = require('sequelize');

const Cart = connection.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER
  },
  variant_id: {
    type: DataTypes.INTEGER
  },
  quantity: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'cart',
  timestamps: true
});

module.exports = Cart;