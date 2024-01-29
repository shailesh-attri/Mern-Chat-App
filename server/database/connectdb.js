import mongoose from "mongoose";
const connectDatabase = async()=>{
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connection to MongoDB is established");
        console.log("Database Host: " + connectionInstance.connection.host)
        
    } catch (error) {
        console.log("Found error: " + error.message);
    }
}
export default connectDatabase