import NotificationModel from "../models/Notification";
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import OrderModel from "../models/Order";
import ErrorHandler from "../utils/ErrorHandler";

// get all notifications -- only admin
export const getNotifications = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = await NotificationModel.find().sort({ createdAt: -1 });

        res.status(201).json({
            success: true,
            notification
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})