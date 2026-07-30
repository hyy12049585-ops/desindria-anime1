import userRoutes from "./routes/user";

import authMiddleware from "../middleware/auth";
import {
  updateProfile,
  updateSettings,
  addFavorite,
  removeFavorite,
  addRating,
  deleteRating,
  addToWatchlist,
  removeFromWatchlist,
  markNotificationRead,
  deleteNotification,
  clearAllNotifications,
} from "../controllers/userController";

const router = Router();

// All routes require auth
router.use(authMiddleware);

// Profile
router.put("/profile", updateProfile);

// Settings
router.put("/settings", updateSettings);

// Favorites
router.post("/favorites", addFavorite);
router.delete("/favorites/:animeId", removeFavorite);

// Ratings
router.post("/ratings", addRating);
router.delete("/ratings/:animeId", deleteRating);

// Watchlist
router.post("/watchlist", addToWatchlist);
router.delete("/watchlist/:animeId", removeFromWatchlist);

// Notifications
router.put("/notifications/:notificationId/read", markNotificationRead);
router.delete("/notifications/:notificationId", deleteNotification);
router.delete("/notifications", clearAllNotifications);

export default router;

