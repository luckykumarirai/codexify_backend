const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const Users = require("./routes/user");
const Profiles = require("./routes/profile");
const Posts = require("./routes/post");
const Comments = require("./routes/comment");
const Likes = require("./routes/like");
const Recommended = require("./routes/postrecommendation");
const ErrorHandler = require("./middleware/errorHandler");

require("./utils/db")();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use("/", Users);
app.use("/", Profiles);
app.use("/", Posts);
app.use("/", Comments);
app.use("/", Likes);
app.use("/", Recommended);
app.use(ErrorHandler);

app.get("/", function (req, res, next) {
  res.send("Welocme to Codex Blog world!");
});

app.listen(5000, function () {
  console.log("Server listening on port 5000");
});
