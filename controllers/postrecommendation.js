const Comment = require("../models/commentDBModel");

var recommendationController = {
  async GetpostRecommendation(req, res) {
    const data = await Comment.find({});
    res.json(data);

    const users = [];
    const comments = [];
    const posts = [];

    data.forEach((doc) => {
      const user = doc.userId;
      const post = doc.postId;
      const comment = doc.text;

      if (!users.includes(user)) {
        users.push(user);
      }
      if (!posts.includes(post)) {
        posts.push(post);
      }

      comments.push([users.indexOf(user), posts.indexOf(post), comment]);
    });
    console.log(users);
    console.log(posts);
    console.log(comments);
  },
};
module.exports = recommendationController;
