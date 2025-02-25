const express = require('express');
const router = express.Router();
const {
    signup,
    login,
    getUserById,
    updateUser,
    deleteUser,
    getAllUsers,
    addToCart,
    removeFromCart,
    updateCart,
    emptyCart,
    addAddress,
    updateAddress,
    deleteAddress
} = require('../controllers/userController');
const requireAuth = require('../middlewares/requireAuth');

// User Routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/', getAllUsers);

// Cart Routes
router.post('/:id/cart', addToCart);
router.put('/:id/cart', updateCart);
router.delete('/:id/cart/:productId', removeFromCart);
router.delete('/:id/cart', emptyCart);

// Address Routes
router.post('/:id/address', addAddress);
router.put('/:id/:addressId', updateAddress);
router.delete('/:id/:addressId', deleteAddress);


module.exports = router;
