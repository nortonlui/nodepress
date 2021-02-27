const Sequelize = require('sequelize');
const connection = require('../database/database');


const Project = connection.define('projects', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    linkHeroku: {
        type: Sequelize.STRING,
        allowNull: false
    },
    linkGit: {
        type: Sequelize.STRING,
        allowNull: false
    }

});

// Force create table
Project.sync({force: false});

module.exports = Project;