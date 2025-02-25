const Pincode = require('../models/PincodeModel');
const mongoose = require('mongoose');

// Create a new pincode entry
exports.createPincode = async (req, res) => {
    try {
        const { pincode, name, deliveryCharges, status } = req.body;

        // Check if the pincode already exists
        const existingPincode = await Pincode.findOne({ pincode });
        if (existingPincode) {
            return res.status(400).json({ message: "Pincode already exists" });
        }

        const newPincode = new Pincode({ pincode, name, deliveryCharges, status });
        await newPincode.save();

        res.status(201).json(newPincode);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all pincode entries
exports.getAllPincodes = async (req, res) => {
    try {
        const pincodes = await Pincode.find();
        res.status(200).json(pincodes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single pincode by ID
exports.getPincodeById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const pincode = await Pincode.findById(id);
        if (!pincode) {
            return res.status(404).json({ message: "Pincode not found" });
        }

        res.status(200).json(pincode);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a pincode entry by ID
exports.updatePincode = async (req, res) => {
    try {
        const { id } = req.params;
        const { pincode, name, deliveryCharges, status } = req.body;

        // Check if updating to a pincode that already exists
        if (pincode) {
            const existingPincode = await Pincode.findOne({ pincode, _id: { $ne: id } });
            if (existingPincode) {
                return res.status(400).json({ message: "Pincode already exists" });
            }
        }

        const updatedPincode = await Pincode.findByIdAndUpdate(
            id,
            { pincode, name, deliveryCharges, status },
            { new: true, runValidators: true }
        );

        if (!updatedPincode) {
            return res.status(404).json({ message: "Pincode not found" });
        }

        res.status(200).json(updatedPincode);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a pincode entry by ID
exports.deletePincode = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPincode = await Pincode.findByIdAndDelete(id);

        if (!deletedPincode) {
            return res.status(404).json({ message: "Pincode not found" });
        }

        res.status(200).json({ message: "Pincode deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
