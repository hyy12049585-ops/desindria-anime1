// src/utils/cinderinoStorage.ts

import type {
  CinderinoComment,
  CinderinoUser,
  VibeType,
  PostVibes,
  ChallengeParticipation,
  CollabCanvas,
  CanvasStroke,
  CanvasLayer,
  CollabUser,
  CanvasInvite,
} from "../types/cinderino";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─────────────────────────────────────────────
// لایک پست
// ─────────────────────────────────────────────

export function isPostLiked(postId: string): boolean {
  return loadJSON(`cinderino-liked-${postId}`, false);
}

export function togglePostLike(postId: string): boolean {
  const next = !isPostLiked(postId);
  saveJSON(`cinderino-liked-${postId}`, next);
  return next;
}

// ─────────────────────────────────────────────
// بوکمارک پست
// ─────────────────────────────────────────────

export function isPostBookmarked(postId: string): boolean {
  return loadJSON(`cinderino-bookmarked-${postId}`, false);
}

export function togglePostBookmark(postId: string): boolean {
  const next = !isPostBookmarked(postId);
  saveJSON(`cinderino-bookmarked-${postId}`, next);
  return next;
}

// ─────────────────────────────────────────────
// کامنت‌ها
// ─────────────────────────────────────────────

const COMMENTS_KEY = "cinderino-all-comments";

export function getPostComments(postId: string): CinderinoComment[] {
  const all: CinderinoComment[] = loadJSON(COMMENTS_KEY, []);
  const topLevel = all.filter((c) => c.postId === postId && !c.parentId);

  return topLevel.map((c) => ({
    ...c,
    isLiked: isCommentLiked(c.id),
    replies: all
      .filter((r) => r.parentId === c.id)
      .map((r) => ({ ...r, isLiked: isCommentLiked(r.id) })),
  }));
}

export function addPostComment(
  postId: string,
  text: string,
  author: CinderinoUser,
  parentId?: string
): CinderinoComment {
  const all: CinderinoComment[] = loadJSON(COMMENTS_KEY, []);

  const newComment: CinderinoComment = {
    id: crypto.randomUUID(),
    postId,
    authorId: author.id,
    author,
    text,
    likes: 0,
    isLiked: false,
    createdAt: new Date().toISOString(),
    parentId,
  };

  all.push(newComment);
  saveJSON(COMMENTS_KEY, all);
  return newComment;
}

export function getCommentCount(postId: string): number {
  const all: CinderinoComment[] = loadJSON(COMMENTS_KEY, []);
  return all.filter((c) => c.postId === postId).length;
}

export function isCommentLiked(commentId: string): boolean {
  return loadJSON(`cinderino-comment-liked-${commentId}`, false);
}

export function toggleCommentLike(
  commentId: string
): { liked: boolean; likes: number } {
  const all: CinderinoComment[] = loadJSON(COMMENTS_KEY, []);
  const comment = all.find((c) => c.id === commentId);
  if (!comment) return { liked: false, likes: 0 };

  const wasLiked = isCommentLiked(commentId);
  const nowLiked = !wasLiked;

  saveJSON(`cinderino-comment-liked-${commentId}`, nowLiked);

  comment.likes = nowLiked
    ? comment.likes + 1
    : Math.max(0, comment.likes - 1);
  comment.isLiked = nowLiked;
  saveJSON(COMMENTS_KEY, all);

  return { liked: nowLiked, likes: comment.likes };
}

// ─────────────────────────────────────────────
// Vibe System
// ─────────────────────────────────────────────

const VIBES_KEY = "cinderino-vibes";

export function getPostVibes(postId: string): PostVibes {
  return loadJSON(`${VIBES_KEY}-${postId}`, {
    fire: 0,
    diamond: 0,
    moon: 0,
    lightning: 0,
    palette: 0,
  });
}

export function getUserVibe(postId: string): VibeType | null {
  return loadJSON(`${VIBES_KEY}-user-${postId}`, null);
}

export function toggleVibe(
  postId: string,
  vibe: VibeType
): { vibes: PostVibes; userVibe: VibeType | null } {
  const current = getPostVibes(postId);
  const userCurrent = getUserVibe(postId);

  if (userCurrent === vibe) {
    current[vibe] = Math.max(0, current[vibe] - 1);
    saveJSON(`${VIBES_KEY}-${postId}`, current);
    saveJSON(`${VIBES_KEY}-user-${postId}`, null);
    return { vibes: current, userVibe: null };
  }

  if (userCurrent) {
    current[userCurrent] = Math.max(0, current[userCurrent] - 1);
  }

  current[vibe] = current[vibe] + 1;
  saveJSON(`${VIBES_KEY}-${postId}`, current);
  saveJSON(`${VIBES_KEY}-user-${postId}`, vibe);

  return { vibes: current, userVibe: vibe };
}

export function getTotalVibes(vibes: PostVibes): number {
  return (
    vibes.fire + vibes.diamond + vibes.moon + vibes.lightning + vibes.palette
  );
}

// ─────────────────────────────────────────────
// Creative Challenges
// ─────────────────────────────────────────────

const CHALLENGES_KEY = "cinderino-challenges";

export function getJoinedChallenges(): ChallengeParticipation[] {
  return loadJSON(CHALLENGES_KEY, []);
}

export function isChallengeJoined(challengeId: string): boolean {
  return getJoinedChallenges().some((c) => c.challengeId === challengeId);
}

export function joinChallenge(challengeId: string): ChallengeParticipation {
  const all = getJoinedChallenges();
  const entry: ChallengeParticipation = {
    challengeId,
    joinedAt: new Date().toISOString(),
    submitted: false,
  };
  all.push(entry);
  saveJSON(CHALLENGES_KEY, all);
  return entry;
}

export function leaveChallenge(challengeId: string): void {
  const all = getJoinedChallenges().filter(
    (c) => c.challengeId !== challengeId
  );
  saveJSON(CHALLENGES_KEY, all);
}

// ─────────────────────────────────────────────
// Collab Canvas
// ─────────────────────────────────────────────

const CANVASES_KEY = "cinderino-canvases";
const INVITES_KEY = "cinderino-canvas-invites";

const COLLAB_COLORS = [
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#6366f1",
  "#14b8a6",
];

export function getCanvases(): CollabCanvas[] {
  return loadJSON(CANVASES_KEY, []);
}

export function createCanvas(
  title: string,
  userId: string,
  username: string,
  avatar: string
): CollabCanvas {
  const all = getCanvases();

  const owner: CollabUser = {
    userId,
    username,
    avatar,
    color: COLLAB_COLORS[0],
    isOnline: true,
    lastActive: new Date().toISOString(),
  };

  const defaultLayer: CanvasLayer = {
    id: crypto.randomUUID(),
    name: "لایه ۱",
    strokes: [],
    visible: true,
    opacity: 1,
  };

  const newCanvas: CollabCanvas = {
    id: crypto.randomUUID(),
    title,
    ownerId: userId,
    collaborators: [owner],
    layers: [defaultLayer],
    activeLayerId: defaultLayer.id,
    width: 1080,
    height: 1080,
    backgroundColor: "#0a0612",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublished: false,
  };

  all.push(newCanvas);
  saveJSON(CANVASES_KEY, all);
  return newCanvas;
}

export function getCanvasById(canvasId: string): CollabCanvas | null {
  return getCanvases().find((c) => c.id === canvasId) || null;
}

export function updateCanvas(canvas: CollabCanvas): void {
  const all = getCanvases();
  const idx = all.findIndex((c) => c.id === canvas.id);
  if (idx !== -1) {
    all[idx] = { ...canvas, updatedAt: new Date().toISOString() };
    saveJSON(CANVASES_KEY, all);
  }
}

export function addStrokeToCanvas(
  canvasId: string,
  layerId: string,
  stroke: CanvasStroke
): CollabCanvas | null {
  const canvas = getCanvasById(canvasId);
  if (!canvas) return null;

  const layer = canvas.layers.find((l) => l.id === layerId);
  if (!layer) return null;

  layer.strokes.push(stroke);
  updateCanvas(canvas);
  return canvas;
}

export function undoLastStroke(
  canvasId: string,
  layerId: string,
  userId: string
): CollabCanvas | null {
  const canvas = getCanvasById(canvasId);
  if (!canvas) return null;

  const layer = canvas.layers.find((l) => l.id === layerId);
  if (!layer) return null;

  for (let i = layer.strokes.length - 1; i >= 0; i--) {
    if (layer.strokes[i].userId === userId) {
      layer.strokes.splice(i, 1);
      break;
    }
  }

  updateCanvas(canvas);
  return canvas;
}

export function clearCanvasLayer(
  canvasId: string,
  layerId: string
): CollabCanvas | null {
  const canvas = getCanvasById(canvasId);
  if (!canvas) return null;

  const layer = canvas.layers.find((l) => l.id === layerId);
  if (!layer) return null;

  layer.strokes = [];
  updateCanvas(canvas);
  return canvas;
}

export function addLayerToCanvas(
  canvasId: string,
  name: string
): CollabCanvas | null {
  const canvas = getCanvasById(canvasId);
  if (!canvas) return null;

  const newLayer: CanvasLayer = {
    id: crypto.randomUUID(),
    name,
    strokes: [],
    visible: true,
    opacity: 1,
  };

  canvas.layers.push(newLayer);
  canvas.activeLayerId = newLayer.id;
  updateCanvas(canvas);
  return canvas;
}

export function publishCanvas(
  canvasId: string,
  imageDataUrl: string
): CollabCanvas | null {
  const canvas = getCanvasById(canvasId);
  if (!canvas) return null;

  canvas.isPublished = true;
  canvas.publishedImageUrl = imageDataUrl;
  updateCanvas(canvas);
  return canvas;
}

export function deleteCanvas(canvasId: string): void {
  const all = getCanvases().filter((c) => c.id !== canvasId);
  saveJSON(CANVASES_KEY, all);
}

// ─── Canvas Invites ───

export function getCanvasInvites(userId: string): CanvasInvite[] {
  const all: CanvasInvite[] = loadJSON(INVITES_KEY, []);
  return all.filter(
    (inv) => inv.toUserId === userId && inv.status === "pending"
  );
}

export function sendCanvasInvite(
  canvasId: string,
  fromUserId: string,
  fromUsername: string,
  toUserId: string
): CanvasInvite {
  const all: CanvasInvite[] = loadJSON(INVITES_KEY, []);

  // ← عنوان بوم رو از storage بخون
  const canvas = getCanvasById(canvasId);
  const canvasTitle = canvas?.title ?? `Canvas #${canvasId.slice(0, 6)}`;

  const invite: CanvasInvite = {
    id: crypto.randomUUID(),
    canvasId,
    canvasTitle,              // ← اضافه شد
    fromUserId,
    fromUsername,
    toUserId,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  all.push(invite);
  saveJSON(INVITES_KEY, all);
  return invite;
}


export function acceptCanvasInvite(
  inviteId: string,
  userId: string,
  username: string,
  avatar: string
): CollabCanvas | null {
  const allInvites: CanvasInvite[] = loadJSON(INVITES_KEY, []);
  const invite = allInvites.find((inv) => inv.id === inviteId);
  if (!invite) return null;

  invite.status = "accepted";
  saveJSON(INVITES_KEY, allInvites);

  const canvas = getCanvasById(invite.canvasId);
  if (!canvas) return null;

  if (!canvas.collaborators.some((u) => u.userId === userId)) {
    const colorIdx = canvas.collaborators.length % COLLAB_COLORS.length;
    canvas.collaborators.push({
      userId,
      username,
      avatar,
      color: COLLAB_COLORS[colorIdx],
      isOnline: true,
      lastActive: new Date().toISOString(),
    });
    updateCanvas(canvas);
  }

  return canvas;
}

export function declineCanvasInvite(inviteId: string): void {
  const allInvites: CanvasInvite[] = loadJSON(INVITES_KEY, []);
  const invite = allInvites.find((inv) => inv.id === inviteId);
  if (invite) {
    invite.status = "declined";
    saveJSON(INVITES_KEY, allInvites);
  }
}
