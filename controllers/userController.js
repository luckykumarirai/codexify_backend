const User = require("../models/userDBModel");
const UserProfile = require("../models/userProfileDBModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const iat = Math.floor(Date.now() / 1000);
const exp = iat + 60 * 60;

var userController = {
  async Register(req, res, next) {
    try {
      const { userName, email, password, firstName, lastName } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);

      var newUser = new User({ userName, email, password: hashedPassword });
      await newUser.save();
      //create the userProfile as well to find the userId while signin to redirect on update profile
      const newUserProfile = new UserProfile({
        userId: newUser._id,
        firstName: firstName,
        lastName: lastName,
      });
      await newUserProfile.save();

      var token = jwt.sign(
        {
          userId: newUser._id,
          userName: newUser.userName,
          firstName: firstName,
          lastName: lastName,
        },
        process.env.SECRET_KEY,
        { expiresIn: exp }
      );

      res.status(200).json({
        success: true,
        message: "Register success!",
        token: token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error, message: "something went wrong!!" });
    }
  },
  async Login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.json({ message: "user not found!!" });
      }

      const userProfile = await UserProfile.findOne({ userId: user._id });

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res
          .status(401)
          .json({ message: "email or password is not matched!!" });
      }
      var token = jwt.sign(
        {
          userId: user._id,
          userName: user.userName,
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
        },
        process.env.SECRET_KEY,
        { expiresIn: exp }
      );
      res.status(200).json({
        success: true,
        message: "Login success!",
        token: token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error, message: "something went wrong!!" });
    }
  },
  GetUsers(req, res) {
    User.find({})
      .then((users) => {
        res.json(users);
      })
      .catch((err) => {
        res.json(err);
      });
  },
  GetUserById(req, res) {
    User.find({ _id: req.params.id })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        res.json(err);
      });
  },
};

module.exports = userController;
