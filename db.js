const { Pool } = require('pg');

const {Sequelize} = require('sequelize');

// const pool = new Pool({
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
// });

const sequelize = new Sequelize("csye6225", process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "postgres",
  port:"5432",
});


// pool.connect()
//   .then(() => console.log('Connected to the PostgreSQL database'))
//   .catch(err => console.error('Failed to connect to the PostgreSQL database', err));


  module.exports = sequelize;
