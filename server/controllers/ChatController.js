import { ChatModel } from "../Models/chat.model.js";
import { blockedUser } from "../Models/blockedUser.model.js";

const ChatController = {
  accessChat: async (req, res) => {
    try {
      const { sender: senderId, selectedUser: receiverId } = req.body;

      const conversation = await ChatModel.findOne({
        participants: { $all: [senderId, receiverId] },
      }).populate("messages");

      if (!conversation || conversation.length === 0) {
        return res.status(200).json([]);
      }

      const Messages = conversation.messages || [];

      return res.status(200).json(Messages);
    } catch (error) {
      console.log("Error: ", error);
    }
  },
  fetchChat: async (req, res) => {
    const LoggedInUserId = req.params.userID.trim(); 

    try {
      const AllChats = await ChatModel.find({ participants: LoggedInUserId })
        .populate("participants")
        .populate({
          path: "messages",
          options: { sort: { createdAt: -1 }, limit: 1 }, 
        });

      if (!AllChats || AllChats.length === 0) {
        return res.status(404).json({ message: "Chats not found" });
      }

      const Receiver = AllChats.map((chat) => {
        const receiver = chat.participants.find(
          (participant) => participant._id != LoggedInUserId
        );

        const lastMessage = chat.messages
          .filter((message) =>
            [
              message.msgSender.toString(),
              message.msgReceiver.toString(),
            ].includes(LoggedInUserId.toString())
          )
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((message) => message.content)
          .shift();

        return {
          receiver: {
            fullName: receiver?.fullName,
            _id: receiver?._id,
            avatarUrl: receiver?.avatarUrl,
            lastMessage: lastMessage,
            createdAt: receiver?.createdAt,
            lastCreated:
              chat.messages.length > 0 ? chat.messages[0].createdAt : null,
          },
        };
      });

      return res.status(200).json({ Receiver });
    } catch (error) {
      console.log("Error fetching chats:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  BlockedUsers: async (req, res) => {
    const { sender, blockedUserId } = req.body;
    try {
      const ExistsUsers = await blockedUser.findOne({
        Sender: sender,
        BlockedUser: blockedUserId,
      });
      if (ExistsUsers) {
        return res.status(200).json(`User already blocked`);
      }
      const block = new blockedUser({
        Sender: sender,
        BlockedUser: blockedUserId,
      });
      await block.save();
      return res.status(200).json({ message: "Blocked successfully" });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: "Internal server error " });
    }
  },
  AllBlocked: async (req, res) => {
    const userId = req.params.userId;
    try {
      const BlockedUserDoc = await blockedUser.find({ BlockedUser: userId });
      if (BlockedUserDoc.length === 0) {
        return res
          .status(404)
          .json({ message: "User not found in blocked list" });
      }
      const Senders = BlockedUserDoc.map((doc) => doc.Sender);
      return res.status(200).json({ message: "Blockers fetched", Senders });
    } catch (error) {
      console.log("An internal error", error);
      return res.status(500).json({ message: "An internal error", error });
    }
  },
  UnBlockedUsers: async (req, res) => {
    const { sender, blockedUserId } = req.body;
    try {
      
      const ExistsUsers = await blockedUser.findOne({
        Sender: sender,
        BlockedUser: blockedUserId,
      });
      if (!ExistsUsers) {
        return res.status(200).json({ message: `User is not blocked` });
      }

      await blockedUser.deleteOne({
        Sender: sender,
        BlockedUser: blockedUserId,
      });

      return res.status(200).json({ message: "Unblocked successfully" });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: "Internal server error " });
    }
  },
};

export { ChatController };
