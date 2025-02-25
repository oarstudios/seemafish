const mongoose = require('mongoose');

// Function to generate a random 6-digit product ID
const generateProductId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        default: {
            type: Number,
            required: true
        },
        sale: {
            type: Number,
            default: null
        }
    },
    weight: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    productTag: {
        type: String,
        default: ''
    },
    note: {
        type: String,
        default: ''
    },
    images: [
        {
            type: String,
            required: true
        }
    ],
    bestseller: {
        type: Boolean,
        default: false
    },
    inStock: {
        type: Boolean,
        default: true
    },
    productId: {
        type: String,
        unique: true,
        default: generateProductId
    },
    isArchived: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
