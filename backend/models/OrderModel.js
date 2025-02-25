const mongoose = require('mongoose')

const BillingModel = mongoose.Schema({
    billId: {
        type: String, 
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
         // required: true,
    },
    products:[
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                 // required: true,
            },
            quantity: {
                type: Number,
                // required: true,,
                default: 1,
                min: 1
            },
            price: {
                type: String
            }
        }
    ],
    email: {
        type: String,
        // required: true,
    },
    shippingAddress:{
        firstName: {
            type: String,
            // required: true,
        },
        lastName: {
            type: String,
            // required: true,
        },
        address:{
            type: String,
            // required: true,
        },
        landmark:{
            type: String,
            // required: true,
        },
        state:{
            type: String,
            // required: true,
        },
        city:{
            type: String,
            // required: true,
        },
        pincode:{
            type: Number,
            // required: true,
        },
        phoneNo:{
            type: Number,
            // required: true,
        }
    },
    status: {
        type: String,
        default: "Pending",
    },
    billPrice:{
        type: String
    },
    time: {
        day: {
            type: String,
            required: true
        },
        slot: {
            type: String,
            required: true
        }
    }
}, {timestamps: true})

module.exports = mongoose.model('Billing', BillingModel)