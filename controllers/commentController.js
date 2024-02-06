const Comment = require("../models/commentDBModel");

async function getCommentReplies(comments) {
  try {
    const promises = comments.map(async (comment) => {
      const childComments = await Comment.find({
        postId: comment.postId,
        parentId: comment._id,
      });
      comment.childComments = await getCommentReplies(childComments);
      return comment;
    });
    const result = await Promise.all(promises);
    return result;
  } catch (err) {
    return Promise.reject(err);
  }
}

var commentController = {
  Comment(req, res) {
    const {
      userId,
      userName,
      postId,
      text,
      parentId,
      childComments,
      isRoot,
      postTitle,
    } = req.body;
    var newComment = new Comment({
      userId,
      userName,
      postId,
      text,
      parentId,
      childComments,
      isRoot,
      postTitle,
    });
    newComment
      .save()
      .then((comment) => {
        var message = {
          success: true,
          message: "successfully commented!",
          data: comment,
        };
        res.json(message);
      })
      .catch((err) => {
        res.json({ error: err, message: "something went wrong!!" });
      });
  },
  GetComments(req, res) {
    Comment.find({})
      .then((posts) => {
        res.json(posts);
      })
      .catch((err) => {
        res.json(err);
      });
  },
  GetCommentById(req, res) {
    Comment.find({ postId: req.params.postId })
      .then((comment) => {
        res.json(comment);
      })
      .catch((err) => {
        res.json(err);
      });
  },
  async GetCommentWithReply(req, res) {
    const postId = req.params.postId;
    const comments = await Comment.find({ postId: postId });

    // Group comments by parent ID
    const commentMap = {};
    comments.forEach((comment) => {
      const parentId = comment.parentId;
      if (!parentId) {
        commentMap[comment._id] = comment;
      } else {
        if (!commentMap[parentId]) {
          commentMap[parentId] = { childComments: [] };
        }
        commentMap[parentId].childComments.push(comment);
      }
    });

    // Convert comment map to list
    const commentList = Object.values(commentMap);

    res.json(commentList);
  },
  GetReplyBYCommentId(req, res) {
    Comment.find({ parentId: req.params.commentId, isRoot: false })
      .then((reply) => {
        res.json(reply);
      })
      .catch((err) => {
        res.json(err);
      });
  },
  async getComments(req, res) {
    try {
      const comments = await Comment.find({
        postId: req.params.postId,
        parentId: null,
      });
      const result = await getCommentReplies(comments);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err, message: "something went wrong!!" });
    }
  },
  GetCommentByUserId(req, res) {
    Comment.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .then((comment) => {
        res.status(200).json(comment);
      })
      .catch((err) => {
        res.json(err);
      });
  },
};

module.exports = commentController;
