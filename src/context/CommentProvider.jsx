import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useReducer } from "react";
import {
  addReplyToNestedComment,
  deleteNestedComment,
  organizeComments,
  updateNestedComment,
} from "../utils/commentUtils";
import { CommentContext } from "./CommentContext";

const initialState = {
  comments: [],
  error: null,
  loading: true,
};

const commentReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return { ...state, comments: action.payload, loading: false };

    case "FETCH_ERROR":
      return { ...state, error: action.payload, loading: false };

    case "RESET_ERROR":
      return { ...state, error: null };

    case "ADD_COMMENT_START":
    case "EDIT_COMMENT_START":
    case "DELETE_COMMENT_START":
    case "ADD_REPLY_START":
      return { ...state, loading: true, error: null };

    case "ADD_COMMENT_SUCCESS":
    case "EDIT_COMMENT_SUCCESS":
    case "DELETE_COMMENT_SUCCESS":
    case "ADD_REPLY_SUCCESS":
      return { ...state, loading: false };

    case "ADD_COMMENT_ERROR":
    case "EDIT_COMMENT_ERROR":
    case "DELETE_COMMENT_ERROR":
    case "ADD_REPLY_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "ADD_COMMENT":
      return {
        ...state,
        comments: [...state.comments, { ...action.payload, replies: [] }],
      };

    case "ADD_REPLY":
      return {
        ...state,
        comments: addReplyToNestedComment(
          state.comments,
          action.parentId,
          action.payload
        ),
      };

    case "EDIT_COMMENT":
      return {
        ...state,
        comments: updateNestedComment(
          state.comments,
          action.commentId,
          action.newText,
          action.newVotes
        ),
      };

    case "DELETE_COMMENT":
      return {
        ...state,
        comments: deleteNestedComment(state.comments, action.commentId),
      };

    default:
      return state;
  }
};

export const CommentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(commentReducer, initialState);
  const currentUser = "John Doe";

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/comment`
        );
        dispatch({
          type: "FETCH_SUCCESS",
          payload: organizeComments(response.data),
        });
      } catch (error) {
        console.error("Failed to fetch comments:", error);
        dispatch({ type: "FETCH_ERROR", payload: "Failed to fetch comments" });
      }
    };

    fetchComments();
  }, []);

  const handleCommentAdded = async (newComment) => {
    dispatch({ type: "ADD_COMMENT_START" });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/comment`,
        newComment
      );
      dispatch({ type: "ADD_COMMENT_SUCCESS" });
      dispatch({ type: "ADD_COMMENT", payload: response.data });
    } catch (error) {
      console.error("Failed to add comment:", error);
      dispatch({ type: "ADD_COMMENT_ERROR", payload: "Failed to add comment" });
    }
  };

  const handleReplyAdded = async (parentId, newReply) => {
    dispatch({ type: "ADD_REPLY_START" });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/comment`,
        newReply
      );
      dispatch({ type: "ADD_REPLY_SUCCESS" });
      dispatch({ type: "ADD_REPLY", parentId, payload: response.data });
    } catch (error) {
      console.error("Failed to add reply:", error);
      dispatch({
        type: "ADD_REPLY_ERROR",
        payload: error.response.data.error ?? "Failed to add reply",
      });
    }
  };

  const handleEditSuccess = async (commentId, newText, newVotes = null) => {
    dispatch({ type: "EDIT_COMMENT_START" });

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/comment/${commentId}`,
        {
          text: newText,
        }
      );

      dispatch({ type: "EDIT_COMMENT_SUCCESS" });

      const updatedComment = response.data;
      dispatch({
        type: "EDIT_COMMENT",
        commentId,
        newText: updatedComment.text,
        newVotes: newVotes ?? updatedComment.votes,
      });
    } catch (error) {
      console.error("Failed to edit comment:", error);
      dispatch({
        type: "EDIT_COMMENT_ERROR",
        payload: "Failed to edit comment",
      });
    }
  };

  const handleDeleteSuccess = async (commentId) => {
    dispatch({ type: "DELETE_COMMENT_START" });

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/comment/${commentId}`
      );
      dispatch({ type: "DELETE_COMMENT_SUCCESS" });
      dispatch({ type: "DELETE_COMMENT", commentId });
    } catch (error) {
      console.error("Failed to delete comment:", error);
      dispatch({
        type: "DELETE_COMMENT_ERROR",
        payload: "Failed to delete comment",
      });
    }
  };

  const resetError = () => {
    dispatch({ type: "RESET_ERROR" });
  };

  return (
    <CommentContext.Provider
      value={{
        comments: state.comments,
        loading: state.loading,
        error: state.error,
        currentUser,
        handleCommentAdded,
        handleReplyAdded,
        handleEditSuccess,
        handleDeleteSuccess,
        resetError,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};

CommentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
