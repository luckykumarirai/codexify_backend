const Post = require("../models/postDBModel");
const Like = require("../models/likeDBModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var postController = {
  Post(req, res) {
    const {
      userId,
      userName,
      postUrl,
      title,
      body,
      tag,
      posterImage,
      likesCount,
      status,
    } = req.body;
    var newPost = new Post({
      userId,
      userName,
      postUrl,
      title,
      body,
      tag,
      posterImage,
      likesCount,
      status,
    });
    newPost
      .save()
      .then((post) => {
        var message = { success: true, message: "successfully created post!" };
        res.status(200).json(message);
      })
      .catch((err) => {
        res.status(500).json({ error: err, message: "something went wrong!!" });
      });
  },
  GetPostById(req, res) {
    Post.find({ _id: req.params.id })
      .then((post) => {
        res.status(200).json(post);
      })
      .catch((err) => {
        res.json(err);
      });
  },
  GetPosts(req, res) {
    Post.find({ status: "published" })
      .then((posts) => {
        res.status(200).json(posts);
      })
      .catch((err) => {
        res.json(err);
      });
  },
  getlike(req, res) {
    Post.findById(req.params.postId)
      .populate({ path: "likeUsers", strictPopulate: false })
      .exec((err, post) => {
        if (err) throw err;
        res.json(post);
      });
  },
  UpdateLikeCount(req, res) {
    const action = req.body.action;
    const counter = action === "Like" ? 1 : -1;
    Post.findByIdAndUpdate(
      { _id: req.params.id },
      { $inc: { likesCount: counter } }
    )
      .then((post) => {
        res.status(200).json(post);
      })
      .catch((err) => {
        res.json(err);
      });
  },
  UpdateLikeUsers(req, res) {
    Post.findByIdAndUpdate(
      { _id: req.params.postId },
      {
        $push: { likeUsers: req.body.userId },
      }
    )
      .then((post) => {
        res
          .status(200)
          .json({ message: "succesfully push the like user!!", data: post });
      })
      .catch((err) => {
        res.json(err);
      });
  },
  DeleteLikeUsers(req, res) {
    Post.updateOne(
      { _id: req.params.postId },
      {
        $pull: { likeUsers: req.body.userId },
      }
    )
      .then((post) => {
        res.status(200).json({
          message: "succesfully deleted the unlike user!!",
          data: post,
        });
      })
      .catch((err) => {
        res.json(err);
      });
  },
  ReturnLikeCount(req, res) {
    Post.findById({ _id: req.params.id })
      .then((post) => {
        res.status(200).json(post.likesCount);
      })
      .catch((err) => {
        res.json(err);
      });
  },
  CheckUniqueUrl(req, res) {
    Post.findOne({ postUrl: req.params.title })
      .then((post) => {
        if (post) {
          res
            .status(200)
            .json({ message: "This url already exists!", data: post });
        } else {
          res.status(404).json({ message: "URL not found" });
        }
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  GetPostByUrl(req, res) {
    Post.find({ postUrl: req.params.postUrl })
      .then((post) => {
        res.status(200).json(post);
      })
      .catch((err) => {
        res.json(err);
      });
  },
  GetPostByUserId(req, res) {
    Post.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .then((post) => {
        res.status(200).json(post);
      })
      .catch((err) => {
        res.json(err);
      });
  },
  DeletePostById(req, res) {
    Post.findByIdAndRemove({ _id: req.params.postId })
      .then((post) => {
        res.status(200).json({ message: "post deleted successfully" });
      })
      .catch((err) => {
        res.json(err);
      });
  },
  UpdatePostById(req, res) {
    Post.findOneAndUpdate(
      { _id: req.params.postId },
      {
        title: req.body.title,
        body: req.body.body,
        tag: req.body.tag,
        posterImage: req.body.posterImage,
        postUrl: req.body.postUrl,
        status: req.body.status
      }
    )
      .then((post) => {
        res.status(200).json({ message: "post Edited successfully" });
      })
      .catch((err) => {
        res.json(err);
      });
  },
  UpdateBookmarkCount(req, res) {
    const action = req.body.action;
    const counter = action === "Bookmark" ? 1 : -1;
    Post.findByIdAndUpdate(
      { _id: req.params.id },
      { $inc: { bookMarkCount: counter } }
    )
      .then((post) => {
        res.status(200).json(post);
      })
      .catch((err) => {
        res.json(err);
      });
  },
  GetLatestPost(req, res) {
    Post.find({ status: "published" })
      .sort({ createdAt: -1 })
      .then((post) => {
        res.status(200).json(post);
      })
      .catch((err) => {
        res.json(err);
      });
  },
  GetPopularPost(req, res) {
    Post.find({ status: "published" })
      .sort({ likeCount: -1, bookmarkCount: -1 })
      .then((post) => {
        res.status(200).json(post);
      })
      .catch((err) => {
        res.json(err);
      });
  },
};

module.exports = postController;
