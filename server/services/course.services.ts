import { Response } from 'express';
import { CatchAsyncError } from '../middleware/catchAsyncErrors';
import CourseModel from '../models/Course';

// create course
export const createCourse = CatchAsyncError(async (data: any, res: Response) => {
    const course = await CourseModel.create(data);
    res.status(201).json({
        success: true,
        course
    })
})