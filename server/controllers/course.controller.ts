import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary"
import { createCourse } from "../services/course.services";
import CourseModel from "../models/Course";
import { redis } from "../utils/redis";

// upload course
export const uploadCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body
        const thumbnail = data.thumbnail
        if (thumbnail) {
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses"
            })
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        }
        createCourse(data, res, next)
    } catch (error: any) {
        return new ErrorHandler(error.message, 500)
    }
})

// edit course 
export const editCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body
        const thumbnail = data.thumbnail
        if (thumbnail) {
            await cloudinary.v2.uploader.destroy(data.thumbnail.public_id)

            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses"
            })
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        }

        const courseId = req.params.id
        const course = await CourseModel.findByIdAndUpdate(courseId, {
            $set: data
        }, { new: true })

        res.status(201).json({
            success: true,
            course
        })
    } catch (error: any) {
        return new ErrorHandler(error.message, 500)
    }
})

// get single course (before purchasing)
export const getSingleCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id

        const isCacheExist = await redis.get(courseId)

        if (isCacheExist) {
            const course = JSON.parse(isCacheExist)
            return res.status(200).json({
                success: true,
                course
            })
        }

        const course = await CourseModel.findById(courseId).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")

        await redis.set(courseId, JSON.stringify(course))

        res.status(200).json({
            success: true,
            course
        })
    } catch (error: any) {
        return new ErrorHandler(error.message, 500)
    }
})

// get all courses (before purchasing)
export const getAllCourses = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const isCacheExist = await redis.get("courses")
        if (isCacheExist) {
            const courses = JSON.parse(isCacheExist)
            return res.status(200).json({
                success: true,
                courses
            })
        }
        const courses = await CourseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")

        await redis.set("courses", JSON.stringify(courses))

        res.status(200).json({
            success: true,
            courses
        })
    } catch (error: any) {
        return new ErrorHandler(error.message, 500)
    }
})