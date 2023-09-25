import express from "express"
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createCourse } from "../services/course.services";
const router = express.Router();

router.post("/create", isAuthenticated, authorizeRoles("admin"), createCourse);

module.exports = router;