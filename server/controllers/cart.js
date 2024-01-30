const { validationResult } = require("express-validator");
const User = require("../models/user");
const Goal = require("../models/goal");
const Order = require("../models/order");
const mongoose = require("mongoose");

exports.addToCart = async (req, res, next) => {
    try {
        const { goalId, quantity, goalType, amount, senderMessage, fighterId, shopType } = req.body;
        const userId = req.userId; 

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        if(shopType && shopType == 'surprise'){

             // Check if the goal exists and is active
             const fighter = await User.findOne({ _id: fighterId, status: 'active', role: 'fighter' });
             if (!fighter) {
                 return res.status(404).json({ error: 'Fighter not found or not active' });
             }

            
           // Find existing surprise cart item
            const existingSurpriseItemIndex = user.cart.findIndex(item => item.shopType === 'surprise' && item.fighterId && item.fighterId.toString() === fighterId.toString());

            if (existingSurpriseItemIndex !== -1) {
                // Surprise item exists, update the amount
                user.cart[existingSurpriseItemIndex].amount = (parseFloat(user.cart[existingSurpriseItemIndex].amount) + parseFloat(amount)).toFixed(2);
            } else {
                // Surprise item does not exist, add a new one
                user.cart.push({
                    shopType: 'surprise',
                    fighterId: mongoose.Types.ObjectId(fighterId), // convert fighterId to ObjectId
                    amount: parseFloat(amount).toFixed(2), // convert amount to number and fix to 2 decimal places
                    senderMessage: senderMessage
                });
            }



            // Save the user with the updated cart
            await user.save();
        
            res.status(200).json({ message: 'Surprise added to cart successfully', cart: user.cart });

        }else{

            // Check if the goal exists and is active
            const goal = await Goal.findOne({ _id: goalId, status: 'active' });
            if (!goal) {
                return res.status(404).json({ error: 'Goal not found or not active' });
            }
            
            // Check if the user is not the creator of the goal
            if (userId === goal.creator.toString()) {
                return res.status(403).json({ error: 'User cannot add their own goal to the cart' });
            }
        
            // Check if the goal's purchase type is 'single'
            if (goal.goalPurchaseType === 'single') {
                // Check if the item is not already in the user's cart
                const isItemInCart = user.cart.some(item => item.goal.equals(goalId));
                if (isItemInCart) {
                    return res.status(400).json({ error: 'Item is already in the cart' });
                }
            }
        
            // Push the data directly into user's cart
            
            const existingCartItem = user.cart.findIndex(item => item.shopType === 'goal' && item.goal && item.goal.toString() === goalId.toString());
           
            if (existingCartItem !== -1) {
                user.cart[existingCartItem].quantity = (parseFloat(user.cart[existingCartItem].quantity) + parseFloat(quantity));
           
            } else {
                user.cart.push({
                    goal: goalId,
                    quantity: quantity,
                    goalType: goalType,
                    amount: amount,
                    senderMessage:senderMessage
                });
            }
        
            // Save the user with the updated cart
            await user.save();
        
            res.status(200).json({ message: 'Goal added to cart successfully', cart: user.cart });
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

        // Initialize total amount variable
        let totalAmount = 0;

        // Return the user's cart with all goal details and creator data (name and profileImage)
        const cartWithDetails = await Promise.all(user.cart.map(async cartItem => {
            // Convert amount and quantity to numbers
            const itemAmount = Number(cartItem.amount) || 0;
            const itemQuantity = Number(cartItem.quantity) || 1;

            // Update total amount by multiplying quantity and amount
            totalAmount += itemAmount * itemQuantity;

            let result;

            if (cartItem.goal) {
                result = {
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
                        // Include other goal details as needed
                        // ...
                    },
                    id: cartItem._id,
                    quantity: itemQuantity,
                    goalType: cartItem.goalType,
                    amount: itemAmount,
                    senderMessage: cartItem.senderMessage,
                };
            } else if (cartItem.shopType === "surprise") {
                // Fetch fighter details from your database (Assuming you have a Fighter model)
                const fighter = await User.findById(cartItem.fighterId);
                result = {
                    shopType: "surprise",
                    _id: cartItem._id,
                    fighterId: cartItem.fighterId,
                    amount: cartItem.amount || 0, // You can set a default value
                    senderMessage: cartItem.senderMessage || '',
                    // Add fighter details if available
                    fighterName: fighter ? fighter.userName : '',
                    fighterProfileImage: fighter ? fighter.profileImage : '',
                };
            } else {
                // Handle other cases if needed
                result = {};
            }

            return result;
        }));

        // Sort the cart items based on the creator's name if available
        cartWithDetails.sort((a, b) => {
            const creatorA = (a.goal?.creator?.name || '').toLowerCase();
            const creatorB = (b.goal?.creator?.name || '').toLowerCase();
            return creatorA.localeCompare(creatorB);
        });

        res.status(200).json({ cart: cartWithDetails, totalAmount });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'Internal Server Error' });
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
          return res.status(404).json({ error: 'User not found' });
      }

      // Find the item in the user's cart
      const cartItem = user.cart.id(itemId);
      if (!cartItem) {
          return res.status(404).json({ error: 'Item not found in the cart' });
      }

      // Update the cart item
      cartItem.quantity = quantity;
      cartItem.amount = amount;
      cartItem.senderMessage = senderMessage;

      // Save the user with the updated cart
      await user.save();

      res.status(200).json({ message: 'Cart item updated successfully', cart: user.cart });
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
          return res.status(404).json({ error: 'User not found' });
      }

      // Find the item in the user's cart
      const cartItem = user.cart.id(itemId);
      if (!cartItem) {
          return res.status(404).json({ error: 'Item not found in the cart' });
      }

      // Remove the item from the cart
      cartItem.remove();

      // Save the user with the updated cart
      await user.save();

      res.status(200).json({ message: 'Cart item deleted successfully', cart: user.cart });
  } catch (err) {
      if (!err.statusCode) {
          err.statusCode = 500;
      }
      next(err);
  }
};



