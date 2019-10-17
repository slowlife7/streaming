const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userid: String,
  passwd: String
});

module.exports = mongoose.model("user", userSchema);
