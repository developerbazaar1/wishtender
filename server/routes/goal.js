const express = require("express");
const { body, file, param } = require("express-validator");

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

// Edit goalOrderBy for multiple goals
router.put(
  "/edit/order",
  isAuth,
  checkRole("fighter"),
  [
    body("goals")
      .isArray({ min: 1 })
      .withMessage("At least one goal data is required"),
    body("goals.*.goalId")
      .notEmpty()
      .withMessage("Goal ID is required")
      .isMongoId()
      .withMessage("Invalid goal ID"),
    body("goals.*.goalOrderBy")
      .notEmpty()
      .withMessage("Goal order number is required")
      .isInt({ min: 1 })
      .withMessage("Invalid goal order number"),
  ],
  goalController.editOrderByMultiple
);

// Route for editing a goal
router.put(
  "/edit/:goalId",
  upload.single("goalImage"), // Add multer middleware for goalImage upload
  isAuth,
  checkRole("fighter"),
  [
    param("goalId").notEmpty().withMessage("Goal ID is required"),
    body("goalName").optional().trim(),
    body("goalPrice").optional(),
    body("goalType").optional().trim(),
    body("goalCategory").optional().trim(),
    body("goalPurchaseType").optional().trim(),
    body("subscriptionType").optional().trim(),
  ],
  goalController.edit
);

// delete goal
router.delete(
  "/delete/:goalId",
  isAuth,
  checkRole("fighter"),
  goalController.delete
);

module.exports = router;
