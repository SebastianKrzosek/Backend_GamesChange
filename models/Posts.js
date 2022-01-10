const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create Schema
const addPostSchema = new Schema({
  _id: Schema.Types.ObjectId,
  type: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  photo: {
    type: String,
  },
  author_id: {
    type: mongoose.Types.ObjectId,
    default: mongoose.Types.ObjectId(0),
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  city: {
    type: String,
  },
});

module.exports = Posts = mongoose.model("posts", addPostSchema);
