const express = require("express");
const router = express.Router();
const userProfileController = require("../controllers/userProfileController");

router.post("/follow/:userId", userProfileController.Follow);
router.post("/unfollow/:userId", userProfileController.Unfollow);
router.get("/getfollowers/:userId", userProfileController.GetFollowers);
router.get("/getfollowing/:userId", userProfileController.GetFollowing);
router.post("/bookmarkPost/:userId", userProfileController.BookmarkPost);
router.post(
  "/removeBookmarkPost/:userId",
  userProfileController.RemoveBookmarkPost
);
router.get(
  "/getuserProfileById/:userId",
  userProfileController.GetUserProfileById
);
router.get("/getBookmarkPost/:userId", userProfileController.GetBookmark);
router.get("/getBookmaredPostDetails/:userId", userProfileController.GetBookmarPostDeatils);
module.exports = router;
