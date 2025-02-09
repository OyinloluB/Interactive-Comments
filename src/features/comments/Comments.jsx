import { useComments } from "../../hooks/useComments";
import Comment from "./Comment";
import CommentForm from "./CommentForm";

const Comments = () => {
  const { comments, handleCommentAdded } = useComments();

  return (
    <div className="flex justify-center min-h-screen sm:py-16 px-5 py-10 font-rubik bg-background">
      <div className="sm:min-w-[730px] space-y-6">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}

        <CommentForm onCommentAdded={handleCommentAdded} />
      </div>
    </div>
  );
};

export default Comments;
