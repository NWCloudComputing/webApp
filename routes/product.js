const express = require('express');
const productRouter = express.Router();

const productController = require('../controllers/productController');
const imageController = require('../controllers/imageController');

const multer = require("multer");

const upload = multer({dest: "uploads/"})

productRouter.route('/')
    .get(productController.getHealth);

productRouter.route('/')
    .post(productController.createProduct);

productRouter.route('/:productId')
    .get(productController.getProduct);

productRouter.route('/:productId')
    .put(productController.updateProduct);

productRouter.route('/:productId')
    .patch(productController.editProduct);

productRouter.route('/:productId')
    .delete(productController.deleteProduct);

//image routes


productRouter.route('/:productId/image')
    .get( imageController.getAllProductImages);

productRouter.route('/:productId/image/:imageId')
    .get( imageController.getProductImage);

productRouter.route('/:productId/image')
    .post(upload.single("file"), imageController.createProductImage);

productRouter.route('/:productId/image/:imageId')
    .delete( imageController.deleteProductImage);



module.exports = productRouter;