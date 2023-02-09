const express = require('express');
const productRouter = express.Router();

const productController = require('../controllers/product');

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

module.exports = productRouter;