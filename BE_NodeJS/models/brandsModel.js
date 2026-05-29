const connection = require('../database');
const { DataTypes } = require('sequelize');

const Brand = connection.define('Brand', {
    id: 
    {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: 
    {
        type: DataTypes.STRING,
        allowNull: false
    },
    logo: 
    {
        type: DataTypes.STRING
    }
}, {
    tableName: 'brands',
    timestamps: true
});

module.exports = Brand;