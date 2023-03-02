const sequelize = require('../db');
const {Sequelize, Model, DataTypes} = require('sequelize');

const images = sequelize.define('Image',{
    image_id: {        
        primaryKey:true,
        autoIncrement:true,
        type: DataTypes.INTEGER,
    },
    date_created: {
        type: DataTypes.STRING
    },
    product_id: {
        type: DataTypes.INTEGER
    },
    s3_bucket_path: {
        type: DataTypes.STRING
    },
    file_name: {
        type: DataTypes.STRING
    }

},{ tableName: 'images',timestamps:false});

module.exports = images;