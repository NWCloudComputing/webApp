const sequelize = require('../db');
const {Sequelize, Model, DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {
        primaryKey: true,
        autoIncrement:true,
        type: DataTypes.INTEGER,
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    account_created:DataTypes.DATE,
    account_updated: DataTypes.DATE,
},{ tableName: 'users',timestamps:false});

module.exports = User;