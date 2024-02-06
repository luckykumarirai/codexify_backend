const express = require("express");
const router = express.Router();
const userController = require("../controllers/postrecommendation");

router.get("/recommendation", userController.GetpostRecommendation);

module.exports = router;
