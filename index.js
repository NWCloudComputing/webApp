require('dotenv').config();
const app = require('./app');
const express = require('express');
const bodyParser = require('body-parser');
const userModel = require('./models/userModel');
const productModel = require('./models/productModel');
const imageModel = require('./models/imageModel');
const sequelize = require('./db');
const fileUpload = require('express-fileupload');
const AWS = require('aws-sdk');
//AWS.config.update({region:'us-east-1'})
//var app = express();
//app.use(json)
app.use(fileUpload({
    limits:{fileSize:50 * 1024 *1024},
}))



const PORT = process.env.PORT || 3000;

s3 = new AWS.S3({});

// const SESConfig = {
//    apiVersion: "2010-12-01",
//    profile:process.env.AWS_PROFILE,
//    accessKeyId: process.env.AWS_ACCESS_KEY,
//    accessSecretKey: process.env.AWS_SECRET,
//    region: "us-east-1"
// }


//AWS.config.update(SESConfig);

userModel.sync().then((result) => {
   console.log('Users Table created');
   productModel.sync().then((result) => {
     productModel.belongsTo(userModel, {foreignKey: 'owner_user_id'});
     console.log('Products Table created');
     imageModel.sync().then((result) => {
      console.log('Image table created')
     }).catch((error) => {
      console.log('Error in creating Image table');
     })
  }).catch((error) => {
     console.log('Error in creating product table');
  });
}).catch((error) => {
   console.log('Error in creating user table');
 });

productModel.belongsTo(userModel, {foreignKey: 'owner_user_id'});



app.listen(PORT, () => console.log(`Server running on ${PORT}`));

