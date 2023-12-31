import { NextFunction, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import OrderModel from "../models/Order";

// create order
export const newOrder = CatchAsyncError(async (data: any, next: NextFunction, res: Response) => {
    const order = await OrderModel.create(data);
    res.status(201).json({
        success: true,
        order
    })
})

export const getAllOrdersService = async (res: Response) => {
    const orders = await OrderModel.find();
    res.status(200).json({
        success: true,
        orders
    })
}