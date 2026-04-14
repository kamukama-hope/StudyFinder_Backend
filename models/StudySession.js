/**
 * StudySession model
 * - stores scheduled sessions for a study group
 * - includes topic, date, and optional location
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudySession = sequelize.define('StudySession', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    groupId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    sessionDate: {
        type: DataTypes.DATEONLY, // Using DATEONLY for just the date
        allowNull: false
    },
    sessionTime: {
        type: DataTypes.STRING,
        allowNull: false
    },
    topic: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'sessions',
    timestamps: true
});

module.exports = StudySession;