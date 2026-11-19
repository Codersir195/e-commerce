import mongoose from "mongoose";
import 'dotenv/config'

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB Connect Successfully")
    } catch (error) {
        console.log("MongoDB Connection faild : ",error)
    }
}

export default connectDB;