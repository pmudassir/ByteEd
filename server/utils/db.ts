import mongoose from "mongoose"
require("dotenv").config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || '').then((data: any) => {
            console.log(`Database connected with ${data.connection.host}`);
        })
    } catch (error: any) {
        console.log(error.message);
        setTimeout(connectDB, 3000)
    }
}

export default connectDB