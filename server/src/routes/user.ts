import { Router } from "express";
import auth from "../middleware/auth";

import {
  getProfile,
  updateProfile,
  getSettings,
  updateSettings,
  getFavorites,
  addFavorite,
  removeFavorite,
  getRatings,
  addOrUpdateRating,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  getNotifications,
  markNotificationRead,
  deleteNotification,
  clearAllNotifications,
} from "../controllers/userController";

const router = Router();

// ──────────────── Profile ────────────────
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

// ──────────────── Settings ────────────────
router.get("/settings", auth, getSettings);
router.put("/settings", auth, updateSettings);

// ──────────────── Favorites ────────────────
router.get("/favorites", auth, getFavorites);
router.post("/favorites", auth, addFavorite);
router.delete("/favorites/:animeId", auth, removeFavorite);

// ──────────────── Ratings ────────────────
router.get("/ratings", auth, getRatings);
router.post("/ratings", auth, addOrUpdateRating);

// ──────────────── Watchlist ────────────────
router.get("/watchlist", auth, getWatchlist);
router.post("/watchlist", auth, addToWatchlist);
router.delete("/watchlist/:animeId", auth, removeFromWatchlist);

// ──────────────── Notifications ────────────────
router.get("/notifications", auth, getNotifications);
router.put("/notifications/:notifId/read", auth, markNotificationRead);
router.delete("/notifications/:notifId", auth, deleteNotification);
router.delete("/notifications", auth, clearAllNotifications);

export default router;
