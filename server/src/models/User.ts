import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  displayName: string;
  avatar: string;
  bio: string;
  joinDate: Date;
  stats: {
    totalWatched: number;
    totalEpisodes: number;
    totalHours: number;
    averageRating: number;
    completedSeries: number;
  };
  settings: {
    playback: {
      autoPlay: boolean;
      autoNext: boolean;
      defaultQuality: string;
      skipIntro: boolean;
      skipOutro: boolean;
    };
    notifications: {
      newEpisodes: boolean;
      recommendations: boolean;
      updates: boolean;
      email: boolean;
    };
    privacy: {
      profileVisibility: string;
      showWatchHistory: boolean;
      showRatings: boolean;
    };
    display: {
      theme: string;
      language: string;
      compactMode: boolean;
    };
  };
  favorites: Array<{
    animeId: string;
    title: string;
    image: string;
    addedAt: Date;
  }>;
  watchlist: Array<{
    animeId: string;
    title: string;
    image: string;
    status: string;
    addedAt: Date;
  }>;
  continueWatching: Array<{
    animeId: string;
    title: string;
    image: string;
    episode: number;
    progress: number;
    totalEpisodes: number;
    lastWatchedAt: Date;
  }>;
  ratings: Array<{
    animeId: string;
    title: string;
    image: string;
    rating: number;
    review?: string;
    ratedAt: Date;
  }>;
  downloads: Array<{
    animeId: string;
    title: string;
    episode: number;
    quality: string;
    sizeMB: number;
    status: string;
    downloadedAt: Date;
  }>;
  notifications: Array<{
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: Date;
  }>;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    displayName: { type: String, default: "" },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 500 },
    joinDate: { type: Date, default: Date.now },
    stats: {
      totalWatched: { type: Number, default: 0 },
      totalEpisodes: { type: Number, default: 0 },
      totalHours: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 },
      completedSeries: { type: Number, default: 0 },
    },
    settings: {
      playback: {
        autoPlay: { type: Boolean, default: true },
        autoNext: { type: Boolean, default: true },
        defaultQuality: { type: String, default: "1080p" },
        skipIntro: { type: Boolean, default: false },
        skipOutro: { type: Boolean, default: false },
      },
      notifications: {
        newEpisodes: { type: Boolean, default: true },
        recommendations: { type: Boolean, default: true },
        updates: { type: Boolean, default: true },
        email: { type: Boolean, default: false },
      },
      privacy: {
        profileVisibility: { type: String, default: "public" },
        showWatchHistory: { type: Boolean, default: true },
        showRatings: { type: Boolean, default: true },
      },
      display: {
        theme: { type: String, default: "dark" },
        language: { type: String, default: "fa" },
        compactMode: { type: Boolean, default: false },
      },
    },
    favorites: [{ animeId: String, title: String, image: String, addedAt: { type: Date, default: Date.now } }],
    watchlist: [{ animeId: String, title: String, image: String, status: String, addedAt: { type: Date, default: Date.now } }],
    continueWatching: [{ animeId: String, title: String, image: String, episode: Number, progress: Number, totalEpisodes: Number, lastWatchedAt: { type: Date, default: Date.now } }],
    ratings: [{ animeId: String, title: String, image: String, rating: Number, review: String, ratedAt: { type: Date, default: Date.now } }],
    downloads: [{ animeId: String, title: String, episode: Number, quality: String, sizeMB: Number, status: String, downloadedAt: { type: Date, default: Date.now } }],
    notifications: [{ type: String, title: String, message: String, read: { type: Boolean, default: false }, createdAt: { type: Date, default: Date.now } }],
  },
  { timestamps: true }
);

// Hash password before save
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
