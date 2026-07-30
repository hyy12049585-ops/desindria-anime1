import { Router } from "express";
import { body } from "express-validator";
import { register, login, getMe } from "../controllers/authController";
import authMiddleware from "../middleware/auth";

const router = Router();

router.post(
  "/register",
  [
    body("username").trim().isLength({ min: 3 }).withMessage("نام کاربری حداقل ۳ کاراکتر"),
    body("email").isEmail().withMessage("ایمیل معتبر نیست"),
    body("password").isLength({ min: 6 }).withMessage("رمز عبور حداقل ۶ کاراکتر"),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("ایمیل معتبر نیست"),
    body("password").exists().withMessage("رمز عبور الزامی است"),
  ],
  login
);

router.get("/me", authMiddleware, getMe);

export default router;
