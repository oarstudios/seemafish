const express = require('express');
const router = express.Router();
const uploadProduct = require('../middlewares/uploadProduct')

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getProductsByProductTag,
    getBestsellers
} = require('../controllers/productController');

// Route to create a new product
router.post('/',uploadProduct, createProduct);

// Route to get all products
router.get('/', getAllProducts);

// Route to get a product by its ID
router.get('/:id', getProductById);

// Route to update a product by its ID
router.put('/:id',uploadProduct, updateProduct);

// Route to delete a product by its ID
router.delete('/:id', deleteProduct);

// Route to get products by category
router.get('/category/:category', getProductsByCategory);

// Route to get products by product tag
router.get('/proudctbytag/:tag', getProductsByProductTag);  

// Route to get bestsellers
router.get('/bestsellers', getBestsellers);

module.exports = router;
