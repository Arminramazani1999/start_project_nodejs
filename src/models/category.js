const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamp = require("mongoose-timestamp");

const categorySchema = new Schema({
  parent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],

  title: { type: String, required: true, unique: true },
  img: { type: String },
});

categorySchema.plugin(timestamp);

module.exports = mongoose.model("Category", categorySchema, "Category");
