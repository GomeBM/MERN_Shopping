const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  tags: [{ type: String }],
  brand: { type: String, required: true },
  weight: { type: Number, required: true },
  dimensions: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    depth: { type: Number, required: true },
  },
  reviews: [
    {
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
      date: { type: Date, required: true },
      reviewerName: { type: String, required: true },
      reviewerEmail: { type: String, required: true },
    },
  ],
  thumbnail: { type: String },
  images: [{ type: String }],
});

module.exports = mongoose.model("Product", productSchema);
