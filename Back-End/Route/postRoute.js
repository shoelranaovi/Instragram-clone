const express = require("express");
const errorHandeler = require("../middlewear/error");
const verify = require("../middlewear/verify");
const sharp = require("sharp");
const cloudinary = require("../utils/cloudinary");
const Post = require("../model/post.model");
const upload = require("../middlewear/multer");
const User = require("../model/user.model");
const Comment = require("../model/coment.model");
const { getReciverSocketId, io } = require("../socket/socket");
const { default: mongoose } = require("mongoose");

const postRouter = express.Router();

postRouter.post(
  "/create-post",
  verify,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const { caption } = req.body;
      const image = req.file;
      const author = req.user.id;

      if (!image) return next(errorHandeler(400, "image is required"));
      const optimizedImageBuffer = await sharp(image.buffer)
        .resize({ width: 800, height: 800, fit: "inside" })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();
      const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
        "base64"
      )}`;
      const cloudinaryResponse = await cloudinary.uploader.upload(fileUri);
      const payload = new Post({
        caption,
        author,
        image: cloudinaryResponse.secure_url,
      });
      const post = await payload.save();
      const user = await User.findById(author);

      if (user) {
        user.post.push(post._id);
        await user.save();
      }
      await post.populate({
        path: "author",
        select: "-password",
      });
      res.status(200).json({
        message: "Post Create successfully",
        data: post,

        success: true,
        error: false,
      });
    } catch (error) {
      console.log(error);
      return next(errorHandeler(400, "internal server error"));
    }
  }
);

postRouter.get("/getallpost", async (req, res, next) => {
  try {
    const post = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture bio" })
      .populate({
        path: "comment",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });
    res.status(200).json({
      message: "get post",
      data: post,
      success: true,
      error: false,
    });
  } catch (error) {
    console.log(error);
    return next(errorHandeler(400, "internal server error"));
  }
});
postRouter.get("/getuserpost", verify, async (req, res, next) => {
  try {
    const authorId = req.user.id;
    const post = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comment",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });
    res.status(200).json({
      message: "get post successfully",
      data: post,
      success: true,
      error: false,
    });
  } catch (error) {
    console.log(error);
    return next(errorHandeler(400, "internal server error"));
  }
});
postRouter.get("/like-post/:id", verify, async (req, res, next) => {
  try {
    const postId = req.params.id;
    const authorId = req.user.id;
    if (!postId) {
      return res.status(400).send("Post ID is required");
    }
    const post = await Post.findById(postId);

    if (!post) return next(errorHandeler(400, "post not found"));

    await post.updateOne({ $addToSet: { like: authorId } });
    await post.save();
    const user = await User.findById(authorId).select(
      "username profilePicture"
    );
    const postowner = post.author.toString();
    if (postowner !== authorId) {
      const notification = {
        type: "like",
        userId: authorId,
        userDetails: user,
        postId,
        message: "your post wast like",
      };
      const postownerSocketId = getReciverSocketId(postowner);
      io.to(postownerSocketId).emit("notification", notification);
    }
    res.status(200).json({
      message: " like done ",
      data: post,
      success: true,
      error: false,
    });
  } catch (error) {
    console.log(error);
    return next(errorHandeler(400, "internal server error"));
  }
});
postRouter.get("/unlike-post/:id", verify, async (req, res, next) => {
  try {
    const postId = req.params.id;
    const authorId = req.user.id;
    const post = await Post.findById(postId);

    if (!post) return next(errorHandeler(400, "post not found"));

    await post.updateOne({ $pull: { like: authorId } });
    await post.save();
    const user = await User.findById(authorId).select(
      "username profilePicture"
    );

    const postowner = post.author?.toString();
    if (postowner !== authorId) {
      const notification = {
        type: "dislike",
        userId: authorId,
        userDetails: user,
        postId,
        message: "your post wast dislike",
      };
      const postownerSocketId = getReciverSocketId(postowner);
      io.to(postownerSocketId).emit("notification", notification);
    }

    res.status(200).json({
      message: " unlike done ",
      data: post,
      success: true,
      error: false,
    });
  } catch (error) {
    console.log(error);
    return next(errorHandeler(400, "internal server error"));
  }
});
postRouter.post("/addcomment/:id", verify, async (req, res, next) => {
  try {
    const postId = req.params.id;
    const authorId = req.user.id;
    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!text) return next(errorHandeler(400, "error"));

    const newcomment = new Comment({
      text,
      author: authorId,
      post: postId,
    });
    const savecomment = await newcomment.save();
    savecomment.populate({
      path: "author",
      select: "username profilePicture",
    });
    post.comment.push(savecomment._id);

    const savepost = await post.save();

    res.status(200).json({
      message: " comment done ",
      data: savecomment,
      post: savepost,
      success: true,
      error: false,
    });
  } catch (error) {
    console.log(error);
    return next(errorHandeler(400, "internal server error"));
  }
});
postRouter.get("/getpostcomment/:id", async (req, res, next) => {
  try {
    const postId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return next(errorHandeler(400, "Invalid post ID format"));
    }
    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate("author", "username profilePicture");
    if (!comments) return next(errorHandeler(400, "error"));
    res.status(200).json({
      message: "comment found successfully",
      data: comments,
      success: true,
      error: false,
    });
  } catch (error) {
    console.log(error);
    return next(errorHandeler(400, "internal server error"));
  }
});
postRouter.delete("/deletepost/:id", verify, async (req, res, next) => {
  try {
    const postId = req.params.id;
    const authorId = req.user.id;
    const post = await Post.findById(postId);
    if (!post) return next(errorHandeler(400, "error"));
    if (post.author.toString() != authorId)
      return next(errorHandeler(400, "you dont"));
    await Post.findByIdAndDelete(postId);
    let user = await User.findById(authorId);
    user.post = user.post.filter((item) => item != postId);
    await user.save();
    await Comment.deleteMany({ post: postId });
    res.status(200).json({
      message: "post delete successfully",

      success: true,
      error: false,
    });
  } catch (error) {
    console.log(error);
    return next(errorHandeler(400, "internal server error"));
  }
});

postRouter.post("/addtobookmark/:id", verify, async (req, res, next) => {
  try {
    const postId = req.params.id;
    const authorId = req.user.id;
    const post = await Post.findById(postId);
    if (!post) return next(errorHandeler(400, "error"));
    const user = await User.findById(authorId);
    if (user.bookmark.includes(post._id)) {
      await user.updateOne({ $pull: { bookmark: post._id } });
      await user.save();
      return res.status(200).json({
        message: "post removed from bookmark",
        data: user,
        success: true,
        error: false,
      });
    } else {
      await user.updateOne({ $push: { bookmark: post._id } });
      await user.save();
      return res.status(200).json({
        message: "post removed from bookmark",
        data: user,
        success: true,
        error: false,
      });
    }
  } catch (error) {
    console.log(error);
    return next(errorHandeler(400, "internal server error"));
  }
});
module.exports = postRouter;
