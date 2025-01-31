import PropTypes from "prop-types";
import CommentActions from "./CommentActions";
import VotingControls from "./VotingControls";
import { useState } from "react";
import CommentForm from "./CommentForm";

const Comment = ({ comment }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplyFormDisplay = () => {
    setShowReplyForm(`@${comment.user}`);
  };

  return (
    <>
      <div className={`w-full p-6 rounded-lg bg-comment`}>
        <div className="flex md:flex-row gap-6">
          <div className="hidden md:flex">
            <VotingControls votes={comment.votes} />
          </div>

          <div className="flex flex-col gap-4 w-full">
            <div className="flex justify-between">
              <div className="flex items-center gap-4">
                <div className="w-[32px] h-[32px] rounded-full border border-secondary bg-background" />
                <p className="text-base font-medium text-primary-text">
                  {comment.user}
                </p>
                <p className="text-base text-secondary">1 month ago</p>
              </div>

              <div className="hidden sm:flex">
                <CommentActions onReply={handleReplyFormDisplay} />
              </div>
            </div>

            <p className="font-normal text-base text-secondary">
              {comment.text}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center mt-6 sm:hidden">
          <VotingControls votes={12} />
          <CommentActions />
        </div>
      </div>
      {showReplyForm && (
        <CommentForm
          onSubmit={() => console.log("Reply submitted")}
          placeholder=""
          submitText="Reply"
          username={showReplyForm}
          className="mt-2"
        />
      )}
    </>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    user: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    votes: PropTypes.number.isRequired,
    replies: PropTypes.array,
  }).isRequired,
};

export default Comment;
