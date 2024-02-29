const express = require("express");
const { body, file } = require("express-validator");

const goalController = require("../controllers/goal");
const isAuth = require("../middleware/is-auth");
const checkRole = require("../middleware/checkRole");
const router = express.Router();
const upload = require("../middleware/handleFileUpload");

router.get("/all", isAuth, goalController.getGoals);

router.get("/:goalId", isAuth, goalController.getGoalDetails);

router.post(
  "/create",
  upload.single("image"),
  isAuth,
  checkRole("fighter"),
  [
    body("goalName")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Goal name is required"),
    body("goalPrice").not().isEmpty().withMessage("Goal price is required"),
    body("goalType").not().isEmpty().withMessage("Goal type is required"),
    body("goalCategory")
      .not()
      .isEmpty()
      .withMessage("Goal category is required"),

    (req, res, next) => {
      // Check if the "goalImage" field is present in the request
      if (!req.file) {
        return res.status(422).json({
          status: "error",
          message: "Validation failed.",
          data: [
            {
              type: "field",
              msg: "Goal image is required",
              path: "goalImage",
              location: "body",
            },
          ],
        });
      }
      next();
    },
  ],

  goalController.create
);

module.exports = router;
