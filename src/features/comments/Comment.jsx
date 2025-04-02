import { useState } from "react";
import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";
import CommentActions from "./CommentActions";
import VotingControls from "./VotingControls";
import CommentForm from "./CommentForm";
import { useComments } from "../../hooks/useComments";
import { findParentComment } from "../../utils/commentUtils";
import DeleteConfirmationModal from "../../components/overlay/DeleteConfirmationModal";

const Comment = ({ comment }) => {
  const {
    error,
    loading,
    comments,
    currentUser,
    resetError,
    handleReplyAdded,
    handleEditSuccess,
    handleDeleteSuccess,
  } = useComments();

  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyUsername, setReplyUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isOwnComment = comment.user === currentUser;
  const parentComment = comment.parentId
    ? findParentComment(comments, comment.parentId)
    : null;

  const toggleReplyForm = () => {
    setReplyUsername(`@${comment.user}`);
    setShowReplyForm(true);
  };

  const startEditing = () => setIsEditing(true);

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedText(comment.text);
    resetError();
  };

  const handleReplySubmit = async (newReply) => {
    const success = await handleReplyAdded(comment.id, newReply);

    if (success) {
      setShowReplyForm(false);
    }
  };

  const handleEditComment = async () => {
    if (!editedText.trim()) return;

    const success = await handleEditSuccess(comment.id, editedText);

    if (success) {
      setIsEditing(false);
    }
  };

  const handleDeleteComment = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    handleDeleteSuccess(comment.id);
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className={`w-full p-6 rounded-lg bg-comment`}>
        <div className="flex md:flex-row gap-6">
          <div className="hidden md:flex">
            <VotingControls votes={comment.votes} commentId={comment.id} />
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
                  onReply={toggleReplyForm}
                  isOwnComment={isOwnComment}
                  hasReplies={comment.replies?.length > 0}
                  onDelete={handleDeleteComment}
                  onEdit={startEditing}
                />
              </div>
            </div>

            <div>
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={editedText}
                    onChange={(e) => {
                      if (error.edit) resetError();
                      setEditedText(e.target.value);
                    }}
                    className="w-full p-3 border border-border rounded-md outline-1 focus:outline-primary caret-primary"
                    rows={3}
                    disabled={loading.edit}
                  />

                  {error.edit && (
                    <p className="text-sm text-danger mt-2">{error.edit}</p>
                  )}

                  <div className="flex justify-end gap-4">
                    <button
                      onClick={handleEditComment}
                      disabled={loading.edit}
                      className="bg-primary text-white px-4 py-2 rounded-md cursor-pointer"
                    >
                      {loading.edit ? "Updating..." : "Update"}
                    </button>
                    <button
                      onClick={cancelEditing}
                      disabled={loading.edit}
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
          <VotingControls votes={comment.votes} commentId={comment.id} />
          <CommentActions
            onReply={toggleReplyForm}
            isOwnComment={isOwnComment}
            hasReplies={comment.replies?.length > 0}
            onDelete={handleDeleteComment}
            onEdit={startEditing}
          />
        </div>
      </div>
      {showReplyForm && (
        <CommentForm
          onCommentAdded={handleReplySubmit}
          placeholder={`Reply ${replyUsername}`}
          submitText={loading.reply ? "Replying..." : "Reply"}
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

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
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
