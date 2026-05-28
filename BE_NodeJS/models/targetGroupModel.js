const connection = require('../database');
const { DataTypes } = require('sequelize');

const TargetGroup = connection.define('TargetGroup', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    label: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'target_groups',
    timestamps: true
});

module.exports = TargetGroup;
