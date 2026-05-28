const connection = require('../database');
const { DataTypes } = require('sequelize');

const ShoesColor = connection.define('ShoesColor', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true, primaryKey: true
  },
  color_name: {
    type: DataTypes.STRING
  },
  color_code: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'color',
  timestamps: true
});

module.exports = ShoesColor;