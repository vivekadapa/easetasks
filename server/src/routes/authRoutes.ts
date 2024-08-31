
import express from "express"
import { Login, Register, verify } from "../controllers/AuthController"
import verifyToken from "../middleware/auth";
const router = express.Router()

router.post('/register', Register);
router.post('/login', Login)
router.get('/verify', verifyToken, verify)


export default router;