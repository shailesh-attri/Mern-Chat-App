import bcrypt from "bcrypt";
import { user } from "../Models/user.model.js";
import HttpError from "../Models/error.model.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import twilio from 'twilio';




const otpMap = new Map();

const userAuthController = {
  // Controller for registration
  register: async (req, res, next) => {
    try {
      const { username, email, password, fullName } = req.body;
      if (!username || !email || !password || !fullName) {
        return res.status(422).send({ message: "Fill in the required fields" });
      }
      const newUserName = username;
      const userNameExits = await user.findOne({ username: newUserName });
      if (userNameExits) {
        return res.status(201).send({ message: "Username already exists" });
      }

      const newEmail = email.toLowerCase();
      const emailExists = await user.findOne({ email: newEmail });
      if (emailExists) {
        return res.status(202).send({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new user({
        username,
        email: newEmail,
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
    const { email, password } = req.body;
    try {
      const newEmail = email.toLowerCase();
      const User = await user.findOne({ email: newEmail });
      if (!User) {
        res.status(404).send({ message: "User not found" });
      } else {
        const comparePassword = await bcrypt.compare(password, User.password);

        if (!comparePassword) {
          return res.status(401).json({ message: "Invalid password" });
        }

        const { _id: id, fullName: fullName } = User;
        const token = jwt.sign({ id, fullName }, process.env.JWT_SECRET_KEY, {
          expiresIn: "1d",
        });

        return res
          .status(200)
          .json({ token, id, fullName, message: "Credentials matched" });
      }
    } catch (error) {
      console.error(error);
      console.log("Error code: " + error.code);
      return next(error);
    }
  },
  email_verify: async (req, res, next) => {
    const { emailReset } = req.body;
    try {
      const newEmail = emailReset.toLowerCase();

      const existsEmail = await user.findOne({ email: newEmail });

      if (!existsEmail) {
        res.status(404).send({ message: "Email not found" });
      } else {
        function generateOtp() {
          return Math.floor(100000 + Math.random() * 900000).toString();
        }
        const otp = generateOtp();
        console.log("OTP Generated", otp);
        console.log(typeof otp);
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          service: "gmail",
          port: 587,
          secure: false,
          auth: {
            user: process.env.GMAIL_ID,
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        });
        const mailOptions = {
          from: "shaileshattri83@gmail.com",
          to: newEmail,
          subject: "Password reset OTP",
          text: `Your OTP for password reset is: ${otp}`,
        };
        await transporter.sendMail(mailOptions);
        otpMap.set(newEmail, otp);
        res
          .status(200)
          .json({ message: "Password reset OTP successfully sent." });
      }
    } catch (error) {
      // return next(new HttpError({message: error.message}));
      console.log(error.message);
    }
  },
  
  verify_otp: async (req, res, next) => {
    const { otp, emailReset } = req.body;
    console.log("frontend OTP", otp);
    console.log("frontend email", emailReset);
    const newEmail = emailReset.toLowerCase();

    try {
      const storedOtp = otpMap.get(newEmail);

      if (otp === storedOtp) {
        res.status(200).json({ message: "OTP verified successfully" });
      } else {
        res.status(200).json("Invalid OTP found");
      }
      otpMap.delete(newEmail);
    } catch (error) {
      // res.status(500).json({ message: "Invalid OTP" });
      res.status(500).json({ message: error.message });
    }
  },
  reset_password: async (req, res, next) => {
    const { NewPassword, email } = req.body;
    const newEmail = email.toLowerCase();
    console.log("New password", NewPassword);
    try {
      // Check if the email exists in the database
      const existingUser = await user.findOne({ email: newEmail });
      console.log("existingUser", existingUser);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const oldPassword = await bcrypt.compare(
        NewPassword,
        existingUser.password
      );
      console.log("Old password", oldPassword);
      if (oldPassword) {
        res.status(404).json("do not set old passwords");
      } else {
        const hashedPassword = await bcrypt.hash(NewPassword, 10);

        // Update user's password in the database
        existingUser.password = hashedPassword;
        await existingUser.save();

        res.status(200).json({ message: "Password updated successfully" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Password update failed" });
    }
  },
};
export default userAuthController;
