import PropTypes from "prop-types";
import { ReplyCommentIcon } from "../../components/icons/ReplyCommentIcon";
import { EditIcon } from "../../components/icons/EditIcon";
import { DeleteIcon } from "../../components/icons/DeleteIcon";

const CommentActions = ({
  onReply,
  hasReplies,
  isOwnComment,
  onDelete,
  onEdit,
}) => {
  return (
    <div>
      {isOwnComment ? (
        <div className="flex gap-6">
          {!hasReplies && (
            <div
              onClick={onDelete}
              className="flex items-center gap-2 cursor-pointer text-danger group hover:text-danger-hover"
            >
              <DeleteIcon />
              <span>Delete</span>
            </div>
          )}
          <div
            onClick={onEdit}
            className="flex items-center gap-2 cursor-pointer text-primary hover:text-primary-hover"
          >
            <EditIcon />
            <span>Edit</span>
          </div>
        </div>
      ) : (
        <div
          className="flex items-center gap-2 font-medium text-base text-primary hover:text-primary-hover cursor-pointer"
          onClick={onReply}
        >
          <ReplyCommentIcon />
          <span>Reply</span>
        </div>
      )}
    </div>
  );
};

CommentActions.propTypes = {
  onReply: PropTypes.func.isRequired,
  isOwnComment: PropTypes.bool.isRequired,
  hasReplies: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default CommentActions;
