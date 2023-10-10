import express from "express";
import { getNotifications, updateNotification } from "../controllers/notification.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
const router = express.Router();

router.get("/getNotifications", isAuthenticated, authorizeRoles("admin"), getNotifications);
router.put("/updateNotification/:id", isAuthenticated, authorizeRoles("admin"), updateNotification);

module.exports = router;