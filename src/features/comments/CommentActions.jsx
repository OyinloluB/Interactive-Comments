import PropTypes from "prop-types";
import { ReplyCommentIcon } from "../../components/icons/ReplyCommentIcon";

const CommentActions = ({ onReply }) => {
  return (
    <div
      className="flex items-center gap-2 font-medium text-base text-primary cursor-pointer"
      onClick={onReply}
    >
      <ReplyCommentIcon />
      <span>Reply</span>
    </div>
  );
};

CommentActions.propTypes = {
  onReply: PropTypes.func.isRequired,
}

export default CommentActions;
