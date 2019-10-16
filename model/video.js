const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoSchema = new Schema({
  ino: Number,
  title: String,
  path: String,
  created: Date,
  modified: Date
});

module.exports = mongoose.model("videoList", videoSchema);
