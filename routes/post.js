const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const checkAuth = require("../middleware/auth");

router.post("/post", postController.Post);
router.get("/posts", postController.GetPosts);
router.get("/postById/:id", postController.GetPostById);
router.put("/updatePost/:postId", postController.UpdatePostById);
router.delete("/deletePost/:postId", postController.DeletePostById);
router.put("/updateLikeCount/:id", postController.UpdateLikeCount);
router.get("/likeCount/:id", postController.ReturnLikeCount);
router.put("/pushLikeUsers/:postId", postController.UpdateLikeUsers);
router.put("/pullLikeUsers/:postId", postController.DeleteLikeUsers);
router.get("/likepost/:userId/:postId", postController.getlike);
router.get("/checkuniqueUrl/:title", postController.CheckUniqueUrl);
router.get("/getpost/:postUrl", postController.GetPostByUrl);
router.get("/getpostByUserId/:userId", postController.GetPostByUserId);
router.put("/updateBookmarkCount/:id", postController.UpdateBookmarkCount);
router.get("/getLatestPost", postController.GetLatestPost);
router.get("/getPopularPost", postController.GetPopularPost);

module.exports = router;
