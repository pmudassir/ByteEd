import { app } from "./app";
import connectDB from "./utils/db";
require("dotenv").config()

//server connection
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
    connectDB()
})