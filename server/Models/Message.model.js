import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema(
  {
    msgSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    msgReceiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    content: { type: String },
    latestMessage: { type: String },
    fileUrl: { type: String },
  },
  { timestamps: true }
);
export const Messages = mongoose.model("message", MessageSchema);
