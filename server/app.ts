require("dotenv").config()
import express, { NextFunction, Request, Response } from "express"
export const app = express()
import cors from "cors"
import cookieParser from "cookie-parser"
import { ErrorMiddleware } from "./middleware/error"
const userRoute = require("./routes/user.route")
const courseRoute = require("./routes/course.route")

//body parser
app.use(express.json({ limit: "50mb" }))

//cookie parser
app.use(cookieParser())

//cors
app.use(cors({
    origin: process.env.ORIGIN,
}))

// routes
app.use("/api/v1", userRoute)
app.use("/api/v1", courseRoute)

//test route
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ success: true, message: "Api is working" })
})

//unknown routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any
    err.statusCode = 400
    next(err)
})

app.use(ErrorMiddleware)