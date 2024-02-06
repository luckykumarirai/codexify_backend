const express = require("express");
const router = express.Router();
const likeController = require("../controllers/likeController");
const checkAuth = require("../middleware/auth");

router.post("/like", likeController.Like);
router.get("/likes", likeController.GetLikes);
router.get("/likesById/:id", likeController.GetLikeById);
router.get("/likeStatus/:userId/:postUrl", likeController.GetStatusUserPost);
router.delete("/dislike/:userId/:postUrl", likeController.disLike);

module.exports = router;
