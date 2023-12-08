import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import LayoutModel from "../models/Layout";
import cloudinary from "cloudinary"

// create layout
export const createLayout = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;

        const isTypeExist = await LayoutModel.findOne({ type });
        if (isTypeExist) {
            return next(new ErrorHandler(`$ {type} already exists`, 400))
        }

        if (type === "Banner") {
            const { image, title, subTitle } = req.body
            const myCloud = await cloudinary.v2.uploader.upload(image, {
                folder: "Layout",
            })
            const banner = {
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                },
                title,
                subTitle
            }
            await LayoutModel.create(banner)
        }

        if (type === "FAQ") {
            const { faq } = req.body
            const faqItems = await Promise.all(
                faq.map(async (item: any) => {
                    return {
                        question: item.question,
                        answer: item.answer
                    }
                })
            )
            await LayoutModel.create({ type: "FAQ", faqItems })
        }

        if (type === "Categories") {
            const { categories } = req.body
            const categoriesItem = await Promise.all(
                categories.map(async (item: any) => {
                    return {
                        title: item.title
                    }
                })
            )
            await LayoutModel.create({ type: "Categories", categories: categoriesItem })
        }

        res.status(201).json({
            success: true,
            message: "Layout created successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})

// edit layout
export const editLayout = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;

        if (type === "Banner") {
            const bannerData: any = await LayoutModel.findOne({ type: "Banner" })
            if (bannerData) {
                await cloudinary.v2.uploader.destroy(bannerData?.image?.public_id)
            }

            const { image, title, subTitle } = req.body
            const myCloud = await cloudinary.v2.uploader.upload(image, {
                folder: "Layout",
            })
            const banner = {
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                },
                title,
                subTitle
            }
            await LayoutModel.findByIdAndUpdate(bannerData?._id, { banner })
        }

        if (type === "FAQ") {
            const { faq } = req.body
            const faqItem = await LayoutModel.findOne({ type: "FAQ" })
            const faqItems = await Promise.all(
                faq.map(async (item: any) => {
                    return {
                        question: item.question,
                        answer: item.answer
                    }
                })
            )
            await LayoutModel.findByIdAndUpdate(faqItem?._id, { type: "FAQ", faqItems })
        }

        if (type === "Categories") {
            const { categories } = req.body;

            const categoriesData = await LayoutModel.findOne({
                type: "Categories",
            });

            const categoriesItems = await Promise.all(
                categories.map(async (item: any) => {
                    return {
                        title: item.title,
                    };
                })
            );
            await LayoutModel.findByIdAndUpdate(categoriesData?._id, {
                type: "Categories",
                categories: categoriesItems,
            });
        }

        res.status(201).json({
            success: true,
            message: "Layout updated successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})