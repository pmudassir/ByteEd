import express from "express"
import { activateUser, LoginUser, LogOutUser, userRegistration } from "../controllers/user.controller"
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
const router = express.Router();

router.post("/registration", userRegistration)
router.post("/activate-user", activateUser)
router.post("/login", LoginUser)
router.get("/logout", isAuthenticated, LogOutUser)

module.exports = router;