const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: Number,
      required: true,
    },
    load: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
); //timestamps adds a date and time for each object created

module.exports = mongoose.model("Product", productSchema); //Creates and exports a model called Workout which follows the
