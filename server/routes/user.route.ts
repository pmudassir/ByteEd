import express from "express"
import { activateUser, deleteUser, getAllUsers, getUserInfo, LoginUser, LogOutUser, socialAuth, updateAccessToken, updateAvatar, updatePassword, updateUserInfo, userRegistration } from "../controllers/user.controller"
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
router.put("/updateAvatar", isAuthenticated, updateAvatar)
router.get("/getAllUsers", isAuthenticated, authorizeRoles("admin"), getAllUsers)
router.delete("/deleteUser/:id", isAuthenticated, authorizeRoles("admin"), deleteUser)

module.exports = router;