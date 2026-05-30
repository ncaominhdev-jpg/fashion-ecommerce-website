const connection = require('../database');
const { DataTypes } = require('sequelize');
const ProductVariant = require('./productVariantsModel');

const OrderDetail = connection.define('OrderDetail', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  order_id: {
    type: DataTypes.INTEGER
  },
  variant_id: {
    type: DataTypes.INTEGER
  },
  quantity: {
    type: DataTypes.INTEGER
  },
  price: {
    type: DataTypes.DECIMAL(10, 2)
  }
}, {
  tableName: 'order_details',
  timestamps: true
});

OrderDetail.belongsTo(ProductVariant, {
  foreignKey: 'variant_id',
  as: 'variant'
});

module.exports = OrderDetail;
