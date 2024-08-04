const mongoose = require("mongoose");
const productModel = require("./productModel");

const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

const wishListSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const purchaseHistorySchema = new Schema({
  date_purchased: { type: Date, default: Date.now },
  items_purchased: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    cart: [cartItemSchema],
    purchase_history: [purchaseHistorySchema],
    wishlist: [wishListSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", UserSchema);
