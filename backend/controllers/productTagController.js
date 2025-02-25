const ProductTag = require("../models/ProductTag");

// Create a new product tag
const createProductTag = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Product tag name is required" });
        }

        const productTag = new ProductTag({ name });
        await productTag.save();
        res.status(201).json(productTag);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get all product tags
const getAllProductTags = async (req, res) => {
    try {
        const productTags = await ProductTag.find().sort({ createdAt: -1 });
        res.status(200).json(productTags);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get product tag by ID
const getProductTagById = async (req, res) => {
    try {
        const productTag = await ProductTag.findById(req.params.id);
        if (!productTag) {
            return res.status(404).json({ message: "Product tag not found" });
        }
        res.status(200).json(productTag);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Update product tag by ID
const updateProductTag = async (req, res) => {
    try {
        const { name } = req.body;
        const updatedProductTag = await ProductTag.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true, runValidators: true }
        );

        if (!updatedProductTag) {
            return res.status(404).json({ message: "Product tag not found" });
        }

        res.status(200).json(updatedProductTag);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete product tag by ID
const deleteProductTag = async (req, res) => {
    try {
        const productTag = await ProductTag.findByIdAndDelete(req.params.id);
        if (!productTag) {
            return res.status(404).json({ message: "Product tag not found" });
        }

        res.status(200).json({ message: "Product tag deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    createProductTag,
    getAllProductTags,
    getProductTagById,
    updateProductTag,
    deleteProductTag
};
