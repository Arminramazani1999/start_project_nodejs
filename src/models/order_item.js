const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamp = require("mongoose-timestamp");

const orderItemSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// orderItemSchema.plugin(timestamp);

module.exports = mongoose.model("OrderItem", orderItemSchema);
