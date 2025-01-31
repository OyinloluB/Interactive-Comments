import PropTypes from "prop-types";
import { useState } from "react";

const CommentForm = ({
  onSubmit,
  placeholder,
  submitText,
  username,
  className,
}) => {
  const isReply = Boolean(username);
  const [commentText, setCommentText] = useState("");

  const handleChange = (e) => {
    const inputValue = e.target.value;

    setCommentText(inputValue);
  };

  return (
    <div
      className={`flex sm:flex-row flex-col items-start gap-4 p-6 rounded-md bg-comment ${className}`}
    >
      <div className="min-w-[32px] min-h-[32px] rounded-full border border-secondary bg-background hidden md:flex" />

      <div className="relative w-full">
        <div className="absolute left-4 top-4 text-primary pointer-events-none">
          {isReply && <span>{username}</span>}
        </div>
        <textarea
          type="text"
          value={commentText}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full min-h-[96px] p-4 border border-border focus:outline-0 placeholder:text-secondary placeholder:text-base rounded-md"
          style={{ paddingLeft: `${username?.length * 10 + 16}px` }}
        />
      </div>

      <button
        onClick={() => onSubmit(commentText)}
        className="bg-primary text-comment text-base rounded-md px-[30px] py-[12px] uppercase hover:bg-primary-dark transition hidden md:flex"
      >
        {submitText}
      </button>

      <div className="flex justify-between items-center w-full sm:hidden">
        <div className="min-w-[32px] min-h-[32px] rounded-full border border-secondary bg-background" />
        <button
          onClick={() => onSubmit(commentText)}
          className="bg-primary text-comment text-base rounded-md px-[30px] py-[12px] uppercase hover:bg-primary-dark transition"
        >
          {submitText}
        </button>
      </div>
    </div>
  );
};

CommentForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  submitText: PropTypes.string,
  username: PropTypes.string,
  className: PropTypes.string,
};

CommentForm.defaultProps = {
  placeholder: "Add a comment...",
  submitText: "Send",
  className: "",
};

export default CommentForm;
