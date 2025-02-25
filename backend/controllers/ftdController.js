const Ftd = require("../models/FtdModel");

// Create a new FTD entry
exports.createFtd = async (req, res) => {
    try {
        const { product } = req.body;

        if (!product) {
            return res.status(400).json({ message: "Product ID is required." });
        }

        // Count existing entries
        const count = await Ftd.countDocuments();
        if (count >= 4) {
            return res.status(400).json({ message: "Maximum 4 FTD entries allowed." });
        }

        const newFtd = new Ftd({ product });
        await newFtd.save();
        res.status(201).json(newFtd);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all FTD entries
exports.getAllFtds = async (req, res) => {
    try {
        const ftds = await Ftd.find().populate("product");
        res.status(200).json(ftds);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single FTD entry by ID
exports.getFtdById = async (req, res) => {
    try {
        const ftd = await Ftd.findById(req.params.id).populate("product");
        if (!ftd) {
            return res.status(404).json({ message: "FTD not found" });
        }
        res.status(200).json(ftd);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an FTD entry
exports.deleteFtd = async (req, res) => {
    try {
        const ftd = await Ftd.findByIdAndDelete(req.params.id);
        if (!ftd) {
            return res.status(404).json({ message: "FTD not found" });
        }
        res.status(200).json({ message: "FTD entry deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
