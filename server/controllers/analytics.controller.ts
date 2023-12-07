import { Request, Response, NextFunction } from "express"
import ErrorHandler from "../utils/ErrorHandler"
import { CatchAsyncError } from "../middleware/catchAsyncErrors"
import userModel from "../models/User"
import { generateLast12MonthsData } from "../utils/analytics.generator"
import CourseModel from "../models/Course"
import OrderModel from "../models/Order"

// user analytics --admin
export const getUserAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await generateLast12MonthsData(userModel)

        return res.status(201).json({
            success: true,
            users
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})

// course analytics --admin
export const getCourseAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await generateLast12MonthsData(CourseModel)

        return res.status(201).json({
            success: true,
            courses
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})

// order analytics --admin
export const getOrderAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await generateLast12MonthsData(OrderModel)

        return res.status(201).json({
            success: true,
            orders
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})