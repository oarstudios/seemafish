const Product = require('../models/ProductModel');

// Create a new product
const createProduct = async (req, res) => {
    try {
        // Parse the price field if it's a string (from FormData)
        const price = req.body.price ? JSON.parse(req.body.price) : null;

        // Destructure the body to get product details
        const { name, weight, description, category, productTag, note, bestseller, inStock, images } = req.body;

        // Handle image uploads (assuming images are passed in the request)
        const productImages = req.files ? req.files.map(file => file.originalname) : images;

        // Ensure price is correctly structured
        const productPrice = {
            default: price ? price.default : null,  // price.default from form data
            sale: price ? price.sale : null, // price.sale from form data
        };

        // Create and save the new product
        const product = new Product({
            name,
            price: productPrice,
            weight,
            description,
            category,
            productTag,
            note,
            images: productImages,
            bestseller,
            inStock
        });

        await product.save();
        res.status(201).json(product); // Respond with the newly created product
    } catch (error) {
        console.error(error); // Log the error details
        res.status(400).json({ error: error.message }); // Respond with error message
    }
};



// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 }); // Get all products, sorted by creation date
        res.status(200).json(products); // Respond with the list of products
    } catch (error) {
        res.status(400).json({ error: error.message }); // Respond with error message
    }
};

// Get a product by its ID (using MongoDB's unique productId)
const getProductById = async (req, res) => {
    try {
        const { id } = req.params; // Get productId from URL parameters
        const product = await Product.findById(id); // Find product by productId

        if (!product) {
            return res.status(404).json({ error: "Product not found" }); // Return error if product not found
        }

        res.status(200).json(product); // Respond with the found product
    } catch (error) {
        res.status(400).json({ error: error.message }); // Respond with error message
    }
};

// Update a product by its ID (using productId)
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params; // Get productId from URL parameters
        const data = req.body;

        // Handle image uploads if new images are provided
        if (req.files && req.files.length > 0) {
            data.images = req.files.map(file => file.originalname);
        }

        // Check if price is provided in the request body, and structure it correctly
        if (data.price) {
            data.price = JSON.parse(data.price);
            // Ensure that both 'default' and 'sale' prices are available in the request
            const productPrice = {
                default: data.price.default ? Number(data.price.default) : null,  // Ensure it's a number and fallback to null if missing
                sale: data.price.sale ? Number(data.price.sale) : null,  // Ensure it's a number and fallback to null if missing
            };

            // Add the price object to the data
            data.price = productPrice;
        }

        // Update the product based on productId
        const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" }); // Return error if product not found
        }

        res.status(200).json(updatedProduct); // Respond with the updated product
    } catch (error) {
        res.status(400).json({ error: error.message }); // Respond with error message
    }
};



// Delete a product by its ID (using productId)
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params; // Get productId from URL parameters

        const deletedProduct = await Product.findOneAndDelete({ productId: id }); // Delete product by productId

        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" }); // Return error if product not found
        }

        res.status(200).json({ message: "Product deleted successfully" }); // Return success message
    } catch (error) {
        res.status(400).json({ error: error.message }); // Respond with error message
    }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params; // Get category from URL parameters
        const products = await Product.find({ category }); // Find products that belong to the given category
        res.status(200).json(products); // Respond with the list of products in the category
    } catch (error) {
        res.status(400).json({ error: error.message }); // Respond with error message
    }
};

// Get products by product tag
const getProductsByProductTag = async (req, res) => {
    try {
        const { productTag } = req.params; // Get productTag from URL parameters
        const products = await Product.find({ productTag }); // Find products with the given product tag
        res.status(200).json(products); // Respond with the list of products with the given tag
    } catch (error) {
        res.status(400).json({ error: error.message }); // Respond with error message
    }
};

// Get bestsellers
const getBestsellers = async (req, res) => {
    try {
        const bestsellers = await Product.find({ bestseller: true }); // Find products that are marked as bestsellers
        res.status(200).json(bestsellers); // Respond with the list of bestsellers
    } catch (error) {
        res.status(400).json({ error: error.message }); // Respond with error message
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getProductsByProductTag,
    getBestsellers
};
