const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const User = require("./userDBModel");

// Define your enum
const PostStatus = {
  Draft: "draft",
  Published: "published",
  Scheduled: "scheduled",
};

const postSchema = new mongoose.Schema(
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
    postUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    tag: {
      type: Array,
    },
    posterImage: {
      type: String,
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    bookmarkCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(PostStatus),
      default: PostStatus.Published, // Set the default value to 'Draft'
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
