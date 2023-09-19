import express from "express"
import { activateUser, userRegistration } from "../controllers/user.controller"
const router = express.Router();

router.post("/registration", userRegistration)
router.post("/activate-user", activateUser)

module.exports = router;