const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signup = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.status = "error";
      error.data = errors.array();
      throw error;
    }

    let { email, password, agreeTermConditions } = req.body;

    bcrypt
      .hash(password, 12)
      .then((hashedPw) => {
        const user = new User({
          email: email,
          password: hashedPw,
          agreeTermConditions: agreeTermConditions,
        });
        return user.save();
      })
      .then((result) => {
        return res.status(200).json({
          status: "success",
          message: "User created!",
          userId: result._id,
        });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        throw err;
      });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    const loadedUser = await User.findOne({ email: email });
    if (!loadedUser) {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      error.status = "error";
      throw error;
    }
    const isEqual = await bcrypt.compare(password, loadedUser.password);
    if (!isEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      error.status = "error";
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      },
      "somesupersecretsecret",
      { expiresIn: "100h" }
    );
    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      token: token,
      userId: loadedUser._id.toString(),
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUserStatus = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        error.status = "error";
        throw error;
      }
      res.status(200).json({ status: user.status });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateUserStatus = (req, res, next) => {
  const newStatus = req.body.status;
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        error.status = "error";
        throw error;
      }
      user.status = newStatus;
      return user.save();
    })
    .then((result) => {
      res
        .status(200)
        .json({ status: "success", message: "User updated successfully." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
