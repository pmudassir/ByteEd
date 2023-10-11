import express from "express"
import { createOrder, getAllOrders } from "../controllers/order.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
const router = express.Router();

router.post("/createOrder", isAuthenticated, createOrder);
router.get("/getAllOrders", isAuthenticated, authorizeRoles("admin"), getAllOrders);

module.exports = router;