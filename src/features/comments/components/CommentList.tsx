import { CommentItem } from "./CommentItem";
import type { CommentEntity } from "../types/comments";
interface CommentListProps {
  comments: CommentEntity[];
}
export function CommentList({ comments }: CommentListProps) {
  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          body={comment.body ?? comment.content}
          replies={comment.replies ?? []}
        />
      ))}
    </div>
  );
}
