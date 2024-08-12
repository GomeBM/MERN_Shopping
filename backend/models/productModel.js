const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  tags: [{ type: String }],
  brand: { type: String, required: false },
  weight: { type: Number, required: false },
  dimensions: {
    width: { type: Number, required: false },
    height: { type: Number, required: false },
    depth: { type: Number, required: false },
  },
  reviews: [
    {
      rating: { type: Number, required: false },
      comment: { type: String, required: false },
      date: { type: Date, required: false },
      reviewerName: { type: String, required: false },
      reviewerEmail: { type: String, required: false },
    },
  ],
  thumbnail: { type: String },
  images: [{ type: String }],
});

module.exports = mongoose.model("Product", productSchema);
