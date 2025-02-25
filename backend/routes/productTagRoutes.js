const express = require("express");
const router = express.Router();
const {
    createProductTag,
    getAllProductTags,
    getProductTagById,
    updateProductTag,
    deleteProductTag
} = require("../controllers/productTagController");

// Route to create a new product tag
router.post("/", createProductTag);

// Route to get all product tags
router.get("/", getAllProductTags);

// Route to get a product tag by its ID
router.get("/:id", getProductTagById);

// Route to update a product tag by its ID
router.put("/:id", updateProductTag);

// Route to delete a product tag by its ID
router.delete("/:id", deleteProductTag);

module.exports = router;
