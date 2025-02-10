import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";

const CommentForm = ({
  placeholder,
  submitText,
  className,
  parentId,
  onCommentAdded,
}) => {
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    try {
      setLoading(true);

      const response = await axios.post("http://localhost:5001/api/comment", {
        user: "John Doe",
        text: commentText,
        parentId: parentId || null,
      });

      onCommentAdded(response.data);
      setCommentText("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex sm:flex-row flex-col items-start gap-4 p-6 rounded-md bg-comment ${className}`}
    >
      <div className="min-w-[32px] min-h-[32px] rounded-full border border-secondary bg-background hidden md:flex" />
      <div className="relative w-full">
        <textarea
          type="text"
          value={commentText}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full min-h-[96px] p-4 border border-border focus:outline-1 focus:outline-primary placeholder:text-secondary placeholder:text-base rounded-md caret-primary"
        />
      </div>

      <button
        disabled={loading}
        onClick={handleSubmit}
        className="bg-primary text-comment text-base rounded-md px-[30px] py-[12px] cursor-pointer uppercase hover:bg-primary-hover transition hidden md:flex"
      >
        {loading ? "Sending..." : submitText}
      </button>

      <div className="flex justify-between items-center w-full sm:hidden">
        <div className="min-w-[32px] min-h-[32px] rounded-full border border-secondary bg-background" />
        <button
          disabled={loading}
          onClick={handleSubmit}
          className="bg-primary text-comment text-base rounded-md px-[30px] py-[12px] cursor-pointer uppercase hover:bg-primary-hover transition"
        >
          {loading ? "Sending..." : submitText}
        </button>
      </div>
    </div>
  );
};

CommentForm.propTypes = {
  placeholder: PropTypes.string,
  submitText: PropTypes.string,
  className: PropTypes.string,
  parentId: PropTypes.number,
  onCommentAdded: PropTypes.func.isRequired,
};

CommentForm.defaultProps = {
  placeholder: "Add a comment...",
  submitText: "Send",
  className: "",
  parentId: null,
};

export default CommentForm;
