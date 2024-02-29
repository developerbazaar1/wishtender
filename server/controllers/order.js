const { validationResult } = require("express-validator");
const User = require("../models/user");
const Goal = require("../models/goal");
const Order = require("../models/order");
const Transaction = require("../models/transaction");
const mongoose = require("mongoose");

exports.checkout = async (req, res, next) => {
  try {
    const { currency, paymentMethod, fighterId, status } = req.body;
    const userId = req.userId;
    const user = await User.findById(userId).populate({
      path: "cart.goal",
      populate: {
        path: "creator",
        model: "User",
        select: "_id userName profileImage",
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.cart.length === 0) {
      return res
        .status(400)
        .json({ error: "Cart is empty. Add items before creating an order." });
    }
    let fighterTotalAmount = 0;
    let cartItemIds = [];
    const orderItems = await Promise.all(
      user.cart.map(async (cartItem) => {
        let orderItem;
        if (fighterId == cartItem.fighterId) {
          if (cartItem.goal && cartItem.goal._id) {
            const creator = cartItem.goal.creator;
            orderItem = {
              goalId: cartItem.goal._id,
              goalName: cartItem.goal.goalName,
              goalType: cartItem.goal.goalType,
              goalImage: cartItem.goal.goalImage,
              creatorId: creator ? creator._id : null,
              creatorName: creator ? creator.userName : null,
              quantity: cartItem.quantity,
              amount: cartItem.amount,
              senderMessage: cartItem.senderMessage,
            };
          } else if (cartItem.shopType === "surprise") {
            const fighter = await User.findById(cartItem.fighterId);
            orderItem = {
              shopType: "surprise",
              fighterId: cartItem.fighterId,
              amount: cartItem.amount || 0,
              senderMessage: cartItem.senderMessage || "",
              fighterName: fighter ? fighter.userName : "",
              fighterProfileImage: fighter ? fighter.profileImage : "",
            };
          }
          const itemAmount = Number(cartItem.amount) || 0;
          const itemQuantity = Number(cartItem.quantity) || 1;
          fighterTotalAmount += itemAmount * itemQuantity;
          cartItemIds.push(cartItem._id);
        }
        return orderItem;
      })
    );
    const filteredOrderItems = orderItems.filter(
      (item) => item !== null && item !== undefined
    );
    const order = new Order({
      userId: userId,
      Totalamount: fighterTotalAmount,
      currency: currency,
      paymentMethod: paymentMethod,
      cartItemIds: cartItemIds,
      status: status,
      items: filteredOrderItems,
    });
    await order.save();
    // Clear the user's cart after creating the order
    // user.cart = [];
    // await user.save();
    res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const { status, paymentMethod, transactionId, paidDate } = req.body;
    // Check if the order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    // Update the order status
    order.status = status;
    order.paymentMethod = paymentMethod;
    order.transactionId = transactionId;
    order.paidDate = paidDate;
    // Save the updated order
    await order.save();
    // If the order status is 'paid', create a new transaction for each item
    if (status === "paid") {
      const itemTransactions = [];
      for (const item of order.items) {
        const itemTransaction = new Transaction({
          userId: order.userId,
          orderId: order._id.toString(),
          TotalAmount: item.amount,
          currency: order.currency,
          paymentMethod,
          transactionId,
          paidDate,
          status,
          shopType: item.shopType,
          fighterId: item.fighterId,
          goalId: item.goalId,
          creatorId: item.creatorId,
          quantity: item.quantity,
          senderMessage: item.senderMessage,
        });
        itemTransactions.push(itemTransaction);
      }
      // Save all item transactions
      await Transaction.insertMany(itemTransactions);
      // Remove cart items using cartItemIds stored in the order
      await User.findByIdAndUpdate(order.userId, {
        $pull: { cart: { _id: { $in: order.cartItemIds } } },
      });
    }
    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getActivityGoals = async (req, res, next) => {
  try {
    const userId = req.userId; // Use authenticated user's ID
    // Ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 401;
      error.status = "error";
      throw error;
    }
    let shopType;
    if (req.query.shopType) {
      shopType = req.query.shopType;
    } else {
      shopType = "goal";
    }
    let goalType;
    if (req.query.goalType) {
      goalType = req.query.goalType;
    }
    // Define the query object
    const query = {
      shopType: shopType,
    };
    // Add userId condition based on fetchByCreatorId and fetchBySender
    if (!req.query.receiving && !req.query.sending) {
      query["$or"] = [{ userId }, { creatorId: userId }];
    }
    if (req.query.receiving) {
      query["creatorId"] = req.query.receiving;
    }
    if (req.query.sending) {
      query["userId"] = req.query.sending;
    }
    // Sort options
    const sortOption = { createdAt: -1 }; // Sort by most recent
    // Fetch goals with optional filters and sorting
    const goals = await Transaction.find(query)
      .sort(sortOption)
      .populate({
        path: "creatorId", // populate creatorId field from User collection
        model: "User", // User model
        select: "userName profileImage firstName lastName promotionCompany", // fields to select from User
      })
      .populate({
        path: "goalId", // populate goalId field from Goal collection
        model: "Goal", // Goal model
        select: "goalName goalType goalImage subscriptionType", // fields to select from Goal
      });
    // .populate({
    //     path: "orderId",
    //     model: "Order",
    //     select: "_id Totalamount currency paymentMethod status items",
    //     populate: {
    //         path: "items",
    //         model: "Order",
    //         select: "shopType fighterId goalId goalName goalType goalImage creatorId creatorName quantity amount senderMessage",
    //     },
    // });
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
