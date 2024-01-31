import bcrypt from "bcrypt";
import { user } from "../Models/user.model.js";
import HttpError from '../Models/error.model.js'

const userController = {
  // Controller for registration
  register: async (req, res, next) => {
    try {
      const { username, email, password, fullName } = req.body;
      if(!username || !email || !password || !fullName || !phoneNo) {
        return next(new HttpError("Fill in the required fields"));
      }
      const newUserName = username
      const userNameExits = await user.findOne({ username: newUserName})
      if(userNameExits){
        next(new HttpError("Username already exists"));
        res.send({message: "Username already exists}"});
    }

      const newEmail = email
      const emailExists = await user.findOne({ email:newEmail})
      if(emailExists){
        next(new HttpError("Email already exists"));
        res.send({message: "Email already exists}"});
    }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new user({
        username,
        email,
        fullName,
        password: hashedPassword,
      });

      await newUser.save();
      res.status(201).send({ message: "Registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(error.status).send({ message: "User registration failed" });
    }
  },

  //  controller for login form
  login: async (req, res) => {
    res.send("Login user");
  },

  //   controller for user profile
  userProfile: async (req, res) => {
    res.send("User profile");
  },

  // edit user profile
  editProfile: async (req, res) => {
    res.send("Edit profile");
  },

  // change user profile Picture
  changeAvatar: async (req, res) => {
    res.send("User profile picture changed");
  },
};
export default userController;
