import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext"; // ← مسیر auth خودت
import type { CommentAuthor } from "../types/comments";
export function useCurrentCommentUser(): CommentAuthor | null {
  const { user, isAuthenticated } = useAuth();
return useMemo(() => {
    if (!user || !isAuthenticated) return null;
return {
      id: user.id ?? user._id ?? user.username,
      name: user.fullName ?? user.username ?? user.name ?? "کاربر",
      avatar: user.avatar ?? user.profileImage ?? null,
      email: user.email,
      role: user.role ?? "user",
      isAuthenticated: true,
    };
  }, [user, isAuthenticated]);
}
