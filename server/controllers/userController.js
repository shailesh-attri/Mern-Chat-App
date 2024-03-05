import bcrypt from "bcrypt";
import { user } from "../Models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from 'fs'

const UserController = {
  // Edit user profile
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

  // Update user password
  UpdatePassword: async (req, res, next) => {
    const userId = req.userID;
    const { currentPassword, newPassword } = req.body;
    
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

  // Get user by ID
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

  // Get all users
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

  // Get user profile by ID
  getProfile: async (req, res, next) => {
    try {
      const userId = req.params.id;
      

      const userProfile = await user.findById(userId);
      
      if (!userProfile) {
        return res.status(404).json({ message: "User not found" });
      } else {
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

  // Search for users
  findUser: async (req, res, next) => {
    const { input, userId } = req.body;
   
    try {
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

  // Change user avatar
  changeAvatar: async (req, res, next) => {
    try {
      const userID = req.params.userId.trim();
      

      let imageUrl;
      if (req.file) {
        const filePath = req.file.path;
        
        imageUrl = await ImageFileUpload(filePath);
        
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
  
  // Delete user avatar
  deleteAvatar: async(req, res)=>{
    try {
      const userId = req.userID
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
    const result = await cloudinary.uploader.upload(filePath); 
    

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      } else {
        console.log('File deleted successfully');
      }
    }); 

    return result.secure_url; 
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error; 
  }
};
