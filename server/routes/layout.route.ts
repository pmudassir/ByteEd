import express from "express"
import { createLayout, editLayout, getLayoutType } from "../controllers/layout.controller"
import { authorizeRoles, isAuthenticated } from "../middleware/auth"
const router = express.Router()

router.post("/createLayout", isAuthenticated, authorizeRoles("admin"), createLayout)
router.put("/editLayout", isAuthenticated, authorizeRoles("admin"), editLayout)
router.get("/getLayout", getLayoutType)

module.exports = router