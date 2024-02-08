const { validationResult } = require("express-validator");
const Goal = require("../models/goal");
const User = require("../models/user");
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

    const { goalName, goalPrice, goalType, goalCategory, goalPurchaseType } =
      req.body;

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
    const goal = await Goal.findById(goalId);

    // Check if the goal exists
    if (!goal) {
      const error = new Error("Goal not found.");
      error.statusCode = 404;
      error.status = "error";
      throw error;
    }

    res.status(200).json({
      status: "success",
      message: "Get goal details successfully",
      data: goal,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getGoals = async (req, res, next) => {
  try {
    let userId;

    // Check if a specific creator is provided in the request parameters
    if (req.query.creator) {
      userId = req.query.creator;
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
    if (req.query.category && req.query.category !== "all") {
      query.goalCategory = req.query.category;
    }

    // Sort options
    let sortOption = {};

    if (req.query.sort === "most-recent") {
      sortOption = { createdAt: -1 }; // Sort by most recent
    } else if (req.query.sort === "oldest") {
      sortOption = { createdAt: 1 }; // Sort by oldest
    } else if (req.query.sort === "price-high-to-low") {
      sortOption = { goalPrice: -1 }; // Sort by price high to low
    } else if (req.query.sort === "price-low-to-high") {
      sortOption = { goalPrice: 1 }; // Sort by price low to high
    } else {
      // Default sorting (e.g., show all data)
      sortOption = {};
    }

    // Fetch goals with optional filters and sorting
    const goals = await Goal.find(query).sort(sortOption);

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
