const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Group = sequelize.define('Group', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    groupName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    courseName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    courseCode: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    faculty: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    meetingLocation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    meetingType: {
        type: DataTypes.ENUM('physical', 'online', 'hybrid'),
        defaultValue: 'physical'
    },
    leaderId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'groups',
    timestamps: true
});

module.exports = Group;
