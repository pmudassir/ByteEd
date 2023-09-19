import express from "express"
import { activateUser, LoginUser, LogOutUser, userRegistration } from "../controllers/user.controller"
const router = express.Router();

router.post("/registration", userRegistration)
router.post("/activate-user", activateUser)
router.post("/login", LoginUser)
router.get("/logout", LogOutUser)

module.exports = router;