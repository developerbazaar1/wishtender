const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const userController = require("../controllers/user");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", isAuth, userController.getUser);

router.patch("/update", isAuth, userController.updateUser);

router.patch(
  "/change-password",
  isAuth,
  [body("newPassword").trim().isLength({ min: 5 })],
  userController.changePassword
);

router.patch(
  "/delete-account",
  isAuth,
  [body("password").trim().not().isEmpty()],
  userController.deleteUserAccount
);

// Add this line to your existing routes setup
router.put('/social-links', isAuth, userController.updateUserSocialLinks);


router.get("/fighters", isAuth, userController.getFighters);

// Follow or unfollow a fighter
router.post('/:fighterId/:action', isAuth, userController.manageFollow);


// Add the new endpoint to get followed fighters
router.get('/followed-fighters', isAuth, userController.getFollowedFighters);

router.get("/fighter/:fighterId", isAuth, userController.getFighter);

module.exports = router;