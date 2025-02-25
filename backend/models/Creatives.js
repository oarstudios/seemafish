const mongoose = require("mongoose");

const CreativeSchema = mongoose.Schema(
  {
    media: {
      type: String, // Stores image filename
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Creative", CreativeSchema);
