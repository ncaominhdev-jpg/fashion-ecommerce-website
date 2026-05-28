const connection = require('../database');
const { DataTypes } = require('sequelize');


const Product = connection.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    sale_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    visibility: {
        type: DataTypes.ENUM('visible', 'hidden'),
        defaultValue: 'visible'
    },
    featured: {
        type: DataTypes.ENUM('normal', 'featured'),
        defaultValue: 'normal'
    },
    stock: {
        type: DataTypes.INTEGER
    },
    category_id: {
        type: DataTypes.INTEGER
    },
    brand_id: {
        type: DataTypes.INTEGER
    },
    target_group_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'products',
    timestamps: true
});



module.exports = Product;
