const connection = require('../database');
const { DataTypes } = require('sequelize');

const ShoesSize = connection.define('ShoesSize', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  size_label: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'size',
  timestamps: true
});

module.exports = ShoesSize;