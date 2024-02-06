const Like = require("../models/likeDBModel");
const Post = require("../models/postDBModel");

var likeController = {
  async Like(req, res) {
    try {
      const { userId, postUrl, likeStatus } = req.body;
      const existingLike = await Like.findOne({ userId, postUrl });
      if (existingLike) {
        return res
          .status(400)
          .json({ message: "You have already liked this post" });
      }
      await Promise.all([
        Like.create({ userId, postUrl, likeStatus }),
        Post.findOneAndUpdate(
          { postUrl: postUrl },
          { $inc: { likesCount: 1 } }
        ),
      ]);
      res.status(201).json({ success: true, message: "post liked!" });
    } catch (err) {
      console.error(err);

      res.status(500).json({ error: err, message: "something went wrong!!" });
    }
  },
  GetLikes(req, res) {
    Like.find({})
      .then((likes) => {
        res.json(likes);
      })
      .catch((err) => {
        res.status(500).json({ message: "not found" });
      });
  },
  GetLikeById(req, res) {
    Like.find({ _id: req.params.id })
      .then((post) => {
        res.json(post);
      })
      .catch((err) => {
        res.status(404).json({ message: "not found" });
      });
  },
  GetStatusUserPost(req, res) {
    Like.findOne({ userId: req.params.userId, postUrl: req.params.postUrl })
      .then((post) => {
        res.status(200).json(post);
      })
      .catch((err) => {
        res.status(404).json({ message: "not found" });
      });
  },
  UpdateStatus(req, res) {
    const filter = { userId: req.params.userId, postUrl: req.params.postUrl };
    const update = { like: req.body.like };
    Like.findOneAndUpdate(filter, update)
      .then((post) => {
        res.json(post);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  async disLike(req, res) {
    try {
      await Promise.all([
        Like.findOneAndDelete({
          userId: req.params.userId,
          postUrl: req.params.postUrl,
        }),
        Post.findOneAndUpdate(
          { postUrl: req.params.postUrl },
          { $inc: { likesCount: -1 } }
        ),
      ]);
      res.status(200).json({ message: " Post Unliked!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = likeController;
