const express = require('express');
const mongoose = require('mongoose');

const ReviewsSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  reviews: [
    {
      username: {
        type: String,
        required: true
      },
      review: {
        type: String,
        required: true  // Ensure review is required
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true  // Ensure rating is required
      },
      media: [{
        type: String,  // Array of strings to store media filenames
        // validate: {
        //   validator: function (value) {
        //     return value.length <= 3; // Ensure array length is at most 3
        //   },
        //   message: 'A maximum of 3 media files are allowed.'
        // }
      }]
    },{timestamps: true}
  ]
}, {timestamps: true});

module.exports = mongoose.model('Reviews', ReviewsSchema);
