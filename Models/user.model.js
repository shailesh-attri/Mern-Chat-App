import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
    fullName: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        
    },
    username: {
        type:String,
        unique:true,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    avatarUrl: {
        type:String,
    },
    bio:{
        type:String,
    }
    
    
    
},{
    timestamps:true
})

export const user = mongoose.model('user', UserSchema)