const category = require("../models/Category");
const categoryController = require("../controllers/category");
const router = require("express").Router();

router.post("/create", categoryController.addCategory);
router.get("/all", categoryController.getAllCategory);

module.exports = router;
