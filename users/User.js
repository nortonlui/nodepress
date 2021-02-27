const Sequelize = require('sequelize');
const connection = require('../database/database');

const User = connection.define('users', {
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }

});

// Force create table
User.sync({force: false});

module.exports = User;
