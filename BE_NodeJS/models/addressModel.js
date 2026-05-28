const connection = require('../database');
const { DataTypes } = require('sequelize');

const Address = connection.define('Address', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    recipient_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    note: {
        type: DataTypes.TEXT
    },
    detail: { // <-- Thêm ở đây
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    tableName: 'addresses',
    timestamps: true
});


module.exports = Address;
