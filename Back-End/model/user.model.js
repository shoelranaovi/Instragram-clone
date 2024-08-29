const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, requied: true },
    profilePicture: {
      type: String,
      default:
        "https://w7.pngwing.com/pngs/640/691/png-transparent-avatar-boy-character-man-user-avatar-vol-9-icon.png",
    },
    bio: { type: String, default: "" },
    gender: { type: String, enum: ["male", "female"] },
    follower: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    post: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    bookmark: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timeseries: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
