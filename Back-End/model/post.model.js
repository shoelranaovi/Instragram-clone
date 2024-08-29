const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    caption: { type: String, default: "" },
    image: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
