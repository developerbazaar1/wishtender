const { validationResult } = require("express-validator");
const Goal = require("../models/goal");
const User = require("../models/user");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const validationError = new Error("Validation failed.");
      validationError.statusCode = 422;
      validationError.status = "error";
      validationError.data = errors.array();
      throw validationError;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 401;
      error.status = "error";
      throw error;
    }

    const {
      goalName,
      goalPrice,
      goalType,
      goalCategory,
      goalPurchaseType,
      subscriptionType,
    } = req.body;

    // Check if a goal with the same creator, status, and goal name already exists
    const existingGoal = await Goal.findOne({
      creator: user._id,
      status: "active", // Adjust the status as needed
      goalName,
    });

    if (existingGoal) {
      const error = new Error("Goal with the same name already exists.");
      error.statusCode = 422;
      error.status = "error";
      throw error;
    }

    // Find the highest goalOrderBy value for the user
    const highestGoalOrderBy = await Goal.findOne({
      creator: user._id,
      status: "active",
    })
      .sort({ goalOrderBy: -1 }) // Sort in descending order to get the highest value
      .select("goalOrderBy");

    // If there are no existing goals, set the goalOrderBy to 1
    const goalOrderBy = existingGoal
      ? existingGoal.goalOrderBy
      : highestGoalOrderBy
      ? highestGoalOrderBy.goalOrderBy + 1
      : 1;

    // Extract the file name and path from Multer
    const fileName = req.file.filename;

    // Create a new goal instance
    const newGoal = new Goal({
      goalName,
      goalPrice,
      goalType,
      goalCategory,
      goalPurchaseType,
      goalImage: fileName, // Save the file name to the database
      status: "active",
      creator: user._id,
      goalOrderBy: goalOrderBy,
      subscriptionType,
    });

    // Save the goal to the database
    const savedGoal = await newGoal.save();

    res.status(200).json({
      status: "success",
      message: "Goal created successfully",
      data: savedGoal,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getGoalDetails = async (req, res, next) => {
  try {
    // Extract goal ID from request parameters
    const goalId = req.params.goalId;

    // Fetch goal details by ID
    // const goal = await Goal.findById(goalId);

    const goal = await Goal.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(goalId) } },
      {
        $lookup: {
          from: "users",
          localField: "creator",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                currency: 1,
              },
            },
          ],
          as: "currencyDetails",
        },
      },
      { $unwind: "$currencyDetails" },
      {
        $project: {
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
    ]);

    // Check if the goal exists
    if (goal.length === 0) {
      const error = new Error("Goal not found.");
      error.statusCode = 404;
      error.status = "error";
      throw error;
    }

    res.status(200).json({
      status: "success",
      message: "Get goal details successfully",
      data: goal[0],
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getGoals_old1 = async (req, res, next) => {
  // console.log("category", req.query.category);
  // console.log("sort", req.query.sort);
  try {
    let userId;
    // Check if a specific creator is provided in the request parameters
    if (req.query.creator) {
      userId = mongoose.Types.ObjectId(req.query.creator);
    } else {
      // If no specific creator is provided, use the authenticated user's ID
      const user = await User.findById(req.userId);
      if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 401;
        error.status = "error";
        throw error;
      }
      userId = user._id;
    }

    // Define the query object
    const query = {
      creator: userId,
      status: "active",
    };
    // Add optional filters
    if (req.query.category && req.query.category !== "All") {
      query.goalCategory = req.query.category;
    }
    // Sort options
    let sortOption = {};
    if (req.query.sort === "Most Recent") {
      sortOption = { createdAt: -1 }; // Sort by most recent
    } else if (req.query.sort === "Oldest") {
      sortOption = { createdAt: 1 }; // Sort by oldest
    } else if (req.query.sort === "High to Low") {
      sortOption = { goalPrice: -1 }; // Sort by price high to low
    } else if (req.query.sort === "Low to High") {
      sortOption = { goalPrice: 1 }; // Sort by price low to high
    }
    // Define the aggregation pipeline to fetch user data along with goals
    const pipeline = [
      {
        $match: query, // Match the goals based on the query
      },
      {
        $lookup: {
          from: "users", // Users collection
          localField: "creator",
          foreignField: "_id",
          as: "userData", // Output field containing user data
        },
      },
      {
        $unwind: "$userData", // Deconstruct the array created by $lookup
      },
      {
        $project: {
          "userData.password": 0, // Exclude password field
          "userData.__v": 0,
          "userData.agreeTermConditions": 0,
          "userData.cart": 0,
          "userData.followers": 0,
          "userData.displayNameInPublicRankingPage": 0,
          "userData.surpriceContribution": 0,
          "userData.setAutoPost": 0,
          "userData.status": 0,
          "userData.role": 0,
          "userData.createdAt": 0,
          "userData.email": 0,
          "userData.firstName": 0,
          "userData.lastName": 0,
          "userData.promotionCompany": 0,
          "userData.surpriceContributionAmount": 0,
          "userData.bannerImage": 0,
          "userData.profileImage": 0,
          "userData.socialLinks": 0,
          "userData.updatedAt": 0,
          "userData._id": 0,
          "userData.userName": 0,
        },
      },
    ];
    // Check if sortOption is not empty and add $sort stage accordingly
    if (Object.keys(sortOption).length !== 0) {
      pipeline.push({ $sort: sortOption });
    }
    // Execute the aggregation pipeline
    const goals = await Goal.aggregate(pipeline);
    res.status(200).json({
      status: "success",
      message: "Get goals data successfully",
      data: goals,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getGoals = async (req, res, next) => {
  // console.log("category", req.query.category);
  // console.log("sort", req.query.sort);
  try {
    let userId;
    // Check if a specific creator is provided in the request parameters
    if (req.query.creator) {
      userId = mongoose.Types.ObjectId(req.query.creator);
    } else {
      // If no specific creator is provided, use the authenticated user's ID
      const user = await User.findById(req.userId);
      if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 401;
        error.status = "error";
        throw error;
      }
      userId = user._id;
    }

    // Define the query object
    const query = {
      creator: userId,
      status: "active",
    };

    // Add optional filters
    if (req.query.category && req.query.category !== "All") {
      query.goalCategory = req.query.category;
    }

    // Define default sorting option
    let sortOption = {};

    // Sorting options
    switch (req.query.sort) {
      case "Most Recent":
        sortOption = { createdAt: -1 }; // Sort by most recent
        break;
      case "Oldest":
        sortOption = { createdAt: 1 }; // Sort by oldest
        break;
      case "High to Low":
        sortOption = { goalPrice: -1 }; // Sort by price high to low
        break;
      case "Low to High":
        sortOption = { goalPrice: 1 }; // Sort by price low to high
        break;
      default:
        // Default sorting by goalPrice in ascending order
        sortOption = { goalOrderBy: 1 };
        break;
    }

    // Define the aggregation pipeline to fetch user data along with goals
    const pipeline = [
      {
        $match: query, // Match the goals based on the query
      },
      {
        $lookup: {
          from: "users", // Users collection
          localField: "creator",
          foreignField: "_id",
          as: "userData", // Output field containing user data
        },
      },
      {
        $unwind: "$userData", // Deconstruct the array created by $lookup
      },
      {
        $project: {
          "userData.password": 0, // Exclude password field
          "userData.__v": 0,
          "userData.agreeTermConditions": 0,
          "userData.cart": 0,
          "userData.followers": 0,
          "userData.displayNameInPublicRankingPage": 0,
          "userData.surpriceContribution": 0,
          "userData.setAutoPost": 0,
          "userData.status": 0,
          "userData.role": 0,
          "userData.createdAt": 0,
          "userData.email": 0,
          "userData.firstName": 0,
          "userData.lastName": 0,
          "userData.promotionCompany": 0,
          "userData.surpriceContributionAmount": 0,
          "userData.bannerImage": 0,
          "userData.profileImage": 0,
          "userData.socialLinks": 0,
          "userData.updatedAt": 0,
          "userData._id": 0,
          "userData.userName": 0,
        },
      },
    ];

    // Check if sortOption is not empty and add $sort stage accordingly
    if (Object.keys(sortOption).length !== 0) {
      pipeline.push({ $sort: sortOption });
    }

    // Execute the aggregation pipeline
    const goals = await Goal.aggregate(pipeline);
    res.status(200).json({
      status: "success",
      message: "Get goals data successfully",
      data: goals,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.editOrderByMultiple = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const validationError = new Error("Validation failed.");
      validationError.statusCode = 422;
      validationError.status = "error";
      validationError.data = errors.array();
      throw validationError;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 401;
      error.status = "error";
      throw error;
    }

    const { goals } = req.body;

    // Iterate through each goal data and update the goalOrderBy
    const promises = goals.map(async (goalData) => {
      const { goalId, goalOrderBy } = goalData;

      // Find the goal to be updated
      let goal = await Goal.findById(goalId);

      if (!goal) {
        const error = new Error(`Goal with ID ${goalId} not found.`);
        error.statusCode = 404;
        error.status = "error";
        throw error;
      }

      // Check if the authenticated user is the creator of the goal
      if (String(goal.creator) !== req.userId) {
        const error = new Error("Unauthorized access.");
        error.statusCode = 403;
        error.status = "error";
        throw error;
      }

      // Update the goalOrderBy field
      goal.goalOrderBy = goalOrderBy;

      // Save the updated goal
      return goal.save();
    });

    // Wait for all updates to complete
    await Promise.all(promises);

    res.status(200).json({
      status: "success",
      message: "Goal orders updated successfully",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const validationError = new Error("Validation failed.");
      validationError.statusCode = 422;
      validationError.status = "error";
      validationError.data = errors.array();
      throw validationError;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 401;
      error.status = "error";
      throw error;
    }

    const { goalId } = req.params;

    // Check if the goal exists and if the authenticated user is the creator
    const goal = await Goal.findOne({ _id: goalId, creator: req.userId });
    if (!goal) {
      const error = new Error(
        "Goal not found or you're not authorized to edit this goal."
      );
      error.statusCode = 404;
      error.status = "error";
      throw error;
    }

    // Update the goal fields
    if (req.body.goalName) goal.goalName = req.body.goalName;
    if (req.body.goalPrice) goal.goalPrice = req.body.goalPrice;
    if (req.body.goalType) goal.goalType = req.body.goalType;
    if (req.body.goalCategory) goal.goalCategory = req.body.goalCategory;
    if (req.body.goalPurchaseType)
      goal.goalPurchaseType = req.body.goalPurchaseType;
    if (req.body.subscriptionType)
      goal.subscriptionType = req.body.subscriptionType;

    // Handle goalImage update
    if (req.file) {
      // Extract the file name and path from Multer
      const fileName = req.file.filename;
      goal.goalImage = fileName; // Update goalImage field
    }

    // Save the updated goal
    const updatedGoal = await goal.save();

    res.status(200).json({
      status: "success",
      message: "Goal updated successfully",
      data: updatedGoal,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { goalId } = req.params;

    // Find the goal in the database
    const goal = await Goal.findById(goalId);

    if (!goal) {
      const error = new Error("Goal not found.");
      error.statusCode = 404;
      throw error;
    }

    // Check if the authenticated user is the creator of the goal
    if (goal.creator.toString() !== req.userId) {
      const error = new Error("You are not authorized to delete this goal.");
      error.statusCode = 403;
      throw error;
    }

    // Unlink the goalImage from storage
    if (goal.goalImage) {
      const imagePath = path.join(__dirname, "../uploads/", goal.goalImage);
      fs.unlinkSync(imagePath);
    }

    // Delete the goal from the database
    await Goal.findByIdAndDelete(goalId);

    res.status(200).json({
      status: "success",
      message: "Goal deleted successfully",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
