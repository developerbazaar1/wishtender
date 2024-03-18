const express = require("express");
const {
  getAllMessageActivity,
  sendMessage,
} = require("../controllers/message");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/getActivity-message", isAuth, getAllMessageActivity);
router.post("/sendActivity-message", isAuth, sendMessage);

module.exports = router;
