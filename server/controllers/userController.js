import bcrypt from "bcrypt";
import { user } from "../Models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from 'fs'
const UserController = {
  // editProfile: function
  editProfile: async(req, res, next) => {
    const userId = req.userID
    const {fullName, email, username, bio} = req.body
    try {
      const userDoc = await user.findById(userId)
      if(!userDoc){
        return res.status(404).json({ message: "User not found" });
      }
      userDoc.fullName = fullName
      userDoc.email = email
      userDoc.username = username
      userDoc.bio = bio
      await userDoc.save()
      return res.status(200).json({ message: "Profile updated successfully" });
      
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // deleteProfile: function
  UpdatePassword: async (req, res, next) => {
    const userId = req.userID;
    const { currentPassword, newPassword } = req.body;
    console.log(userId, currentPassword);
    try {
      const userDoc = await user.findById(userId);
      if (!userDoc) {
        return res.status(404).json({ message: "User not found" });
      }

      const oldPassword = await bcrypt.compare(currentPassword, userDoc.password);
      if (!oldPassword) {
        return res.status(404).json({ message: "Current password is wrong!!" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      userDoc.password = hashedPassword;
      await userDoc.save();

      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error updating password:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
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
      const userId = req.params.id;
      console.log(userId);

      // Assuming you have a User model and want to fetch user details by ID
      const userProfile = await user.findById(userId);
      
      if (!userProfile) {
        return res.status(404).json({ message: "User not found" });
      } else {
        // Extract only necessary details for the profile response
        const { password,token,Token, ...otherDetails } = userProfile._doc;

        return res
          .status(200)
          .json({
            otherDetails,
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

  // changeAvatar: function
  changeAvatar: async (req, res, next) => {
    try {
      const userID = req.params.userId.trim();
      console.log(userID);

      let imageUrl;
      if (req.file) {
        const filePath = req.file.path;
        console.log(filePath);
        imageUrl = await ImageFileUpload(filePath);
        console.log(imageUrl);
      }else{
        console.log("Please select an image");
      }

      const userDoc = await user.findById(userID);
      if (!userDoc) {
        return res.status(404).json({ message: 'User not found' });
      }

      userDoc.avatarUrl = imageUrl;
      await userDoc.save();

      return res.status(200).json({ message: 'Avatar changed successfully'});
    } catch (error) {
      console.log('An error occurred:', error);
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  },
  deleteAvatar: async(req, res)=>{
    try {
      const userId = req.userID
      const {avatarURL} = req.body
      console.log(userId);
      const userDoc = await user.findById(userId);
      if(!userDoc) {
        return res.status(404).json({ message: 'User not found'})
      }
      userDoc.avatarUrl = ''
      
      userDoc.save();
      return res.status(200).json({ message: 'Avatar deleted successfully'})
      
    } catch (error) {
      console.log("An error occurred:", error);
      return res.status(500).json({ message: 'Internal Server Error', error})
    }
  }
};
export { UserController };
const ImageFileUpload = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath); // Upload file to Cloudinary
    console.log('Uploaded to Cloudinary:', result);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      } else {
        console.log('File deleted successfully');
      }
    }); // Delete file synchronously

    return result.secure_url; // Return the URL of the uploaded file
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error; // Throw the error for handling
  }
};