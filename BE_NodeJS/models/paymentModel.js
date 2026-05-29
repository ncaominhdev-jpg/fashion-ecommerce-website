const connection = require('../database');
const { DataTypes } = require('sequelize');

const Payment = connection.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  order_id: {
    type: DataTypes.INTEGER
  },
  payment_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2)
  },
  payment_method: {
    type: DataTypes.ENUM('COD', 'Momo')
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'payment',
  timestamps: true
});

module.exports = Payment;