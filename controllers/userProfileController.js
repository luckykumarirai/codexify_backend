const User = require("../models/userDBModel");
const UserProfile = require("../models/userProfileDBModel");
const Post = require("../models/postDBModel");

var userController = {
  async Follow(req, res) {
    try {
      const { userId } = req.params;
      const { followUserId } = req.body;

      // Update the "following" array of the user being followed
      await UserProfile.findOneAndUpdate(
        { userId: userId },
        {
          $addToSet: { following: followUserId },
        }
      );

      // Update the "followers" array of the follower user
      await UserProfile.findOneAndUpdate(
        { userId: followUserId },
        {
          $addToSet: { followers: userId },
        }
      );

      res.status(200).json({ message: "Successfully followed the user." });
    } catch (error) {
      if (
        error.code === 11000 &&
        error.keyPattern &&
        error.keyPattern.followers
      ) {
        // Duplicate follower error
        return res.status(400).json({ error: "Already followers this user." });
      }
      if (
        error.code === 11000 &&
        error.keyPattern &&
        error.keyPattern.following
      ) {
        // Duplicate following error
        return res.status(400).json({ error: "Already following this user." });
      }
      // Other error handling
      res
        .status(500)
        .json({ error: "An error occurred while following the user." });
    }
  },
  async Unfollow(req, res) {
    try {
      const { userId } = req.params;
      const { unfollowUserId } = req.body;

      // Update the "following" array of the user to remove the unfollowed user
      await UserProfile.findOneAndUpdate(
        { userId: userId },
        {
          $pull: { following: unfollowUserId },
        }
      );

      // Update the "followers" array of the unfollowed user to remove the follower
      await UserProfile.findOneAndUpdate(
        { userId: unfollowUserId },
        {
          $pull: { followers: userId },
        }
      );

      res.status(200).json({ message: "Unfollowed successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async GetFollowers(req, res) {
    try {
      const userProfile = await UserProfile.findOne({
        userId: req.params.userId,
      });
      if (!userProfile) {
        return res.status(404).json({ message: "User profile not found" });
      }
      // Get the list of follower IDs from the user's profile
      const followerIds = userProfile.followers;

      const followersDetails = [];

      for (const followerId of followerIds) {
        const followerProfile = await UserProfile.findOne({
          userId: followerId,
        });
        const user = await User.findById(followerId);

        if (followerProfile) {
          // You can customize the properties you want to include in the response
          const followerDetails = {
            firstName: followerProfile.firstName,
            lastName: followerProfile.lastName,
            userName: user.userName,
          };
          followersDetails.push(followerDetails);
        }
      }
      res.status(200).json(followersDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  },
  async GetFollowing(req, res) {
    try {
      const userProfile = await UserProfile.findOne({
        userId: req.params.userId,
      });
      if (!userProfile) {
        return res.status(404).json({ message: "User profile not found" });
      }
      // Get the list of follower IDs from the user's profile
      const followingsIds = userProfile.following;

      const followingsDetails = [];

      for (const followingId of followingsIds) {
        const followingProfile = await UserProfile.findOne({
          userId: followingId,
        });
        const user = await User.findById(followingId);

        if (followingProfile) {
          // You can customize the properties you want to include in the response
          const followerDetails = {
            firstName: followingProfile.firstName,
            lastName: followingProfile.lastName,
            userName: user.userName,
          };
          followingsDetails.push(followerDetails);
        }
      }
      res.status(200).json(followingsDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  },
  async BookmarkPost(req, res) {
    try {
      const { userId } = req.params;
      const { postUrl } = req.body;

      const user = await UserProfile.find({ userId: userId });

      if (user[0]?.bookmarkPost?.includes(postUrl)) {
        return res.status(400).json({ message: "Post already bookmarked" });
      }

      await Promise.all([
        UserProfile.findOneAndUpdate(
          { userId: userId },
          {
            $addToSet: { bookmarkPost: postUrl },
          }
        ),
        Post.findOneAndUpdate(
          { postUrl: postUrl },
          { $inc: { bookmarkCount: 1 } }
        ),
      ]);
      res
        .status(200)
        .json({ message: "Successfully add post in your bookmark" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred while bookmark the post." });
    }
  },
  async RemoveBookmarkPost(req, res) {
    try {
      const { userId } = req.params;
      const { postUrl } = req.body;

      const user = await UserProfile.find({ userId: userId });

      if (!user[0]?.bookmarkPost?.includes(postUrl)) {
        return res.status(400).json({ message: "Post already Un bookmarked" });
      }

      await Promise.all([
        UserProfile.findOneAndUpdate(
          { userId: userId },
          {
            $pull: { bookmarkPost: postUrl },
          }
        ),
        Post.findOneAndUpdate(
          { postUrl: postUrl },
          { $inc: { bookmarkCount: -1 } }
        ),
      ]);
      res
        .status(200)
        .json({ message: "Successfully Remove post from your bookmark" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred while Unbookmark the post." });
    }
  },
  async GetBookmark(req, res) {
    try {
      const { userId } = req.params;
      const profile = await UserProfile.find(
        { userId: userId },
        { bookmarkPost: 1 }
      );
      if (profile) {
        res.status(200).json(profile);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong" + error });
    }
  },
  async GetUserProfileById(req, res) {
    try {
      let profile = await UserProfile.find({ userId: req.params.userId });
      let user = await User.find({ _id: req.params.userId });
      const userDetails = [
        {
          userId: req.params.userId,
          userName: user[0]?.userName,
          firstName: profile[0]?.firstName,
          lastName: profile[0]?.lastName,
          followers: profile[0]?.followers,
          following: profile[0]?.following,
          bookmarkPost: profile[0]?.bookmarkPost,
        },
      ];
      res.status(200).json(userDetails);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred while get profile by id." });
    }
  },
  async GetBookmarPostDeatils(req, res) {
    try {
      const { userId } = req.params;
      const userProfile = await UserProfile.find({ userId: userId });

      const bookmarksUrls = userProfile[0].bookmarkPost;
      const postDetails = [];

      for (const bookmarksUrl of bookmarksUrls) {
        const post = await Post.findOne({
          postUrl: bookmarksUrl,
        });
        postDetails.push(post);
      }
      res.status(200).json(postDetails);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred to get bookmarked post details!!" });
    }
  },
};
module.exports = userController;
