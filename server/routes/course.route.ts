import express from "express"
import { editCourse, getAllCourses, getSingleCourse } from "../controllers/course.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createCourse } from "../services/course.services";
const router = express.Router();

router.post("/createCourse", isAuthenticated, authorizeRoles("admin"), createCourse);
router.put("/updateCourse/:id", isAuthenticated, authorizeRoles("admin"), editCourse);
router.get("/getCourse/:id", getSingleCourse);
router.get("/getCourses", getAllCourses);

module.exports = router;