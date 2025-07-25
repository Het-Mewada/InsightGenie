import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected Successfully" )
    }catch(err){
        console.log("Mongo Error : " , err);
        process.exit(1);
    }
}

export default connectDB;