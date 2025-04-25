const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);

// Protected routes
router.post('/products', auth, upload.array('images', 5), productController.createProduct);
router.get('/user/products', auth, productController.getUserProducts);
router.put('/products/:id', auth, upload.array('images',5), productController.updateProduct);
router.delete('/products/:id', auth, productController.deleteProduct);

module.exports = router;