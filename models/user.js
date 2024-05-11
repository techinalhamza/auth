const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/userAuth");

const userSchema = mongoose.Schema({
  username: String,
  name: String,
  password: String,
  email: String,
  age: Number,
  post: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
});

module.exports = mongoose.model("user", userSchema);
