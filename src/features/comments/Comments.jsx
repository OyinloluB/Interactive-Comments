import ErrorModal from "../../components/overlay/ErrorModal";
import SpinnerOverlay from "../../components/overlay/SpinnerOverlay";
import { useComments } from "../../hooks/useComments";
import Comment from "./Comment";
import CommentForm from "./CommentForm";

const Comments = () => {
  const { error, resetError, loading, comments, handleCommentAdded } =
    useComments();

  return (
    <div className="flex justify-center min-h-screen sm:py-16 px-5 py-10 font-rubik bg-background">
      {loading.fetch && <SpinnerOverlay />}
      <div className="w-full sm:max-w-[730px] space-y-6">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}

        <CommentForm onCommentAdded={handleCommentAdded} />
      </div>
      <ErrorModal
        isOpen={!!error.fetch}
        message={error.fetch}
        onClose={resetError}
      />
    </div>
  );
};

export default Comments;
