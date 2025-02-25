const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

// Generate 6-digit User ID from MongoDB ObjectId
const generateUserId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let userId = "";
    for (let i = 0; i < 6; i++) {
      userId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return userId;
  };

// Generate JWT Token
const createToken = (user) => {
    return jwt.sign({ id: user._id, userType: user.userType }, process.env.SECRET, { expiresIn: '7d' });
};

// Signup Controller
const signup = async (req, res) => {
    try {
        const { userId, username, email, password, userType } = req.body;
        
        const user = await User.signup(userId, username, email, password, userType);
        user.userId = generateUserId();
        await user.save();

        const token = createToken(user);
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Login Controller
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.login(email, password);
        const token = createToken(user);

        res.status(200).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get User by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate({
            path: 'cart.productId' // Keep the same path
        });

        if (!user) return res.status(404).json({ error: "User not found" });

        // Filter out products where isArchived is false or inStock is false
        user.cart = user.cart.filter(
            item => item.productId && item.productId.isArchived === false && item.productId.inStock === true
        );

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



// Update User
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ error: "User not found" });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) return res.status(404).json({ error: "User not found" });

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Add to Cart
const addToCart = async (req, res) => {
    try {
        const { id } = req.params; // User ID
        const { productId, quantity } = req.body;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Check if product already exists in cart
        const existingItem = user.cart.find(item => item.productId.toString() === productId);

        if (existingItem) {
            if (quantity === 0) {
                // Remove item if quantity is 0
                user.cart = user.cart.filter(item => item.productId.toString() !== productId);
            } else {
                existingItem.quantity = quantity; // Update quantity
            }
        } else {
            if (quantity > 0) {
                user.cart.push({ productId, quantity });
            }
        }

        await user.save();
        res.status(200).json({ cart: user.cart });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



// Remove from Cart
const removeFromCart = async (req, res) => {
    try {
        const { id, productId } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.cart = user.cart.filter(item => item.productId.toString() !== productId);
        await user.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update Cart
const updateCart = async (req, res) => {
    try {
        const { id } = req.params;
        const { cart } = req.body;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.cart = cart;
        await user.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const emptyCart = async (req, res) => {
    try {
        const { id } = req.params; // User ID
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.cart = []; // Empty the cart
        await user.save();

        res.status(200).json({ message: "Cart emptied successfully", cart: user.cart });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Add Address with a limit of 3
const addAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, address, landmark, state, city, pincode, phoneNo, tag } = req.body;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.addresses.length >= 3) {
            return res.status(400).json({ error: "You can only add up to 3 addresses." });
        }

        user.addresses.push({ firstName, lastName, address, landmark, state, city, pincode, phoneNo, tag });
        await user.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateAddress = async (req, res) => {
    try {
        const { id, addressId } = req.params; // User ID & Address ID from params
        const updatedData = req.body; // New address data

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
        if (addressIndex === -1) return res.status(404).json({ error: "Address not found" });

        // Update address fields
        user.addresses[addressIndex] = { ...user.addresses[addressIndex], ...updatedData };

        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const { id, addressId } = req.params; // User ID & Address ID from params

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Filter out the address to be deleted
        user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);

        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



module.exports = {
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
};
