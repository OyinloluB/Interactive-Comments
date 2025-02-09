import { useState } from "react";
import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";
import CommentActions from "./CommentActions";
import VotingControls from "./VotingControls";
import CommentForm from "./CommentForm";
import axios from "axios";
import { useComments } from "../../hooks/useComments";
import { findParentComment } from "../../utils/commentUtils";

const Comment = ({ comment }) => {
  const {
    handleReplyAdded,
    handleEditSuccess,
    handleDeleteSuccess,
    currentUser,
    comments,
  } = useComments();

  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyUsername, setReplyUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);

  const isOwnComment = comment.user === currentUser;
  const parentComment = comment.parentId
    ? findParentComment(comments, comment.parentId)
    : null;

  const handleReplyFormToggle = () => {
    setReplyUsername(`@${comment.user}`);
    setShowReplyForm(true);
  };

  const handleReplySubmit = (newReply) => {
    console.log("clicked");
    handleReplyAdded(comment.id, newReply);
    setShowReplyForm(false);
  };

  const handleEditComment = async () => {
    if (!editedText.trim()) return;

    try {
      const response = await axios.put(
        `http://localhost:5001/api/comment/${comment.id}`,
        { text: editedText }
      );

      if (response.status === 200) {
        handleEditSuccess(comment.id, response.data.text);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to edit comment:", error);
    }
  };

  const handleDeleteComment = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5001/api/comment/${comment.id}`
      );

      if (response.status === 200) {
        handleDeleteSuccess(comment.id);
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
      alert(error.response?.data?.error || "Failed to delete comment");
    }
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
                <p className="text-base text-secondary">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>

              <div className="hidden sm:flex">
                <CommentActions
                  onReply={handleReplyFormToggle}
                  isOwnComment={isOwnComment}
                  hasReplies={comment.replies?.length > 0}
                  onDelete={handleDeleteComment}
                  onEdit={() => setIsEditing(true)}
                />
              </div>
            </div>

            <div>
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full p-3 border border-border rounded-md focus:outline-primary"
                    rows={3}
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={handleEditComment}
                      className="bg-primary text-white px-4 py-2 rounded-md cursor-pointer"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-400 text-white px-4 py-2 rounded-md cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="font-normal text-base text-secondary">
                  {parentComment && (
                    <span className="mr-1 text-primary font-medium">
                      @{parentComment.user}
                    </span>
                  )}
                  {comment.text}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-6 sm:hidden">
          <VotingControls votes={12} />
          <CommentActions
            onReply={handleReplyFormToggle}
            isOwnComment={isOwnComment}
            hasReplies={comment.replies?.length > 0}
            onDelete={handleDeleteComment}
            onEdit={() => setIsEditing(true)}
          />
        </div>
      </div>
      {showReplyForm && (
        <CommentForm
          onCommentAdded={handleReplySubmit}
          placeholder={`Reply ${replyUsername}`}
          submitText="Reply"
          username={replyUsername}
          parentId={comment.id}
          className="mt-2"
        />
      )}

      {comment.replies?.length > 0 && (
        <div className="mt-4 space-y-4 sm:ml-10 sm:pl-10 pl-5 border-l-2 border-gray-200">
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} replyingTo={comment.user} />
          ))}
        </div>
      )}
    </>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    parentId: PropTypes.number,
    user: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    votes: PropTypes.number.isRequired,
    replies: PropTypes.array,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default Comment;
