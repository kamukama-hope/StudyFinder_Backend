/**
 * GroupMember model
 * - joins users to groups
 * - tracks membership with groupId and userId
 * - createdAt is renamed to joinedAt for membership timestamp tracking
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GroupMember = sequelize.define('GroupMember', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    groupId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    }
}, {
    tableName: 'group_members',
    timestamps: true,
    updatedAt: false, // Only joinedAt (createdAt) is needed usually, but Database.sql doesn't have updatedAt
    createdAt: 'joinedAt'
});

module.exports = GroupMember;
