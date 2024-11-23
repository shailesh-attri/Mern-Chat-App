import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import HttpError from "../Models/error.model.js";
import generateTokenAndSetCookie from "../utils/generateTokenandSetCookie.js";
import JwtForRegistration from "../utils/NewRegisterJwt.js";
import { user } from "../Models/user.model.js";

const otpMap = new Map();

const userAuthController = {
  // Controller for user registration
  register: async (req, res, next) => {
    try {
      const { email, username, password, fullName } = req.body;
      if (!username || !email || !password || !fullName) {
        return res.status(422).send({ message: "Fill in the required fields" });
      }

      const newUserName = username;
      const userNameExists = await user.findOne({ username: newUserName });
      if (userNameExists) {
        return res.status(201).send({ message: "Username already exists" });
      }

      const newEmail = email.toLowerCase();
      const userExists = await user.findOne({ email: newEmail });
      if (userExists) {
        return res.status(202).send({ message: "Email already exists" });
      } else {
        function generateOtp() {
          return Math.floor(100000 + Math.random() * 900000).toString();
        }
        const otp = generateOtp();
        

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

        const token = JwtForRegistration(otp);
        res.status(200).json({
          message: "Email verification OTP successfully sent.",
          token,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "User registration failed" });
    }
  },

  // Controller for email verification
  registration_verify: async (req, res) => {
    const { email, password, fullName, username, otp } = req.body;
    try {
      const storedOtp = req.UserOTP;
      const newEmail = email.toLowerCase();
      if (storedOtp === otp) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new user({
          username,
          email: newEmail,
          fullName,
          password: hashedPassword,
        });

        try {
          const savedUser = await newUser.save();
          const { _id: id } = savedUser;
          const time = "1d";
          const token = generateTokenAndSetCookie(id, time);
          res
            .status(200)
            .json({ message: "Account registered successfully", token, id });
        } catch (error) {
          if (error.code === 11000 && error.keyPattern.email === 1) {
            // Duplicate email error
            res.status(400).json({ message: "Email is already registered" });
          } else {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
          }
        }
      } else {
        res.status(400).json({ message: "Invalid OTP" });
      }
    } catch (error) {}
  },

  // Controller for user login
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

        const { _id: id } = User;
        // JWT token generation
        const time = "15d";
        const token = generateTokenAndSetCookie(id, time);
        return res.status(200).json({
          message: "Login successful",
          token,
          id,
        });
      }
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  },


  // Controller for sending password reset OTP
  email_verify: async (req, res, next) => {
    const { emailReset } = req.body;
    console.log(emailReset);

    try {
      const newEmail = emailReset.toLowerCase();
      const existsUser = await user.findOne({ email: newEmail });

      if (!existsUser) {
        return res.status(404).json({ message: "Email not found" });
      }

      function generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
      }

      const otp = generateOtp();
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

      const { _id: id } = existsUser;
      const time = "1m";
      const token = generateTokenAndSetCookie(id, time);

      res
        .status(200)
        .json({ message: "Password reset OTP successfully sent.", token });
      console.log(otp);
    } catch (error) {
      return next(new HttpError({ message: error.message }));
    }
  },

  // Controller for verifying OTP for password reset
  verify_otp: async (req, res, data) => {
    try {
      const { otp } = req.body;
      const userId = req.userID;
      const MailUser = await user.findById(userId);

      const newMail = MailUser.email;
      const storedOtp = otpMap.get(newMail);

      if (storedOtp === otp) {
        return res.status(200).json({ message: "OTP verified successfully" });
      } else {
        return res.status(400).json({ message: "Invalid OTP" });
      }
    } catch (error) {
      console.log("Handling error: " + error);
      return res.status(500).json({ message: "Internal sever error" });
    }
  },

  // Controller for resetting user password
  reset_password: async (req, res, next) => {
    const { NewPassword } = req.body;
    const userId = req.userID; // Accessing it from req object
    try {
      // Check if the user exists in the database
      const MailUser = await user.findById(userId);

      if (!MailUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const oldPassword = await bcrypt.compare(
        NewPassword,
        MailUser.password
      );

      if (oldPassword) {
        res.status(404).json("do not set old passwords");
      } else {
        const hashedPassword = await bcrypt.hash(NewPassword, 10);
        const { _id: id } = MailUser;
        // Update user's password in the database
        MailUser.password = hashedPassword;
        await MailUser.save();
        const time = "1d";
        const token = generateTokenAndSetCookie(id, time);
        res
          .status(200)
          .json({ message: "Password updated successfully", token });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Password update failed" });
    }
  },
};

export default userAuthController;
