const { validationResult } = require("express-validator");
const User = require("../models/user");
const Goal = require("../models/goal");
const Order = require("../models/order");
const Transaction = require("../models/transaction");
const mongoose = require("mongoose");

exports.checkout = async (req, res, next) => {
  try {
      const { currency, paymentMethod, transactionId, paidDate, status } = req.body;
      const userId = req.userId;

      // Check if the user exists
      const user = await User.findById(userId).populate({
          path: 'cart.goal',
          populate: {
              path: 'creator',
              model: 'User',
              select: '_id userName profileImage',
          },
      });

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Check if the user's cart is empty
      if (user.cart.length === 0) {
          return res.status(400).json({ error: 'Cart is empty. Add items before creating an order.' });
      }

      // Calculate total amount from the user's cart
      const totalAmount = user.cart.reduce((sum, cartItem) => {
          const itemAmount = parseFloat(cartItem.amount) || 0;
          const itemQuantity = parseFloat(cartItem.quantity) || 1;
          return sum + itemAmount * itemQuantity;
      }, 0).toFixed(2); // Assuming two decimal places for the total amount

      // Create items array for the order
      const orderItems = await Promise.all(user.cart.map(async cartItem => {
          let orderItem;

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
              // Fetch fighter details from your database (Assuming you have a Fighter model)
              const fighter = await User.findById(cartItem.fighterId);

              orderItem = {
                  shopType: "surprise",
                  fighterId: cartItem.fighterId,
                  amount: cartItem.amount || 0, // You can set a default value
                  senderMessage: cartItem.senderMessage || '',
                  // Add fighter details if available
                  fighterName: fighter ? fighter.userName : '',
                  fighterProfileImage: fighter ? fighter.profileImage : '',
              };
          }

          return orderItem;
      }));

      // Create an order object
      const order = new Order({
          userId: userId,
          Totalamount: totalAmount,
          currency: currency,
          paymentMethod: paymentMethod,
        //   transactionId: transactionId,
        //   paidDate: paidDate,
          status: status,
          items: orderItems,
      });

      // Save the order
      await order.save();

      // Clear the user's cart after creating the order
      user.cart = [];
      await user.save();

      res.status(201).json({ message: 'Order created successfully', order });
  } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(500).json({ error: 'Internal Server Error' });
  }
};




exports.updateOrder = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const { status, paymentMethod, transactionId, paidDate } = req.body;

    // Check if the order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update the order status
    order.status = status;
    order.paymentMethod = paymentMethod;
    order.transactionId = transactionId;
    order.paidDate = paidDate;

    // Save the updated order
    await order.save();

    // If the order status is 'paid', create a new transaction for each item
    if (status === 'paid') {
      const itemTransactions = [];

      for (const item of order.items) {
        const itemTransaction = new Transaction({
          userId: order.userId,
          orderId: order._id.toString(),
          totalAmount: item.amount, // Assuming item.amount represents the individual item amount
          currency: order.currency,
          paymentMethod,
          transactionId,
          paidDate,
          status,
          shopType: item.shopType,
          fighterId: item.fighterId,
          goalId: item.goalId,
          goalName: item.goalName,
          goalType: item.goalType,
          goalImage: item.goalImage,
          creatorId: item.creatorId,
          creatorName: item.creatorName,
          quantity: item.quantity,
          senderMessage: item.senderMessage,
        });

        itemTransactions.push(itemTransaction);
      }

      // Save all item transactions
      await Transaction.insertMany(itemTransactions);
    }

    res.status(200).json({ message: 'Order status updated successfully', order });
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

    // Define the query object
    const query = {
      shopType: 'goal',
      $or: [{ userId }, { creatorId: userId }], // Fetch goals where userId is creatorId or userId
    };

    // Sort options
    const sortOption = { createdAt: -1 }; // Sort by most recent

    // Fetch goals with optional filters and sorting
    const goals = await Transaction.find(query).sort(sortOption);

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
