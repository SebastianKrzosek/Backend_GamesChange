const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  login: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  avatar: {
    type: String,
  },
  city: {
    type: String,
  },
});

module.exports = User = mongoose.model("users", userSchema);
