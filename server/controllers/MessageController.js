import { Messages } from "../Models/Message.model.js";
import { ChatModel } from "../Models/chat.model.js";
import { getReceiverSocketId,io } from "../socket/socket.io.js";
import cloudinary from "../utils/cloudinary.js";
import { blockedUser } from "../Models/blockedUser.model.js";
import fs from 'fs'

const MessageController = {
  sendMessage: async (req, res) => {
    try {
      const { targetId: receiverId, message: content, userId: senderId } = req.body;
      
  
      // Check if receiverId is provided
      if (!receiverId || !senderId) {
        return res.status(400).json({ error: "Receiver or Sender ID is required" });
      }
  
      // Check if sender is blocked by receiver or vice versa
      const isSenderBlocked = await blockedUser.findOne({ Sender: senderId, BlockedUser: receiverId });
      const isReceiverBlocked = await blockedUser.findOne({ Sender: receiverId, BlockedUser: senderId });
      console.log("Sender",isSenderBlocked, "Blocked",isReceiverBlocked);
      // If sender is blocked by receiver, mark message as blocked
      const blockedAt = isSenderBlocked ? new Date() : null;
      if (isSenderBlocked || isReceiverBlocked) {
        return res.status(404).json({message:"User blocked"})
      }
      console.log("blockedAt:", blockedAt);
      let imageUrl;
  
      if (req.file) {
        const filePath = req.file.path
        // Upload image to Cloudinary and get URL
        imageUrl = await ImageFileUpload(filePath);
        console.log("imageUrl", imageUrl);
      }
  
      // Create new message object
      const newMessageData = {
        msgSender: senderId,
        msgReceiver: receiverId,
        content: content,
        latestMessage: content,
        blockedAt: blockedAt // Mark the message with current timestamp if sender is blocked by receiver
      };
  
      // Add imageUrl to message data if available
      if (imageUrl) {
        newMessageData.fileUrl = imageUrl;
      }
  
      // Create new message instance
      const newMessage = new Messages(newMessageData);
  
      // Find the existing chat entry
      let chatEntry = await ChatModel.findOne({
        participants: { $all: [senderId, receiverId] }
      });
  
      // Initialize an empty array for messages if chatEntry doesn't exist
      if (!chatEntry) {
        chatEntry = new ChatModel({
          participants: [senderId, receiverId]
        });
      }
  
      chatEntry.messages.push(newMessage._id);
  
      await Promise.all([chatEntry.save(), newMessage.save()]);
  
  
      // SOCKET IO FUNCTIONALITY WILL GO HERE
      // Check if sender and receiver are not blocked, then emit the new message
      
        const receiverSocketId = getReceiverSocketId(receiverId);
        
        if (receiverSocketId) {
          // io.to(<socket_id>).emit() used to send events to specific client
          io.to(receiverSocketId).emit("newMessage", newMessage);
        }
      
  
      res.status(200).json({ message: "Message sent successfully", newMessage });
    } catch (error) {
      console.log("Error in sending message:", error.message, error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export { MessageController };
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
    });

    return result.secure_url; // Return the URL of the uploaded file
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error; // Throw the error for handling
  }
};


