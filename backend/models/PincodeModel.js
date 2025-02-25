const mongoose = require('mongoose');

const PincodeSchema = new mongoose.Schema({
    pincode: {
        type: Number,
        required: true,
        unique: true // Prevent duplicate entries
    },
    name: {
        type: String,
        required: true
    },
    deliveryCharges: { 
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("Pincode", PincodeSchema);
