const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const orderController = require("../controllers/order");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// Add a route for checkout
router.post('/create', isAuth, orderController.checkout);

router.put('/update/:orderId', isAuth, orderController.updateOrder);

router.get('/getActivityGoals', isAuth, orderController.getActivityGoals);


module.exports = router;