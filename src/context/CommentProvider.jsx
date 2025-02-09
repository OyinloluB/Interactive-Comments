import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  addReplyToNestedComment,
  deleteNestedComment,
  organizeComments,
  updateNestedComment,
} from "../utils/commentUtils";
import { CommentContext } from "./CommentContext";

export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState([]);
  const currentUser = "John Doe";

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/comment");

        setComments(organizeComments(response.data));
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };
    fetchComments();
  }, []);

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [...prev, { ...newComment, replies: [] }]);
  };

  const handleReplyAdded = (parentId, newReply) => {
    setComments((prev) => {
      const updatedComments = addReplyToNestedComment(prev, parentId, newReply);
      return updatedComments;
    });
  };

  const handleEditSuccess = (commentId, newText, newVotes) => {
    setComments((prev) =>
      updateNestedComment(prev, commentId, newText, newVotes)
    );
  };

  const handleDeleteSuccess = (commentId) => {
    setComments((prev) => deleteNestedComment(prev, commentId));
  };

  return (
    <CommentContext.Provider
      value={{
        comments,
        currentUser,
        handleCommentAdded,
        handleReplyAdded,
        handleEditSuccess,
        handleDeleteSuccess,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};

CommentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
