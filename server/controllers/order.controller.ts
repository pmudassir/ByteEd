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
import { newOrder } from "../services/order.services";

// create order
export const createOrder = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, payment_info } = req.body as IOrder;

        const user = await userModel.findById(req.user?._id);

        const courseExistInUser = user?.courses.some((course: any) => course.courseId.toString() === courseId.toString())
        if (courseExistInUser) return next(new ErrorHandler("You have already purchased this course", 400))

        const course = await CourseModel.findById(courseId)
        if (!course) return next(new ErrorHandler("Course not found", 400))

        const data: any = {
            courseId: course._id,
            userId: user?._id,
        }
        newOrder(data, res, next)

        const mailData = {
            order: {
                _id: course._id.slice(0, 6),
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            }
        }
        
        const html = await ejs.renderFile(path.join(__dirname, "../mails/orderConfirmation.ejs"), mailData)
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})