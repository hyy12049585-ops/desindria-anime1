import { Request, Response } from "express";
import User from "../models/User";

// ——— Profile ———————————————————————————————
export const getProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findById((req as any).user?.id).select("-password");
    if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "خطای سرور" });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const { displayName, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      (req as any).user?.id,
      { displayName, bio, avatar },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "خطای سرور" });
  }
};

// ——— Settings ——————————————————————————————
export const getSettings = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findById((req as any).user?.id).select("settings");
    if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });
    res.json(user.settings);
  } catch (error) {
    res.status(500).json({ message: "خطای سرور" });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<any> => {
  try {
    const { path, value } = req.body;
    const updateKey = `settings.${path}`;
    const user = await User.findByIdAndUpdate(
      (req as any).user?.id,
      { $set: { [updateKey]: value } },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });
    res.json(user.settings);
  } catch (error) {
    res.status(500).json({ message: "خطای سرور" });
  }
};

// ——— Favorites —————————————————————————————
export const getFavorites = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findById((req as any).user?.id).select("favorites");
    if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: "خطای سرور" });
  }
};

export const addFavorite = async (req: Request, res: Response): Promise<any> => {
  try {
    const { animeId, title, image } = req.body;
    const user = await User.findByIdAndUpdate(
      (req as any).user?.id,
      { $push: { favorites: { animeId, title, image, addedAt: new Date() } } },
      { new: true }
    ).select("favorites");
    if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: "خطای سرور" });
  }
};

export const removeFavorite = async (req: Request, res: Response): Promise<any> => {
  try {
    const { animeId } = req.params;
    const user = await User.findByIdAndUpdate(
      (req as any).user?.id,
      { $pull: { favorites: { animeId } } },
      { new: true }
    ).select("favorites");
    if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: "خطای سرور" });
  }
};

// ——— Ratings ———————————————————————————————
export const getRatings = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findById((req as any).user?.id).select("ratings");
    if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });
    res.json(user.ratings);
  } catch (error) {
    res.status(500).json({ message: "خطای سرور" });
  }
};

export const addOrUpdateRating = async (req: Request, res: Response): Promise<any> => {
  try {
    const { animeId, title, image, rating, review } = req.body;
    await User.findByIdAndUpdate((req as any).user?.id, {
      $pull: { ratings: { animeId } },
    });
    const user = await User.findByIdAndUpdate(
      (req as any).user?.id,
      { $push: { ratings: { animeId, title, image, rating, review, ratedAt: new Date() } } },
      { new: true }
    ).select("ratings");
    if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });
    res.json(user.ratings);
  } catch (error) {
    res.status(500).json({ message: "خطای سرور" });
  }
};

// ——— Watchlist —————————————————————————————
export const getWatchlist = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findById((req as any).user?.id).select("watchlist");
    if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });
    res.json(user.watchlist);
  } catch (error) {
    res.status(500).json({ message: "خطای سرور" });
  }
};

export const addToWatchlist = async (req: Request, res: Response): Promise<any> => {
  try {
    const { animeId, title, image, status } = req.body;
    await User.findByIdAndUpdate((req as any).user?.id, {
      $pull: { watchlist: { animeId } },
    });
    const user = await User.findByIdAndUpdate(
      (req as any).user?.id,
      { $push: { watchlist: { animeId, title, image, status, addedAt: new Date() } } },
      { new: true }
    ).select("watchlist");
    if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });
    res.json(user.watchlist);
  } catch (error) {
    res.status(500).json({ message: "خطای سرور" });
  }
};

export const removeFromWatchlist = async (req: Request, res: Response): Promise<any> => {
  try {
    const { animeId } = req.params;
    const user = await User.findByIdAndUpdate(
      (req as any).user?.id,
      { $pull: { watchlist: { animeId } } },
      { new: true }
    ).select("watchlist");
    if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });
    res.json(user.watchlist);
  } catch (error) {
    res.status(500).json({ message: "خطای سرور" });
  }
};

// ——— Notifications —————————————————————————
export const getNotifications = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findById((req as any).user?.id).select("notifications");
    if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });
    res.json(user.notifications);
  } catch (error) {
    res.status(500).json({ message: "خطای سرور" });
  }
};

export const markNotificationRead = async (req: Request, res: Response): Promise<any> => {
  try {
    const { notifId } = req.params;
    await User.updateOne(
      { _id: (req as any).user?.id, "notifications._id": notifId },
      { $set: { "notifications.$.read": true } }
    );
    const user = await User.findById((req as any).user?.id).select("notifications");
    if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });
    res.json(user.notifications);
  } catch (error) {
    res.status(500).json({ message: "خطای سرور" });
  }
};

export const deleteNotification = async (req: Request, res: Response): Promise<any> => {
  try {
    const { notifId } = req.params;
    const user = await User.findByIdAndUpdate(
      (req as any).user?.id,
      { $pull: { notifications: { _id: notifId } } },
      { new: true }
    ).select("notifications");
    if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });
    res.json(user.notifications);
  } catch (error) {
    res.status(500).json({ message: "خطای سرور" });
  }
};

export const clearAllNotifications = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findByIdAndUpdate(
      (req as any).user?.id,
      { $set: { notifications: [] } },
      { new: true }
    ).select("notifications");
    if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });
    res.json(user.notifications);
  } catch (error) {
    res.status(500).json({ message: "خطای سرور" });
  }
};
