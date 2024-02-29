const { validationResult } = require("express-validator");
const User = require("../models/user");
const Goal = require("../models/goal");
const Order = require("../models/order");
const mongoose = require("mongoose");

exports.addToCart = async (req, res, next) => {
  try {
    const {
      goalId,
      quantity,
      goalType,
      amount,
      senderMessage,
      fighterId,
      shopType,
    } = req.body;
    const userId = req.userId;
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (shopType && shopType === "surprise") {
      // Check if the goal exists and is active
      const fighter = await User.findOne({
        _id: fighterId,
        status: true,
        role: "fighter",
      });
      if (!fighter) {
        return res
          .status(404)
          .json({ error: "Fighter not found or not active" });
      }
      // Find existing surprise cart item
      const existingSurpriseItemIndex = user.cart.findIndex(
        (item) =>
          item.shopType === "surprise" &&
          item.fighterId &&
          item.fighterId.toString() === fighterId.toString()
      );
      if (existingSurpriseItemIndex !== -1) {
        // Surprise item exists, update the amount
        user.cart[existingSurpriseItemIndex].amount = (
          parseFloat(user.cart[existingSurpriseItemIndex].amount) +
          parseFloat(amount)
        ).toFixed(2);
      } else {
        // Surprise item does not exist, add a new one
        user.cart.push({
          shopType: "surprise",
          fighterId: mongoose.Types.ObjectId(fighterId), // convert fighterId to ObjectId
          amount: parseFloat(amount).toFixed(2), // convert amount to number and fix to 2 decimal places
          senderMessage: senderMessage,
        });
      }
      // Save the user with the updated cart
      await user.save();
      res.status(200).json({
        message: "Surprise added to cart successfully",
        cart: user.cart,
      });
    } else {
      // Check if the goal exists and is active
      const goal = await Goal.findOne({ _id: goalId, status: "active" });
      if (!goal) {
        return res.status(404).json({ error: "Goal not found or not active" });
      }
      // Check if the user is not the creator of the goal
      if (userId === goal.creator.toString()) {
        return res
          .status(403)
          .json({ error: "User cannot add you own goal to the cart" });
      }
      // Check if the goal's purchase type is 'single'
      if (goal.goalPurchaseType === "single") {
        // Check if the item is not already in the user's cart
        const isItemInCart = user.cart.some((item) =>
          item?.goal?.equals(goalId)
        );
        if (isItemInCart) {
          return res.status(400).json({ error: "Item is already in the cart" });
        }
      }
      // Push the data directly into user's cart
      const existingCartItem = user.cart.findIndex(
        (item) =>
          item.shopType === "goal" &&
          item.goal &&
          item.goal.toString() === goalId.toString()
      );
      if (existingCartItem !== -1) {
        user.cart[existingCartItem].quantity =
          parseFloat(user.cart[existingCartItem].quantity) +
          parseFloat(quantity);
      } else {
        user.cart.push({
          goal: goalId,
          quantity: quantity,
          goalType: goalType,
          fighterId: mongoose.Types.ObjectId(fighterId),
          amount: amount,
          senderMessage: senderMessage,
        });
      }
      // Save the user with the updated cart
      await user.save();
      res
        .status(200)
        .json({ message: "Goal added to cart successfully", cart: user.cart });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.viewCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    // Check if the user exists
    const user = await User.findById(userId).populate({
      path: "cart.goal",
      populate: {
        path: "creator",
        model: "User",
        select: "_id userName profileImage currency firstName lastName",
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Initialize total amount variable
    let totalAmount = 0;
    // Group cart items by fighterId
    const groupedCart = {};
    user.cart.forEach((cartItem) => {
      if (cartItem.fighterId) {
        if (!groupedCart[cartItem.fighterId]) {
          groupedCart[cartItem.fighterId] = [];
        }
        groupedCart[cartItem.fighterId].push(cartItem);
      }
    });

    const formattedCart = [];
    // Process each fighter's cart items and compute sum of individual fighter cart items amount
    for (const fighterId of Object.keys(groupedCart)) {
      // Fetch fighter details
      const fighter = await User.findById(fighterId);
      if (fighter) {
        let fighterTotalAmount = 0; // Initialize total amount for the fighter
        const fighterDetails = {
          wisher: {
            fighterId: fighter._id,
            FirstName: fighter.firstName,
            LastName: fighter.lastName,
            UserName: fighter.userName,
            Currency: fighter.currency,
            ProfileImage: fighter.profileImage,
          },
          cartItems: [],
          fighterTotalAmount: 0, // Initialize fighter's total amount in fighterDetails
        };
        // Process each cart item for the fighter
        groupedCart[fighterId].forEach((cartItem) => {
          // Convert amount and quantity to numbers
          const itemAmount = Number(cartItem.amount) || 0;
          const itemQuantity = Number(cartItem.quantity) || 1;
          // Update total amount by multiplying quantity and amount
          totalAmount += itemAmount * itemQuantity;
          fighterTotalAmount += itemAmount * itemQuantity; // Update fighter's total amount
          let formattedCartItem;
          if (cartItem.goal) {
            formattedCartItem = {
              goal: {
                _id: cartItem.goal._id,
                goalName: cartItem.goal.goalName,
                goalType: cartItem.goal.goalType,
                goalImage: cartItem.goal.goalImage,
                creator: cartItem.goal.creator
                  ? {
                      _id: cartItem.goal.creator._id,
                      name: cartItem.goal.creator.userName,
                      profileImage: cartItem.goal.creator.profileImage,
                    }
                  : null,
              },
              shopType: "goal",

              _id: cartItem._id,
              quantity: itemQuantity,
              goalType: cartItem.goalType,
              amount: itemAmount,
              senderMessage: cartItem.senderMessage,
              subscriptionType: cartItem?.goal?.subscriptionType,
            };
          } else if (cartItem.shopType === "surprise") {
            formattedCartItem = {
              shopType: "surprise",
              _id: cartItem._id,
              fighterId: cartItem.fighterId,
              amount: cartItem.amount || 0, // You can set a default value
              senderMessage: cartItem.senderMessage || "",
            };
          }
          fighterDetails.cartItems.push(formattedCartItem);
        });
        // Set fighter's total amount in fighterDetails
        fighterDetails.fighterTotalAmount = fighterTotalAmount;
        // Push fighterDetails to formattedCart array
        formattedCart.push(fighterDetails);
      }
    }
    res.status(200).json({ cart: formattedCart, totalAmount });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const itemId = req.params.itemId;
    const { quantity, amount, senderMessage } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the item in the user's cart
    const cartItem = user.cart.id(itemId);
    if (!cartItem) {
      return res.status(404).json({ error: "Item not found in the cart" });
    }

    // Update the cart item
    cartItem.quantity = quantity;
    cartItem.amount = amount;
    cartItem.senderMessage = senderMessage;

    // Save the user with the updated cart
    await user.save();

    res
      .status(200)
      .json({ message: "Cart item updated successfully", cart: user.cart });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const itemId = req.params.itemId;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the item in the user's cart
    const cartItem = user.cart.id(itemId);
    if (!cartItem) {
      return res.status(404).json({ error: "Item not found in the cart" });
    }

    // Remove the item from the cart
    cartItem.remove();

    // Save the user with the updated cart
    await user.save();

    res
      .status(200)
      .json({ message: "Cart item deleted successfully", cart: user.cart });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
