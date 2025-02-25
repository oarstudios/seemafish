const mongoose = require('mongoose')

const FtdModel = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }
}, {timestamps: true})

module.exports = mongoose.model('Ftd', FtdModel);