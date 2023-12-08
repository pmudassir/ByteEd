import express from "express"
import { createLayout, editLayout } from "../controllers/layout.controller"
import { authorizeRoles, isAuthenticated } from "../middleware/auth"
const router = express.Router()

router.post("/createLayout", isAuthenticated, authorizeRoles("admin"), createLayout)
router.put("/editLayout", isAuthenticated, authorizeRoles("admin"), editLayout)

module.exports = router