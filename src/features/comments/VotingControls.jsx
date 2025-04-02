import PropTypes from "prop-types";
import { UpVoteIcon } from "../../components/icons/UpVoteIcon";
import { DownVoteIcon } from "../../components/icons/DownVoteIcon";
import { useComments } from "../../hooks/useComments";
import { useState } from "react";
import axios from "axios";
import getApiBaseUrl from "../../utils/apiBaseUrl";

const VotingControls = ({ votes, commentId }) => {
  const { handleEditSuccess } = useComments();
  const [currentVotes, setCurrentVotes] = useState(votes);

  const handleVote = async (type) => {
    if (type === "downvote" && currentVotes === 0) {
      return;
    }

    try {
      const response = await axios.patch(
        `${getApiBaseUrl()}/api/comment/${commentId}/${type}`
      );

      if (response.status === 200) {
        const updatedVotes = response.data.votes;
        setCurrentVotes(updatedVotes);
        handleEditSuccess(commentId, response.data.text, updatedVotes);
      }
    } catch (error) {
      console.error(`Failed to ${type}vote:`, error);
    }
  };

  return (
    <div className="flex sm:flex-col flex-row items-center justify-between p-3 min-w-[120px] sm:min-w-[50px] max-h-[100px] sm:min-h-[100px] rounded-xl bg-background">
      <div
        onClick={() => handleVote("upvote")}
        className="text-primary-hover hover:text-primary cursor-pointer"
      >
        <UpVoteIcon />
      </div>
      <p className="font-medium text-primary m-0">{currentVotes}</p>
      <div
        onClick={() => handleVote("downvote")}
        className="text-primary-hover hover:text-primary cursor-pointer"
      >
        <DownVoteIcon />
      </div>
    </div>
  );
};

VotingControls.propTypes = {
  votes: PropTypes.number.isRequired,
  commentId: PropTypes.number.isRequired,
};

export default VotingControls;
