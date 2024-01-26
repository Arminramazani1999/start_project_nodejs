const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamp = require("mongoose-timestamp");
// create model
const userSchema = new Schema({
  name: { type: String },
  img: { type: String, },
  // phone: {type: Number, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isadmin: { type: Boolean, default: true },
});
    
userSchema.plugin(timestamp);

module.exports = mongoose.model("User", userSchema, "User");
