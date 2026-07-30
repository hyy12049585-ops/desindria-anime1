// src/types/cinderino.ts

export interface CinderinoUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  banner: string;
  bio: string;
  link: string;
  isVerified: boolean;
  isPrivate: boolean;
  joinedAt: string;
}

export interface CinderinoPost {
  id: string;
  authorId: string;
  author: CinderinoUser;
  images: string[];
  caption: string;
  tags: string[];
  media?: string[];
  likes: number;
  comments: number;
  createdAt: string;
  isLiked: boolean;
  isBookmarked: boolean;
  vibes: PostVibes; // ✅ اضافه شد
}

export interface CinderinoStory {
  id: string;
  authorId: string;
  author: CinderinoUser;
  imageUrl: string;
  createdAt: string;
  expiresAt: string;
  seen: boolean;
}

export interface CinderinoChannel {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  banner: string;
  description: string;
  membersCount: number;
  postsCount: number;
  isJoined: boolean;
}

export interface CinderinoProfileStats {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export interface CinderinoProfileState {
  user: CinderinoUser;
  myPosts: CinderinoPost[];
  likedPosts: CinderinoPost[];
  bookmarkedPosts: CinderinoPost[];
  followers: CinderinoUser[];
  following: CinderinoUser[];
  stories: CinderinoStory[];
  channels: CinderinoChannel[];
}

// ============================================
// Story Types
// ============================================

export interface CinderinoStoryItem {
  id: string;
  type: "image" | "video" | "text";
  content: string;
  duration: number;
  bgColor?: string;
  caption?: string;
  createdAt: string;
}

export interface CinderinoStoryGroup {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  stories: CinderinoStoryItem[];
  seen: boolean;
  lastUpdated: string;
}

export interface StoryViewerState {
  isOpen: boolean;
  currentGroupIndex: number;
  currentStoryIndex: number;
}

// ============================================
// Feed Types
// ============================================

export interface CinderinoFeedResponse {
  posts: CinderinoPost[];
  nextCursor?: string;
  hasMore: boolean;
}

// ============================================
// Comment Types
// ============================================

export interface CinderinoComment {
  id: string;
  postId: string;
  authorId: string;
  author: CinderinoUser;
  text: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
  parentId?: string;
  replies?: CinderinoComment[];
}

// ============================================
// Notification Types
// ============================================

export interface CinderinoNotification {
  id: string;
  type: "like" | "comment" | "follow" | "mention" | "story_reply";
  fromUser: CinderinoUser;
  postId?: string;
  postImage?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// ============================================
// Search Types
// ============================================

export interface CinderinoSearchResult {
  users: CinderinoUser[];
  posts: CinderinoPost[];
  channels: CinderinoChannel[];
  tags: string[];
}

// ============================================
// Vibe System Types
// ============================================

export type VibeType = "fire" | "diamond" | "moon" | "lightning" | "palette";

export interface VibeReaction {
  type: VibeType;
  emoji: string;
  label: string;
  color: string;
}

export interface PostVibes {
  fire: number;
  diamond: number;
  moon: number;
  lightning: number;
  palette: number;
}

// ============================================
// Creative Challenge Types
// ============================================

export type ChallengeCategory =
  | "photography"
  | "art"
  | "design"
  | "writing"
  | "music";

export interface CinderinoChallenge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: ChallengeCategory;
  startsAt: string;
  endsAt: string;
  reward: ChallengeReward;
  participantsCount: number;
  coverGradient: [string, string];
  tags: string[];
}

export interface ChallengeReward {
  type: "badge" | "feature" | "boost";
  title: string;
  emoji: string;
  description: string;
}

export interface ChallengeParticipation {
  challengeId: string;
  joinedAt: string;
  submitted: boolean;
}

// ============================================
// Collab Canvas Types
// ============================================

export interface CanvasPoint {
  x: number;
  y: number;
  pressure?: number;
}

export type CanvasTool = "pen" | "brush" | "glow" | "spray" | "eraser";

export interface CanvasStroke {
  id: string;
  userId: string;
  username: string;
  points: CanvasPoint[];
  color: string;
  width: number;
  tool: CanvasTool;
  timestamp: number;
}

export interface CanvasLayer {
  id: string;
  name: string;
  strokes: CanvasStroke[];
  visible: boolean;
  opacity: number;
}

export interface CollabUser {
  userId: string;
  username: string;
  avatar: string;
  color: string;
  isOnline: boolean;
  lastActive: string;
}

export interface CollabCanvas {
  id: string;
  title: string;
  ownerId: string;
  collaborators: CollabUser[];
  layers: CanvasLayer[];
  activeLayerId: string;
  width: number;
  height: number;
  backgroundColor: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  publishedImageUrl?: string;
}

export interface CanvasInvite {
  id: string;
  canvasId: string;
  canvasTitle: string;
  fromUserId: string;
  fromUsername: string;
  toUserId: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}
