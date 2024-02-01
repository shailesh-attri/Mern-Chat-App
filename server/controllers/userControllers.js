import bcrypt from "bcrypt";
import { user } from "../Models/user.model.js";
import HttpError from '../Models/error.model.js'
import jwt from 'jsonwebtoken'
const userController = {
  // Controller for registration
  register: async (req, res, next) => {
    try {
      const { username, email, password, fullName } = req.body;
      if(!username || !email || !password || !fullName ) {
        return res.status(422).send({message:"Fill in the required fields"})
      }
      const newUserName = username
      const userNameExits = await user.findOne({ username: newUserName})
      if(userNameExits){
        return res.status(201).send({message: "Username already exists"});
    }

      const newEmail = email.toLowerCase()
      const emailExists = await user.findOne({ email:newEmail})
      if(emailExists){
      return res.status(202).send({message: "Email already exists"});
    }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new user({
        username,
        email:newEmail,
        fullName,
        password: hashedPassword,
      });

      await newUser.save();
      res.status(200).send({ message: "Registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "User registration failed" });
    }
  },

  //  controller for login form
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(new HttpError({ message: "Fill in the required fields" }));
      }
  
      const newEmail = email.toLowerCase();
      const User = await user.findOne({ email: newEmail });
  
      if (!User) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const comparePassword = await bcrypt.compare(password, User.password);
  
      if (!comparePassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const { _id: id, fullName: fullName } = User;
      const token = jwt.sign({ id, fullName }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
  
      return res.status(200).json({ token, id, fullName, message: "Credentials matched" });
    } catch (error) {
      console.error(error);
      return next(error);
    }
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
