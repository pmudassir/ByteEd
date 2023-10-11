import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary"
import { createCourse } from "../services/course.services";
import CourseModel from "../models/Course";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import path from "path";
import ejs from "ejs"
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/Notification";

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

// get course content (after purchasing)
export const getCourseByUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCourseList = req.user?.courses
        const courseId = req.params.id
        const courseExist = userCourseList?.find((course: any) => course._id.toString() === courseId)

        if (!courseExist) {
            return new ErrorHandler("You are not enrolled in this course", 404)
        }

        const course = await CourseModel.findById(courseId)
        const content = course?.courseData

        res.status(200).json({
            success: true,
            content
        })
    } catch (error: any) {
        return new ErrorHandler(error.message, 500)
    }
})

// add question to course
interface IAddQuestionData {
    question: string
    contentId: string
    courseId: string
}

export const addQuestion = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { question, contentId, courseId }: IAddQuestionData = req.body

        const course = await CourseModel.findById(courseId)
        if (!mongoose.Types.ObjectId.isValid(contentId)) return new ErrorHandler("Invalid content id", 400)

        const courseContent = course?.courseData?.find((item: any) => item._id.equals(contentId))
        if (!courseContent) return new ErrorHandler("Invalid content id", 400)

        // create a new question
        const newQuestion: any = {
            user: req.user,
            question,
            questionReplies: []
        }

        // add these questions to course content
        courseContent.questions.push(newQuestion)

        await NotificationModel.create({
            userId: req.user?._id,
            title: "New Question",
            message: `You have a new question in ${courseContent.title}`
        })

        // save the updated course
        await course?.save()
        return res.status(201).json({
            success: true,
            course
        })
    } catch (error: any) {
        return new ErrorHandler(error.message, 500)
    }
})

// add answer to questions
interface IAddAnswerData {
    contentId: string
    questionId: string
    answer: string
    courseId: string
}

export const addAnswer = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { contentId, questionId, answer, courseId }: IAddAnswerData = req.body

        const course = await CourseModel.findById(courseId)
        if (!mongoose.Types.ObjectId.isValid(contentId)) return new ErrorHandler("Invalid content id", 400)

        const courseContent = course?.courseData?.find((item: any) => item._id.equals(contentId))
        if (!courseContent) return new ErrorHandler("Invalid content id", 400)

        const question = courseContent?.questions?.find((item: any) => item._id.equals(questionId))
        if (!question) return new ErrorHandler("Invalid question id", 400)

        // crate answer obj
        const newAnswer: any = {
            user: req.user,
            answer
        }

        // add answer to course content
        question?.questionReplies?.push(newAnswer)

        await course?.save()

        if (req.user?._id === question.user._id) {
            await NotificationModel.create({
                userId: req.user?._id,
                title: "New Reply for your Question",
                message: `You have a new reply in ${courseContent.title}`
            })
        } else {
            const data = {
                name: question.user.name,
                title: courseContent.title
            }

            const html = await ejs.renderFile(path.join(__dirname, "../mails", "questionReply.ejs"), data)

            try {
                await sendMail({
                    email: question.user.email,
                    subject: "Question Reply",
                    template: "questionReply.ejs",
                    data
                })
            } catch (error: any) {
                return new ErrorHandler(error.message, 500)
            }
        }
        res.status(201).json({
            success: true,
            course
        })
    } catch (error: any) {
        return new ErrorHandler(error.message, 500)
    }
})

// add review in course
interface IAddReviewData {
    review: string
    rating: number
    userId: string
}

export const addReview = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCourseList = req.user?.courses
        const courseId = req.params.id

        const courseExist = userCourseList?.some((course: any) => course._id.toString() === courseId.toString())
        if (!courseExist) return new ErrorHandler("You are not enrolled in this course", 404)

        const course = await CourseModel.findById(courseId)

        const { review, rating } = req.body as IAddReviewData
        const reviewData: any = {
            user: req.user,
            comment: review,
            rating
        }

        course?.reviews?.push(reviewData)

        let avg = 0
        course?.reviews?.forEach((review: any) => {
            avg += review.rating
        })

        course && (course.ratings = avg / course.reviews.length) // 2 reviews one 5 and other 4 which is 9 and 9/2 = 4.5 which will be the rating.
        await course?.save()

        const notification = {
            title: "New review received",
            message: `${req.user?.name} has given a new review in ${course?.name}`,
        }

        // create Notification

        res.status(200).json({
            success: true,
            course
        })
    } catch (error: any) {
        return new ErrorHandler(error.message, 500)
    }
})

// add reply in review 
interface IAddReviewReplyData {
    comment: string
    courseId: string
    reviewId: string
}

export const addReplyToReview = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { comment, reviewId, courseId } = req.body as IAddReviewReplyData

        const course = await CourseModel.findById(courseId)
        if (!course) return new ErrorHandler("Course not found", 404)

        const review = course?.reviews?.find((item: any) => item._id.equals(reviewId))
        if (!review) return new ErrorHandler("Review not found", 404)

        const replyData: any = {
            user: req.user,
            comment
        }

        if (!review.commentReplies) {
            review.commentReplies = []
        }
        review.commentReplies?.push(replyData)

        await course?.save()
        res.status(200).json({
            success: true,
            course
        })
    } catch (error: any) {
        return new ErrorHandler(error.message, 500)
    }
})