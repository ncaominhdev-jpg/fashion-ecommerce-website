const connection = require('../database');
const { DataTypes } = require('sequelize');
const User = require ('./usersModel')
const Address = require ('./addressModel')
const Order = connection.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER
  },
  address_id: {
    type: DataTypes.INTEGER
  },
  order_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('pending', 'shipped', 'delivered', 'canceled'),
    defaultValue: 'pending'
  },
  note: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'orders',
  timestamps: true
});
// Định nghĩa mối quan hệ: một đơn hàng thuộc về một người dùng (user)
Order.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'userOrder' // Alias của mối quan hệ
});

// Định nghĩa mối quan hệ: một đơn hàng thuộc về một địa chỉ (address)
Order.belongsTo(Address, {
  foreignKey: 'address_id',
  as: 'orderAddress' // Alias của mối quan hệ
});
module.exports = Order;