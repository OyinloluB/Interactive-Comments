import PropTypes from "prop-types";
import { UpVoteIcon } from "../../components/icons/UpVoteIcon";
import { DownVoteIcon } from "../../components/icons/DownVoteIcon";

const VotingControls = ({ votes }) => {
  return (
    <div className="flex sm:flex-col flex-row items-center justify-between p-3 min-w-[120px] sm:min-w-[50px] max-h-[100px] sm:min-h-[100px] rounded-xl bg-background">
      <UpVoteIcon className="cursor-pointer" />
      <p className="font-medium text-primary m-0">{votes}</p>
      <DownVoteIcon className="cursor-pointer" />
    </div>
  );
};

VotingControls.propTypes = {
  votes: PropTypes.number.isRequired,
};

export default VotingControls;
