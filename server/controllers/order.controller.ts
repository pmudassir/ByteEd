import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel, { IOrder } from "../models/Order";
import NotificationModel from "../models/Notification";
import userModel from "../models/User";
import CourseModel from "../models/Course";
import path from "path";
import ejs from "ejs"
import sendMail from "../utils/sendMail";

// create order
export const createOrder = CatchAsyncError(async (req: Request, res: Response) => {
    try {
        const { courseId, payment_info } = req.body as IOrder;

        const user = await userModel.findById(req.user?._id);

        const courseExistInUser = user?.courses.some((course: any) => course.courseId.toString() === courseId.toString())
        if (courseExistInUser) return new ErrorHandler("You have already purchased this course", 400)

        const course = await CourseModel.findById(courseId)
        if (!course) return new ErrorHandler("Course not found", 400)

        const data: any = {
            courseId: course._id,
            userId: user?._id,
        }
    } catch (error: any) {
        return new ErrorHandler(error.message, 500)
    }
})