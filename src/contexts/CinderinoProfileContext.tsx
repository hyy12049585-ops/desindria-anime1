// src/contexts/CinderinoProfileContext.tsx

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import {
  CinderinoUser,
  CinderinoPost,
  CinderinoProfileState,
  CinderinoProfileStats,
} from "../types/cinderino";

const STORAGE_KEY = "cinderino_profile";

const generateId = (): string =>
  `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const now = (): string => new Date().toISOString();

// ======== Default User ========

const defaultUser: CinderinoUser = {
  id: "cind_user_001",
  username: "anime_lover",
  displayName: "انیمه لاور ✨",
  avatar: "",
  banner: "",
  bio: "عاشق انیمه و مانگا 🎌\nسیندرینو فضای منه",
  link: "",
  isVerified: false,
  isPrivate: false,
  joinedAt: now(),
};

const initialState: CinderinoProfileState = {
  user: defaultUser,
  myPosts: [],
  likedPosts: [],
  bookmarkedPosts: [],
  followers: [],
  following: [],
  stories: [],
  channels: [],
};

// ======== Actions ========

type Action =
  | { type: "UPDATE_PROFILE"; payload: Partial<CinderinoUser> }
  | { type: "ADD_POST"; payload: { images: string[]; caption: string; tags: string[] } }
  | { type: "DELETE_POST"; payload: string }
  | { type: "TOGGLE_LIKE_POST"; payload: CinderinoPost }
  | { type: "TOGGLE_BOOKMARK_POST"; payload: CinderinoPost }
  | { type: "FOLLOW_USER"; payload: CinderinoUser }
  | { type: "UNFOLLOW_USER"; payload: string }
  | { type: "LOAD_STATE"; payload: CinderinoProfileState };

// ======== Reducer ========

function reducer(state: CinderinoProfileState, action: Action): CinderinoProfileState {
  switch (action.type) {
    case "UPDATE_PROFILE":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case "ADD_POST": {
      const { images, caption, tags } = action.payload;
      const newPost: CinderinoPost = {
        id: generateId(),
        authorId: state.user.id,
        author: state.user,
        images,
        caption,
        tags,
        likes: 0,
        comments: 0,
        createdAt: now(),
        isLiked: false,
        isBookmarked: false,
      };
      return { ...state, myPosts: [newPost, ...state.myPosts] };
    }

    case "DELETE_POST":
      return {
        ...state,
        myPosts: state.myPosts.filter((p) => p.id !== action.payload),
      };

    case "TOGGLE_LIKE_POST": {
      const post = action.payload;
      const exists = state.likedPosts.some((p) => p.id === post.id);
      return {
        ...state,
        likedPosts: exists
          ? state.likedPosts.filter((p) => p.id !== post.id)
          : [{ ...post, isLiked: true }, ...state.likedPosts],
      };
    }

    case "TOGGLE_BOOKMARK_POST": {
      const post = action.payload;
      const exists = state.bookmarkedPosts.some((p) => p.id === post.id);
      return {
        ...state,
        bookmarkedPosts: exists
          ? state.bookmarkedPosts.filter((p) => p.id !== post.id)
          : [{ ...post, isBookmarked: true }, ...state.bookmarkedPosts],
      };
    }

    case "FOLLOW_USER": {
      if (state.following.some((u) => u.id === action.payload.id)) return state;
      return {
        ...state,
        following: [...state.following, action.payload],
      };
    }

    case "UNFOLLOW_USER":
      return {
        ...state,
        following: state.following.filter((u) => u.id !== action.payload),
      };

    case "LOAD_STATE":
      return action.payload;

    default:
      return state;
  }
}

// ======== Context Type ========

interface CinderinoProfileContextType {
  state: CinderinoProfileState;
  stats: CinderinoProfileStats;
  updateProfile: (data: Partial<CinderinoUser>) => void;
  addPost: (images: string[], caption: string, tags: string[]) => void;
  deletePost: (id: string) => void;
  toggleLikePost: (post: CinderinoPost) => void;
  toggleBookmarkPost: (post: CinderinoPost) => void;
  followUser: (user: CinderinoUser) => void;
  unfollowUser: (id: string) => void;
  isPostLiked: (id: string) => boolean;
  isPostBookmarked: (id: string) => boolean;
  isFollowing: (id: string) => boolean;
}

const CinderinoProfileContext = createContext<CinderinoProfileContextType | null>(null);

// ======== Provider ========

export const CinderinoProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...init, ...JSON.parse(saved) };
    } catch { /* ignore */ }
    return init;
  });

  // Persist
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch { /* ignore */ }
  }, [state]);

  const updateProfile = useCallback((data: Partial<CinderinoUser>) => {
    dispatch({ type: "UPDATE_PROFILE", payload: data });
  }, []);

  const addPost = useCallback((images: string[], caption: string, tags: string[]) => {
    dispatch({ type: "ADD_POST", payload: { images, caption, tags } });
  }, []);

  const deletePost = useCallback((id: string) => {
    dispatch({ type: "DELETE_POST", payload: id });
  }, []);

  const toggleLikePost = useCallback((post: CinderinoPost) => {
    dispatch({ type: "TOGGLE_LIKE_POST", payload: post });
  }, []);

  const toggleBookmarkPost = useCallback((post: CinderinoPost) => {
    dispatch({ type: "TOGGLE_BOOKMARK_POST", payload: post });
  }, []);

  const followUser = useCallback((user: CinderinoUser) => {
    dispatch({ type: "FOLLOW_USER", payload: user });
  }, []);

  const unfollowUser = useCallback((id: string) => {
    dispatch({ type: "UNFOLLOW_USER", payload: id });
  }, []);

  const isPostLiked = useCallback(
    (id: string) => state.likedPosts.some((p) => p.id === id),
    [state.likedPosts]
  );

  const isPostBookmarked = useCallback(
    (id: string) => state.bookmarkedPosts.some((p) => p.id === id),
    [state.bookmarkedPosts]
  );

  const isFollowing = useCallback(
    (id: string) => state.following.some((u) => u.id === id),
    [state.following]
  );

  const stats: CinderinoProfileStats = useMemo(() => ({
    postsCount: state.myPosts.length,
    followersCount: state.followers.length,
    followingCount: state.following.length,
  }), [state.myPosts.length, state.followers.length, state.following.length]);

  const value: CinderinoProfileContextType = {
    state,
    stats,
    updateProfile,
    addPost,
    deletePost,
    toggleLikePost,
    toggleBookmarkPost,
    followUser,
    unfollowUser,
    isPostLiked,
    isPostBookmarked,
    isFollowing,
  };

  return (
    <CinderinoProfileContext.Provider value={value}>
      {children}
    </CinderinoProfileContext.Provider>
  );
};

// ======== Hook ========

export function useCinderinoProfile(): CinderinoProfileContextType {
  const ctx = useContext(CinderinoProfileContext);
  if (!ctx) throw new Error("useCinderinoProfile must be used within CinderinoProfileProvider");
  return ctx;
}
