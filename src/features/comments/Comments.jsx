import PropTypes from "prop-types";
import Comment from "./Comment";
import CommentForm from "./CommentForm";

const Comments = ({ comments }) => {
  const handleCommentSubmit = () => {
    console.log("New comment submitted");
  };

  return (
    <div className="flex justify-center min-h-screen sm:py-16 px-5 py-10 font-rubik bg-background ">
      <div className="sm:max-w-[730px] space-y-6">
        {comments.map((comment) => (
          <div key={comment.id}>
            <Comment comment={comment} />

            {comment.replies.length > 0 && (
              <div className="mt-4 space-y-4 sm:ml-10 sm:pl-10 pl-5 border-l-2 border-gray-200">
                {comment.replies.map((reply) => (
                  <Comment
                    key={reply.id}
                    comment={reply}
                    replyingTo={comment.user}
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        <CommentForm onSubmit={handleCommentSubmit} />
      </div>
    </div>
  );
};

Comments.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      user: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      votes: PropTypes.number.isRequired,
      replies: PropTypes.array,
    })
  ).isRequired,
};

export default Comments;
