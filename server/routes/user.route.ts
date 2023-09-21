import express from "express"
import { activateUser, getUserInfo, LoginUser, LogOutUser, socialAuth, updateAccessToken, updatePassword, updateUserInfo, userRegistration } from "../controllers/user.controller"
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
const router = express.Router();

router.post("/registration", userRegistration)
router.post("/activate-user", activateUser)
router.post("/login", LoginUser)
router.get("/logout", isAuthenticated, LogOutUser)
router.get("/refresh", updateAccessToken)
router.get("/me", isAuthenticated, getUserInfo)
router.post("/socialAuth", socialAuth)
router.put("/updateUser", isAuthenticated, updateUserInfo)
router.put("/updateUserPass", isAuthenticated, updatePassword)

module.exports = router;