import mongoose from 'mongoose';
const ChatModelSchema = new mongoose.Schema({
    participants :[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    }],

    messages:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"message",
            default:[]
        }
    ],
    
}, {
    timestamps:true
})
export const ChatModel = mongoose.model("chatModel", ChatModelSchema)