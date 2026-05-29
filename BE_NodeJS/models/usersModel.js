const connection = require('../database');
const { DataTypes } = require('sequelize');

const User = connection.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'customer'),
    defaultValue: 'customer'
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;
