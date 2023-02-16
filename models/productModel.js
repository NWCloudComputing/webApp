const sequelize = require('../db');
const {Sequelize, Model, DataTypes} = require('sequelize');

const products = sequelize.define('Product',{
    id: {        
        primaryKey:true,
        autoIncrement:true,
        type: DataTypes.INTEGER
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    sku:{type:DataTypes.STRING} ,
    manufacturer: DataTypes.STRING,
    quantity:{type:DataTypes.INTEGER,
        validate:{min:0,max:100}},
    date_added:DataTypes.DATE,
    date_last_updated: DataTypes.DATE,
    owner_user_id:{type:DataTypes.INTEGER}
},{ tableName: 'products',timestamps:false});

module.exports = products;