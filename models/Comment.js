/**
 * Comment model
 * - stores comments on posts
 * - links each comment to a post and its author
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    postId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    authorId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'comments',
    timestamps: true
});

module.exports = Comment;