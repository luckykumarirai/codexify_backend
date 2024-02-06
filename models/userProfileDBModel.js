const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
  },
  mobileNo: {
    type: String,
  },
  profileImage: {
    contentType: String,
    url: String,
  },
  bio: {
    type: String,
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  bookmarkPost: [],
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);
module.exports = UserProfile;
