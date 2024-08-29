const express = require("express");
const errorHandeler = require("../middlewear/error");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRoute = express.Router();
const User = require("../model/user.model");
const verify = require("../middlewear/verify");
const upload = require("../middlewear/multer");
const getDataUri = require("../utils/datauri");
const cloudinary = require("../utils/cloudinary");
const sharp = require("sharp");
const { ObjectId } = require("mongoose").Types;

userRoute.post("/create-user", async (req, res, next) => {
  try {
    const { username, email, password, bio } = req.body;
    const profilePicture = req.file;
    if (!username || !email || !password) {
      return next(errorHandeler(400, "plz provide your details"));
    }
    const pattren = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(pattren)) {
      return next(errorHandeler(400, "plz provide valid email"));
    }
    if (username.length <= 4) {
      return next(errorHandeler(400, "username should be 8 charactor or more"));
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const payload = {
      username,
      email,
      password: hash,
      bio,
    };

    const newUser = new User(payload);
    const saveUser = await newUser.save();
    res.status(200).json({
      message: "user create successfull",
      data: saveUser,
      success: true,
      error: false,
    });
  } catch (error) {
    console.log(error);
    return next(errorHandeler());
  }
});

userRoute.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return next(errorHandeler(400, "plz provide your information"));
    }
    const finduser = await User.findOne({ email });
    if (!finduser) {
      return next(errorHandeler(400, "plz provide valid email"));
    } else {
      const comparePass = await bcrypt.compareSync(password, finduser.password);
      if (!comparePass) {
        return next(errorHandeler(400, "plz provide correct Password"));
      }

      const tokendata = {
        id: finduser._id,
        email: finduser.email,
        role: finduser.role,
      };
      const token = jwt.sign(tokendata, process.env.SECRET_KEY, {
        expiresIn: "30d",
      });

      const tokenoption = {
        expires: new Date(Date.now() + 604800000),
        httpOnly: true,
        securce: true,
      };
      await finduser.populate({ path: "post" });
      const userinfromation = {
        id: finduser._id,
        username: finduser.username,
        profilePicture: finduser.profilePicture,
        bio: finduser.bio,
        email: finduser.email,
        post: finduser.post,
      };
      res.status(201).cookie("token", token, tokenoption).json({
        message: "successfully login",
        data: userinfromation,
        success: true,
        error: false,
      });
    }
  } catch (error) {
    console.log(error);
    return next(errorHandeler(400, error.message));
  }
});
userRoute.get("/users", async (req, res, next) => {
  try {
    const users = await User.find({}, "id email username");
    res.status(200).json({
      message: "user found",
      data: users,
      success: true,
      error: false,
    });
  } catch (error) {
    console.log(error);
    return next(errorHandeler(400, error.message));
  }
});
userRoute.post("/signout", async (req, res, next) => {
  try {
    res.clearCookie("token").json({
      message: "Sign Out complete successfully",
      data: null,
      success: true,
      error: false,
    });
  } catch (error) {
    console.log(error);
    return next(errorHandeler(400, error.message));
  }
});
userRoute.delete("/deleteuser/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletuser = await User.findByIdAndDelete(id);

    res.status(200).json({
      message: "user delete successfully",
      data: deletuser,
      success: true,
      error: false,
    });
  } catch (error) {
    console.log(error);
    return next(errorHandeler(400, error.message));
  }
});
{
}

userRoute.post(
  "/update-profile",
  verify, // Ensure this middleware sets req.user correctly
  upload.single("profilePicture"),
  async (req, res, next) => {
    try {
      const { id } = req.user;

      // Check if id is present and valid
      if (!id || !ObjectId.isValid(id)) {
        return next(errorHandeler(400, "Invalid user ID"));
      }

      const { bio, gender } = req.body;
      const profilePicture = req.file;

      let cloudResponse;
      if (profilePicture) {
        const fileUri = getDataUri(profilePicture);
        try {
          cloudResponse = await cloudinary.uploader.upload(fileUri);
        } catch (cloudError) {
          return next(errorHandeler(500, "Failed to upload profile picture"));
        }
      }

      const updateFields = { ...req.body }; // Start with request body
      if (bio) updateFields.bio = bio;
      if (gender) updateFields.gender = gender;
      if (profilePicture && cloudResponse)
        updateFields.profilePicture = cloudResponse.secure_url;

      const user = await User.findByIdAndUpdate(id, updateFields, {
        new: true,
      });
      if (!user) {
        return next(errorHandeler(400, "User not found"));
      }

      // Populate 'post' field if needed
      await user.populate({ path: "post" });

      const userInformation = {
        id: user._id,
        username: user.username,
        profilePicture: user.profilePicture,
        bio: user.bio,
        email: user.email,
        post: user.post,
      };

      res.status(200).json({
        message: "Profile updated",
        data: userInformation,
        success: true,
        error: false,
      });
    } catch (error) {
      console.error(error);
      return next(errorHandeler(400, "Some error occurred"));
    }
  }
);

userRoute.get("/getprofile/:id", verify, async (req, res, next) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).select("-password");
    await user.populate("post");

    res.status(200).json({
      message: "user Found  successfully",
      data: user,
      success: true,
      error: false,
    });
  } catch (error) {
    console.log(error);
    return next(errorHandeler(400, "internal server error"));
  }
});
userRoute.get("/suggestuser/:id", verify, async (req, res, next) => {
  const id = req.params.id;

  try {
    const suggestUser = await User.find({ _id: { $ne: req.user.id } }).select(
      "-password"
    );
    if (!suggestUser) {
      res.status(400).json({
        message: "Currently do not have any users",
      });
    }

    res.status(200).json({
      message: "user Found  successfully",
      data: suggestUser,
      success: true,
      error: false,
    });
  } catch (error) {
    console.log(error);
    return next(errorHandeler(400, "internal server error"));
  }
});
userRoute.post("/followOrUnfollow/:id", verify, async (req, res, next) => {
  try {
    const whichwanttofollow = req.user.id;
    const whichuserfollow = req.params.id;
    const user = await User.findById(whichwanttofollow);
    const targetUser = await User.findById(whichuserfollow);
    if (!user || !targetUser) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    const isfollowing = user.following.includes(whichuserfollow);
    if (isfollowing) {
      await Promise.all([
        User.updateOne(
          { _id: whichwanttofollow },
          { $pull: { following: whichuserfollow } }
        ),

        User.updateOne(
          { _id: whichuserfollow },
          { $pull: { follower: whichwanttofollow } }
        ),
      ]);
      return res.status(200).json({
        message: "unfollow successfully",
        success: true,
        error: false,
      });
    } else {
      await Promise.all([
        User.updateOne(
          { _id: whichwanttofollow },
          { $push: { following: whichuserfollow } }
        ),

        User.updateOne(
          { _id: whichuserfollow },
          { $push: { follower: whichwanttofollow } }
        ),
      ]);
    }
    return res.status(200).json({
      message: "follow successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.log(error);
    return next(errorHandeler(400, "internal server error"));
  }
});

module.exports = userRoute;
