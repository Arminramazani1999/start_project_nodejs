const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamp = require("mongoose-timestamp");
const productSchema = new Schema({
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  ],
  title: { type: String, required: true, unique: true },
  text: { type: String },
  brand: { type: String, default: "" },
  price: { type: String },
  img: [{ type: String }],
  size: [{ type: String }],
  color: [{ type: String }],
  constInStock: { type: Number, required: true, min: 0, max: 225 }, //موجودی
  rating: { type: Number, default: true },
  numReview: { type: Number, default: true },
  isFeatured: { type: Boolean, default: false },
});

productSchema.plugin(timestamp);

productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
productSchema.set("toJSON", {
  virtual: true,
});

module.exports = mongoose.model("product", productSchema, "product");
