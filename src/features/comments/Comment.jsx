import CommentActions from "./CommentActions";
import VotingControls from "../VotingControls";

const Comment = () => {
  return (
    <div className="w-full sm:max-w-[730px] p-6 rounded-lg bg-comment">
      <div className="flex md:flex-row gap-6">
        {/* Voting Controls */}
        <div className="hidden md:flex">
          <VotingControls votes={12} />
        </div>

        {/* Comment Content */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <div className="w-[32px] h-[32px] rounded-full border border-secondary bg-background" />
              <p className="text-base font-medium text-primary-text">
                {/* user name */}
                amyrobson
              </p>
              <p className="text-base text-secondary">
                {/* date */}1 month ago
              </p>
            </div>

            {/* Comment Actions */}
            <div className="hidden sm:flex">
              <CommentActions />
            </div>
          </div>

          <p className="font-normal text-base text-secondary">
            Impressive! Though it seems the drag feature could be improved. But
            overall it looks incredible. You’ve nailed the design and the
            responsiveness at various breakpoints works really well.
          </p>
        </div>

        {/* Mobile Voting Controls & Comments */}
      </div>
      <div className="flex justify-between items-center mt-6 sm:hidden">
        <VotingControls votes={12} />
        <CommentActions />
      </div>
    </div>
  );
};

export default Comment;
