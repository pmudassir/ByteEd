import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

module.exports = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal Server Error"

    // wrong mongoDB id
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: $(err.path)`;
        err = new ErrorHandler(message, 400)
    }
}