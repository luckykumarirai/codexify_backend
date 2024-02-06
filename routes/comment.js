const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const checkAuth = require("../middleware/auth");

router.post("/comment", checkAuth, commentController.Comment);
router.get("/comments", checkAuth, commentController.GetComments);
router.get("/commentById/:postId", checkAuth, commentController.GetCommentById);
router.get(
  "/commentwithReply/:postId",
  // checkAuth,
  commentController.GetCommentWithReply
);
router.get("/getcomments/:postId", commentController.getComments);
router.get("/getcommentsByUserId/:userId", commentController.GetCommentByUserId);
module.exports = router;
