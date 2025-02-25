const mongoose = require('mongoose')

const ProductTagModel = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model("ProductTag", ProductTagModel)