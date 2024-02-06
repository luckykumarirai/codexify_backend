const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const User = require("./userDBModel");
const Post = require("./postDBModel");

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    postTitle: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    childComments: [this],
    parentId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
