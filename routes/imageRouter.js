const express = require('express');
const imageRouter = express.Router();

//const productController = require('../controllers/productController');
const imageController = require('../controllers/imageController');

imageRouter.route('/')
    .get(imageController.getAllProductImages);

imageRouter.route('/:imageId')
    .get(imageController.getProductImage);

imageRouter.route('/')
    .post(imageController.createProductImage);

imageRouter.route('/:imageId')
    .delete(imageController.deleteProductImage);


module.exports = imageRouter;