const mongoose = require('mongoose')

const CategoryModel = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model("Category", CategoryModel)