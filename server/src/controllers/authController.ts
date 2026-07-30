import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User";

const generateToken = (userId: string): string => {
  const secret: jwt.Secret = process.env.JWT_SECRET || "fallback_secret_key";
  const options: jwt.SignOptions = { expiresIn: "30d" };
  return jwt.sign({ userId }, secret, options);
};




export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, displayName } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email ? "این ایمیل قبلاً ثبت شده" : "این نام کاربری قبلاً استفاده شده",
      });
    }

    const user = await User.create({ username, email, password, displayName: displayName || username });
    const token = generateToken(user._id as unknown as string);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        joinDate: user.joinDate,
        stats: user.stats,
        settings: user.settings,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "ایمیل یا رمز عبور اشتباه است" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "ایمیل یا رمز عبور اشتباه است" });
    }

    const token = generateToken(user._id as unknown as string);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        joinDate: user.joinDate,
        stats: user.stats,
        settings: user.settings,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
};
export const getMe = async (req: Request, res: Response): Promise<any> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "توکن یافت نشد" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "کاربر یافت نشد" });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        joinDate: user.joinDate,
        stats: user.stats,
        settings: user.settings,
      },
    });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(401).json({ message: "توکن نامعتبر است" });
  }
};
