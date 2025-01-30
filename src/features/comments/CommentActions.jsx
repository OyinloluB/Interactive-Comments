import { ReplyCommentIcon } from "../../components/icons/ReplyCommentIcon";

const CommentActions = () => {
  return (
    <div className="flex items-center gap-2 font-medium text-base text-primary cursor-pointer">
      <ReplyCommentIcon />
      <span>Reply</span>
    </div>
  );
};

export default CommentActions;
