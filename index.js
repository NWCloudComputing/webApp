require('dotenv').config();
const app = require('./app');
const express = require('express');
const bodyParser = require('body-parser');
const userModel = require('./models/userModel');
const productModel = require('./models/productModel');
const sequelize = require('./db');


const PORT = process.env.PORT || 3000;



userModel.sync().then((result) => {
    console.log('Users Table created');
 }).catch((error) => {
    console.log('Error in creating user table');
 });

 productModel.sync().then((result) => {
   console.log('Products Table created');
}).catch((error) => {
   console.log('Error in creating product table');
});

productModel.belongsTo(userModel, {foreignKey: 'owner_user_id'});



app.listen(PORT, () => console.log(`Server running on ${PORT}`));

