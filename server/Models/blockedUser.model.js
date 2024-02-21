import mongoose from 'mongoose';
const BlockUserSchema = new mongoose.Schema({
    Sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      BlockedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
},{
    timestamps: true,
})
export const blockedUser = mongoose.model('BlockedUser', BlockUserSchema)