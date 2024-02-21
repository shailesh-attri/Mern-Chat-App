import bcrypt from "bcrypt";
import { user } from "../Models/user.model.js";
import jwt from "jsonwebtoken";

const UserController = {
  // editProfile: function
  editProfile: (req, res, next) => {
    res.json({ message: "Edit Profile" });
  },

  // deleteProfile: function
  deleteProfile: (req, res, next) => {
    res.json({ message: "Delete Profile" });
  },

  // getUser: function
  getUser: async (req, res, next) => {
    const id = req.params.id;
    try {
      const User = await user.findById(id);
      if (!User) {
        res.json({ message: "User not found" });
      } else {
        const { password, ...ThisUser } = User._doc;
        res.status(200).json({ message: "User found", ThisUser });
      }
    } catch (error) {
      res.json({ message: "Error getting user", error });
    }
  },

  // getAllUsers: function
  getAllUsers: async (req, res, next) => {
    try {
      const { userId } = req.body;
      const allUsers = await user
        .find({ _id: { $ne: userId } })
        .select("-password")
        .sort({createdAt: -1})
        .limit(4)
        

      if (allUsers.length > 0) {
        res.status(200).json(allUsers);
      } else {
        res.status(404).json({ message: "No users found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal error", error: error.message });
    }
  },

  getProfile: async (req, res, next) => {
    try {
      const userId = req.userID;

      // Assuming you have a User model and want to fetch user details by ID
      const userProfile = await user.findById(userId);
      console.log("userProfile", userProfile);
      if (!userProfile) {
        return res.status(404).json({ message: "User not found" });
      } else {
        // Extract only necessary details for the profile response
        const { _id, fullName, username, email } = userProfile;

        return res
          .status(200)
          .json({
            userProfile: { _id, fullName, username, email },
            message: "Profile fetched successfully",
          });
      }
    } catch (error) {
      console.error("Error in getProfile:", error.message, error);
      return next(error);
    }
  },
  // followUser: function
  findUser: async (req, res, next) => {
    const { input, userId } = req.body;
    console.log("Input:", input, "userId:", userId);
    try {
      // Use a case-insensitive regular expression to match the input in the username or any other field
      const regex = new RegExp(input, "i");

      const matchedUsers = await user
        .find({
          $and: [
            {
              _id:{$ne: userId}
            },
            {
              $or: [
                { username: { $regex: regex } },
                { fullName: { $regex: regex } },
                // Add more fields as needed
              ],
            },
          ],
        })
        .select("-password");

      if (matchedUsers) {
        res.status(200).json(matchedUsers);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal error" });
    }
  },

  // unFollowUser: function
  unFollowUser: (req, res, next) => {
    res.json({ message: "unFollowUser" });
  },

  // changeAvatar: function
  changeAvatar: (req, res, next) => {
    res.json({ message: "changeAvatar" });
  },
};
export { UserController };
