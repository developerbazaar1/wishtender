const Category = require("../models/Category"); // Assuming the model is imported correctly
const mongoose = require("mongoose");

exports.addCategory = async (req, res, next) => {
  const { categoryname } = req.body;

  try {
    if (!categoryname) {
      const error = new Error("Please Provide a Category name!");
      error.statusCode = 400; // Bad request
      throw error;
    }

    // Create the category using async/await
    const createdCategory = await Category.create({
      categoryName: categoryname,
    });

    res.status(201).json({
      status: "success",
      message: "Category created successfully",
      data: createdCategory,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500; // Internal server error
    }
    next(error); // Pass the error to the error handling middleware
  }
};

exports.getAllCategory = async (req, res, next) => {
  try {
    const category = await Category.find({});
    return res.status(200).json({
      status: "success",
      message: "successfully fetched data",
      category,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500; // Internal server error
    }
    next(error);
  }
};
