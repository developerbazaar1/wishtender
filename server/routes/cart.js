const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const cartController = require("../controllers/cart");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post("/add", isAuth, cartController.addToCart);

router.get("/view", isAuth, cartController.viewCart);

router.put("/update/:itemId", isAuth, cartController.updateCart);

router.delete("/delete/:itemId", isAuth, cartController.deleteCart);


module.exports = router;