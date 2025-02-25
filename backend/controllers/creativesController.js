const fs = require("fs");
const path = require("path");
const Creative = require("../models/Creatives");

// @desc    Upload a new creative
// @route   POST /creatives
// @access  Public
const uploadCreative = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const newCreative = new Creative({
      media: req.file.originalname,
      tag: req.body.tag || "No tag",
    });

    await newCreative.save();
    res.status(201).json({ success: true, data: newCreative });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all creatives
// @route   GET /creatives
// @access  Public
const getCreatives = async (req, res) => {
  try {
    const creatives = await Creative.find();
    res.status(200).json({ success: true, data: creatives });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a creative (replace image or update tag)
// @route   PUT /creatives/:creativeId
// @access  Public
const updateCreative = async (req, res) => {
  try {
    const { creativeId } = req.params;
    const { tag } = req.body;

    const creative = await Creative.findById(creativeId);
    if (!creative) {
      return res.status(404).json({ success: false, message: "Creative not found" });
    }

    if (tag) {
      creative.tag = tag;
    }

    if (req.file) {
      const oldImagePath = path.join(__dirname, "..", "uploads", creative.media);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete old image
      }

      creative.media = req.file.filename; // Update with new image filename
    }

    await creative.save();
    res.status(200).json({ success: true, data: creative });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a creative entry
// @route   DELETE /creatives/:creativeId
// @access  Public
const deleteCreative = async (req, res) => {
  try {
    const { creativeId } = req.params;
    const creative = await Creative.findById(creativeId);

    if (!creative) {
      return res.status(404).json({ success: false, message: "Creative not found" });
    }

    // Delete image from storage
    const oldImagePath = path.join(__dirname, "..", "uploads", creative.media);
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }

    await Creative.deleteOne({ _id: creativeId });

    res.status(200).json({ success: true, message: "Creative deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadCreative, getCreatives, updateCreative, deleteCreative };
