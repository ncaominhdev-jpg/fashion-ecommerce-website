const connection = require('../database');
const { DataTypes } = require('sequelize');
const User = require('./usersModel');  // Đảm bảo import đúng model User
const Product = require('./productsModel');  // Đảm bảo import đúng model Product

// Định nghĩa Review model
const Review = connection.define('Review', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER
    },
    product_id: {
        type: DataTypes.INTEGER
    },
    rating: {
        type: DataTypes.INTEGER
    },
    comment: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'reviews',
    timestamps: true
});

// Đảm bảo mối quan hệ giữa Review và User, Product
Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Review.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

module.exports = Review;
