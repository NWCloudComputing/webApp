require('dotenv').config();
const app = require('./app');
const express = require('express');
const bodyParser = require('body-parser');
const userModel = require('./models/userModel');
const sequelize = require('./db');
//const seq = require('sequelize');

//const app = express();

const PORT = process.env.PORT || 3000;

// sequelize.authenticate().then(() => {
//     console.log('connection established');
// }).catch((error) => {
//     console.log(error);
//     console.log('error in establishing connection');
// })

userModel.sync().then((result) => {
    console.log('Table created');
 }).catch((error) => {
    console.log('Error in creating table');
 });



app.listen(PORT, () => console.log(`Server running on ${PORT}`));

// pool.connect((err) => {
//     try {
        // const createUsersTable = `CREATE TABLE IF NOT EXISTS public.users( \
        //     id UUID NOT NULL, \
        //     username VARCHAR(80), \
        //     password VARCHAR(100), \
        //     first_name VARCHAR(40), \
        //     last_name VARCHAR(40), \
        //     account_created timestamp with time zone, \
        //     account_updated timestamp with time zone,  \
        //     PRIMARY KEY (id) \
        // );`
        
        // pool.query(createUsersTable, (error, results) => {
        //     console.log('User Table created.');
        // })

//         users.sync().then((result) => {
//             console.log('Table created');
//         });
        
//     } catch (err) {
//         console.error(err);
//     }
// });