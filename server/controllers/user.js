const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const DeleteAccount = require("../models/deleteAccount");
const mongoose = require("mongoose");

exports.getUser = (req, res, next) => {
  User.findById(req.userId)
    .select({
      password: 0,
      followers: 0,
      agreeTermConditions: 0,
    })
    .then((user) => {
      if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        error.status = "error";
        throw error;
      }
      res.status(200).json({
        status: "success",
        message: "Get User data successfully",
        data: user,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateUser = async (req, res, next) => {
  try {
    const {
      userName,
      firstName,
      lastName,
      currency,
      promotionCompany,
      displayNameInPublicRankingPage,
      surpriceContribution,
      surpriceContributionAmount,
      setAutoPost,
    } = req.body;
    const updateObject = {};
    // Check if the provided userName is already in use by another user
    if (userName) {
      const userNameExists = await User.findOne({
        userName: userName,
        _id: { $ne: req.userId },
      });
      if (userNameExists) {
        const userNameError = new Error(
          "Username is already in use. Please choose a different one."
        );
        userNameError.statusCode = 422;
        throw userNameError;
      }
      updateObject.userName = userName;
    }
    if (firstName) updateObject.firstName = firstName;
    if (lastName) updateObject.lastName = lastName;
    if (currency) updateObject.currency = currency;
    if (promotionCompany) updateObject.promotionCompany = promotionCompany;
    if (displayNameInPublicRankingPage)
      updateObject.displayNameInPublicRankingPage =
        displayNameInPublicRankingPage;
    if (surpriceContribution)
      updateObject.surpriceContribution = surpriceContribution;
    if (surpriceContributionAmount)
      updateObject.surpriceContributionAmount = surpriceContributionAmount;
    if (setAutoPost) updateObject.setAutoPost = setAutoPost;
    // Check if profileImage exists in request files
    if (
      req.files &&
      req.files.profileImage &&
      req.files.profileImage[0]?.filename
    ) {
      updateObject.profileImage = req.files.profileImage[0].filename;
    }
    // Check if bannerImage exists in request files
    if (
      req.files &&
      req.files.bannerImage &&
      req.files.bannerImage[0]?.filename
    ) {
      updateObject.bannerImage = req.files.bannerImage[0].filename;
    }
    const projection = {
      email: 1,
      status: 1,
      userName: 1,
      firstName: 1,
      lastName: 1,
      currency: 1,
      promotionCompany: 1,
      displayNameInPublicRankingPage: 1,
      surpriceContribution: 1,
      surpriceContributionAmount: 1,
      setAutoPost: 1,
      _id: 1,
      role: 1,
      bannerImage: 1,
      profileImage: 1,
      createdAt: 1,
      socialLinks: 1,
    };
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateObject },
      {
        new: true,
        projection,
      }
    );
    res.status(200).json({
      status: "success",
      message: "User data updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const validationError = new Error("Validation failed.");
      validationError.statusCode = 422;
      validationError.status = "error";
      validationError.data = errors.array();
      throw validationError;
    }

    const { oldPassword, newPassword, confirmPassword } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      const userNotFoundError = new Error("User not found.");
      userNotFoundError.statusCode = 404;
      userNotFoundError.status = "error";
      throw userNotFoundError;
    }

    if (newPassword !== confirmPassword) {
      const passwordMatchError = new Error(
        "New password and confirm password do not match"
      );
      passwordMatchError.statusCode = 401;
      passwordMatchError.status = "error";
      throw passwordMatchError;
    }

    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isOldPasswordCorrect) {
      const incorrectOldPasswordError = new Error(
        "Please enter the correct old password!"
      );
      incorrectOldPasswordError.statusCode = 401;
      incorrectOldPasswordError.status = "error";
      throw incorrectOldPasswordError;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedNewPassword;
    const savedUser = await user.save();

    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteUserAccount = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const validationError = new Error("Validation failed.");
      validationError.statusCode = 422;
      validationError.status = "error";
      validationError.data = errors.array();
      throw validationError;
    }

    const { password, reason } = req.body;

    const user = await User.findById(req.userId);
    let userId = req.userId;
    if (!user) {
      const userNotFoundError = new Error("User not found.");
      userNotFoundError.statusCode = 404;
      userNotFoundError.status = "error";
      throw userNotFoundError;
    }

    const isOldPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isOldPasswordCorrect) {
      const incorrectOldPasswordError = new Error(
        "Please enter the correct password!"
      );
      incorrectOldPasswordError.statusCode = 401;
      incorrectOldPasswordError.status = "error";
      throw incorrectOldPasswordError;
    }

    // Save delete account details
    const deleteAccount = new DeleteAccount({
      userId: user._id,
      email: user.email,
      reason: reason,
    });

    await deleteAccount.save();

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getFighters = async (req, res, next) => {
  try {
    // Define the query object
    const query = {
      role: "fighter",
      status: "true",
    };

    // Check if a specific key is provided for random order
    if (req.query.random) {
      // If a random key is provided, fetch data in random order
      const fighters = await User.aggregate([
        {
          $match: {
            ...query,
            ...getSearchQuery(req.query.search),
            _id: { $ne: mongoose.Types.ObjectId(req.userId) },
          },
        }, // Exclude req.userId
        { $sample: { size: 10 } }, // Adjust the sample size as needed
        {
          $project: {
            password: 0,
            followers: 0,
            agreeTermConditions: 0,
          },
        },
      ]);
      res.status(200).json({
        status: "success",
        message: "Get fighters data successfully",
        data: fighters,
      });
    } else {
      // If no random key, fetch data without random order
      const fighters = await User.find({
        ...query,
        ...getSearchQuery(req.query.search),
        _id: { $ne: mongoose.Types.ObjectId(req.userId) }, // Exclude req.userId
      })
        .select("-password -followers -cart -agreeTermConditions")
        .limit(10); // Limit the result size as needed
      res.status(200).json({
        status: "success",
        message: "Get fighters data successfully",
        data: fighters,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Helper function to generate search query
const getSearchQuery = (search) => {
  if (!search) {
    return {};
  }
  const regex = new RegExp(search, "i");
  return {
    $or: [
      { firstName: regex },
      { lastName: regex },
      { userName: regex },
      { promotionCompany: regex },
    ],
  };
};

// Follow or unfollow a fighter
exports.manageFollow = async (req, res, next) => {
  try {
    const { fighterId, action } = req.params;
    const userId = req.userId;

    // Check if the fighter exists
    const fighter = await User.findById(fighterId);
    if (!fighter || fighter.role !== "fighter" || fighter.status !== "true") {
      return res.status(404).json({
        status: "error",
        message: "Fighter not found or not active.",
      });
    }

    // Check if the user is not trying to perform an invalid action
    if (action !== "follow" && action !== "unfollow") {
      return res.status(400).json({
        status: "error",
        message: 'Invalid action. Use "follow" or "unfollow".',
      });
    }

    // Check if the user is not trying to follow/unfollow themselves
    if (fighterId === userId) {
      return res.status(400).json({
        status: "error",
        message: "You cannot follow/unfollow yourself.",
      });
    }

    // Check if the user is already following/unfollowing the fighter
    const isFollowing = fighter.followers.includes(userId);
    if (
      (action === "follow" && isFollowing) ||
      (action === "unfollow" && !isFollowing)
    ) {
      const actionMessage =
        action === "follow"
          ? "You are already following this fighter."
          : "You are not following this fighter.";
      return res.status(400).json({
        status: "error",
        message: actionMessage,
      });
    }

    // Update the fighter's followers list based on the action
    const updateQuery =
      action === "follow"
        ? { $push: { followers: userId } }
        : { $pull: { followers: userId } };
    await User.findByIdAndUpdate(fighterId, updateQuery);

    const updatedFollower = await User.find({ followers: userId });

    const successMessage =
      action === "follow"
        ? "You are now following the fighter."
        : "You have unfollowed the fighter.";
    res.status(200).json({
      status: "success",
      message: successMessage,
      updatedFollower: updatedFollower,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Fetch follow list of authenticated user
exports.getFollowedFighters = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }

    // Fetch the follow list of the authenticated user
    const followList = await User.find({ followers: userId }).select(
      "-password -cart -followers -agreeTermConditions"
    ); // Adjust the fields you want to retrieve

    res.status(200).json({
      status: "success",
      message: "Get followed fighters data successfully",
      followList: followList,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getFighter = async (req, res, next) => {
  try {
    const userName = req.params.userName;

    let { category, sort } = req.query;

    if (category === "All" || category === "other") {
      category = undefined;
    }

    if (category === "Other" || category === "other") {
      category = undefined;
    }

    const sortOptions = {
      "Most Recent": { createdAt: -1 },
      Oldest: { createdAt: 1 },
      "High to Low": { goalPrice: -1 },
      "Low to High": { goalPrice: 1 },
    };

    let sortOption = sortOptions[sort];

    // If req.query.sort is not provided or invalid, set default sorting option
    if (!sortOption) {
      sortOption = undefined;
    }

    // console.log("this is sort option", sortOption);

    const pipeline = [
      { $match: { userName: userName } },
      {
        $project: {
          password: 0,
          __v: 0,
          agreeTermConditions: 0,
          cart: 0,
          followers: 0,
          updatedAt: 0,
        },
      },
      {
        $lookup: {
          from: "goals",
          localField: "_id",
          foreignField: "creator",
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$status", "active"] },
                    category ? { $eq: ["$goalCategory", category] } : {},
                  ],
                },
              },
            },
            ...(sortOption ? [{ $sort: sortOption }] : []),
          ],
          as: "goals",
        },
      },
    ];

    const fighter = await User.aggregate(pipeline);

    if (!fighter) {
      return res.status(404).json({
        status: "error",
        message: "Fighter not found.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Get fighter details successfully",
      data: fighter,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateUserSocialLinks = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { socialLinks } = req.body;

    // Check if the user exists
    const user = await User.findById(userId).select(
      "-password -followers -cart -agreeTermConditions"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update social links only if provided in the request body
    if (socialLinks) {
      user.socialLinks = socialLinks;

      // Save the user with updated social links
      await user.save();
    }

    res.status(200).json({
      status: "success",
      message: "Social links updated successfully",
      data: user,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
