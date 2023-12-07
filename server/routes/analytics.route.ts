import express from "express";
import { getCourseAnalytics, getOrderAnalytics, getUserAnalytics } from "../controllers/analytics.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
const router = express.Router();

router.get("/getUsersAnalytics", isAuthenticated, authorizeRoles("admin"), getUserAnalytics)
router.get("/getCoursesAnalytics", isAuthenticated, authorizeRoles("admin"), getCourseAnalytics)
router.get("/getOrdersAnalytics", isAuthenticated, authorizeRoles("admin"), getOrderAnalytics)

module.exports = router;