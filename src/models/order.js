const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamp = require("mongoose-timestamp");

const orderSchema = new Schema({
  orderItem: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrderItem",
    required: true,
  }],
  shippingAddress1: {
    type: Number,
    required: true,
  },
  shippingAddress2: {
    type: Number,
  },
  city: { type: String, required: true },
  phone: { type: String, required: true },
  zip: { type: String, required: true },
  status: { type: String, required: true, default: "pending" },
  totalPrice: { type: Number, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dateOrdered:{
    type:Date,
    default:Date.now
  },
});

orderSchema.plugin(timestamp);

module.exports = mongoose.model("Order", orderSchema);
