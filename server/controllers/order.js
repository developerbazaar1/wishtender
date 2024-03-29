const { validationResult } = require("express-validator");
const User = require("../models/user");
const Goal = require("../models/goal");
const Order = require("../models/order");
const Transaction = require("../models/transaction");
const mongoose = require("mongoose");
const transaction = require("../models/transaction");
const goal = require("../models/goal");
const chat = require("../models/ChatModal");
const message = require("../models/MessageModal");

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

    // console.log(order);
    // const updatedTotalFunded = await updateTotalCrowdFundedAmount(order.items);

    // Update the order status
    order.status = status;
    order.paymentMethod = paymentMethod;
    order.transactionId = transactionId;
    order.paidDate = paidDate;
    // Save the updated order
    await order.save();
    // If the order status is 'paid', create a new transaction for each item
    if (status === "paid") {
      await updateTotalCrowdFundedAmount(order.items);

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
          goalType: item.goalType,
          creatorId: item.creatorId,
          quantity: item.quantity,
          senderMessage: item.senderMessage,
        });
        itemTransactions.push(itemTransaction);
      }
      // Save all item transactions
      const insertedTransactions = await Transaction.insertMany(
        itemTransactions
      );
      const createChat = [];

      insertedTransactions.forEach((transactionElement) => {
        let chatItem = new chat();
        if (transactionElement.shopType === "goal") {
          chatItem = {
            transactionId: transactionElement._id,
            ReciverId: mongoose.Types.ObjectId(transactionElement.creatorId),
            senderId: mongoose.Types.ObjectId(transactionElement.userId),
          };
        } else {
          chatItem = {
            transactionId: transactionElement._id,
            ReciverId: mongoose.Types.ObjectId(transactionElement.fighterId),
            senderId: mongoose.Types.ObjectId(transactionElement.userId),
          };
        }

        createChat.push(chatItem);
      });

      const createdChart = await chat.insertMany(createChat);

      createdChart.forEach(async (chatelement) => {
        let content = insertedTransactions.find((element) => {
          if (element._id === chatelement.transactionId) {
            return element.senderMessage;
          }
        });

        const res = await message.create({
          chatId: chatelement._id,
          content: content?.senderMessage || "My Contribution",
          messageSender: mongoose.Types.ObjectId(req.userId),
        });

        const updatedChat = await chat.findByIdAndUpdate(chatelement._id, {
          $set: {
            latestMessage: res._id,
          },
        });
      });

      // Remove cart items using cartItemIds stored in the order
      await User.findByIdAndUpdate(order.userId, {
        $pull: { cart: { _id: { $in: order.cartItemIds } } },
      });

      // const res = await chat.create({});
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

    // Define the query object
    const query = {
      shopType: shopType,
    };

    if (req.query.goalType) {
      query["goalType"] = req.query.goalType;
      // goalType = req.query.goalType;
    }

    let goals; // Declare goals variable outside of the conditional blocks
    if (shopType === "goal") {
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
      goals = await Transaction.find(query)
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
    } else {
      // Add userId condition based on fetchByCreatorId and fetchBySender
      if (!req.query.receiving && !req.query.sending) {
        query["$or"] = [{ userId }, { fighterId: userId }];
      }
      if (req.query.receiving) {
        query["fighterId"] = req.query.receiving;
      }
      if (req.query.sending) {
        query["userId"] = req.query.sending;
      }
      // Sort options
      const sortOption = { createdAt: -1 }; // Sort by most recent
      // Fetch goals with optional filters and sorting
      goals = await Transaction.find(query).sort(sortOption).populate({
        path: "fighterId", // populate creatorId field from User collection
        model: "User", // User model
        select: "userName profileImage firstName lastName promotionCompany", // fields to select from User
      });
    }

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

exports.getTopRankings = async (req, res, next) => {
  try {
    const time = req.query.time;

    const limit = req.query.limit;
    let fromDate, toDate;

    if (!time) {
      const err = new Error("Please Provide The time");
      err.statusCode = 400;
      throw err;
    }

    // Calculate date range based on time parameter
    const currentDate = new Date();
    switch (time) {
      case "Monthly":
        fromDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        ); // Start of current month
        toDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        ); // End of current month
        break;
      case "Quarterly":
        fromDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 3,
          1
        ); // Start of three months ago
        toDate = currentDate; // Current date
        break;
      case "Yearly":
        fromDate = new Date(
          currentDate.getFullYear() - 1,
          currentDate.getMonth(),
          currentDate.getDate()
        ); // One year ago from today
        toDate = currentDate; // Current date
        break;
      default:
        const err = new Error("Invalid time parameter");
        err.statusCode = 400; // Bad Request
        throw err;
    }

    const data = await transaction.find({
      createdAt: {
        $gte: fromDate,
        $lte: toDate,
      },
    });

    const creatorIdTotals = {};

    data.forEach((item) => {
      const { creatorId, TotalAmount, fighterId } = item;
      if (creatorId) {
        if (!creatorIdTotals[creatorId]) {
          creatorIdTotals[creatorId] = 0;
        }
        creatorIdTotals[creatorId] += parseInt(TotalAmount);
      } else {
        if (!creatorIdTotals[fighterId]) {
          creatorIdTotals[fighterId] = 0;
        }
        creatorIdTotals[fighterId] += parseInt(TotalAmount);
      }
    });

    const sortedCreatorIds = Object.entries(creatorIdTotals).sort(
      (a, b) => b[1] - a[1]
    );

    const detailedCreatorData = [];
    for (const key in sortedCreatorIds) {
      // console.log("this is key", sortedCreatorIds[key][0]);
      const creatorDetails = await fetchCreatorDetaisl(
        mongoose.Types.ObjectId(sortedCreatorIds[key][0])
      );
      if (creatorDetails === null) {
        continue;
      }
      detailedCreatorData.push(creatorDetails);
    }
    // console.log(detailedCreatorData);

    res.status(200).json({
      status: "scuccess",
      data: detailedCreatorData,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

async function fetchCreatorDetaisl(creatorId) {
  try {
    // console.log(creatorId);
    const creator = await User.findOne({
      _id: creatorId,
      displayNameInPublicRankingPage: true,
    }).select({
      userName: 1,
      firstName: 1,
      lastName: 1,
      promotionCompany: 1,
      profileImage: 1,
    });
    // console.log(creator);
    return creator;
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    throw error;
  }
}

//helper function to find and update crowd funded totalFundedAmount

async function updateTotalCrowdFundedAmount(items, limit) {
  try {
    let count = 0;
    for (const item of items) {
      // Check if the limit has been reached
      if (limit && count >= limit) {
        break; // Exit the loop if the limit has been reached
      }

      await Goal.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(item.goalId),
          goalType: "crowd",
        },
        {
          $inc: { TotalCrowdFunded: +item.amount },
        }
      );

      count++;
    }
  } catch (error) {
    throw error;
  }
}
