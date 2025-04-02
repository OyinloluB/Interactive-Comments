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
import getApiBaseUrl from "../utils/apiBaseUrl";

const initialState = {
  comments: [],
  error: {
    fetch: null,
    add: null,
    reply: null,
    edit: null,
    delete: null,
  },
  loading: {
    fetch: false,
    add: false,
    reply: false,
    edit: false,
    delete: false,
  },
};

const commentReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        loading: { ...state.loading, fetch: true },
        error: { ...state.error, fetch: null },
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        comments: action.payload,
        loading: { ...state.loading, fetch: false },
      };
    case "FETCH_ERROR":
      return {
        ...state,
        loading: { ...state.loading, fetch: false },
        error: { ...state.error, fetch: action.payload },
      };

    case "ADD_COMMENT_START":
      return {
        ...state,
        loading: { ...state.loading, add: true },
        error: { ...state.error, add: null },
      };
    case "ADD_COMMENT_SUCCESS":
      return {
        ...state,
        loading: { ...state.loading, add: false },
      };
    case "ADD_COMMENT_ERROR":
      return {
        ...state,
        loading: { ...state.loading, add: false },
        error: { ...state.error, add: action.payload },
      };
    case "ADD_COMMENT":
      return {
        ...state,
        comments: [...state.comments, { ...action.payload, replies: [] }],
      };

    case "ADD_REPLY_START":
      return {
        ...state,
        loading: { ...state.loading, reply: true },
        error: { ...state.error, reply: null },
      };
    case "ADD_REPLY_SUCCESS":
      return {
        ...state,
        loading: { ...state.loading, reply: false },
      };
    case "ADD_REPLY_ERROR":
      return {
        ...state,
        loading: { ...state.loading, reply: false },
        error: { ...state.error, reply: action.payload },
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

    case "EDIT_COMMENT_START":
      return {
        ...state,
        loading: { ...state.loading, edit: true },
        error: { ...state.error, edit: null },
      };
    case "EDIT_COMMENT_SUCCESS":
      return {
        ...state,
        loading: { ...state.loading, edit: false },
      };
    case "EDIT_COMMENT_ERROR":
      return {
        ...state,
        loading: { ...state.loading, edit: false },
        error: { ...state.error, edit: action.payload },
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

    case "DELETE_COMMENT_START":
      return {
        ...state,
        loading: { ...state.loading, delete: true },
        error: { ...state.error, delete: null },
      };
    case "DELETE_COMMENT_SUCCESS":
      return {
        ...state,
        loading: { ...state.loading, delete: false },
      };
    case "DELETE_COMMENT_ERROR":
      return {
        ...state,
        loading: { ...state.loading, delete: false },
        error: { ...state.error, delete: action.payload },
      };
    case "DELETE_COMMENT":
      return {
        ...state,
        comments: deleteNestedComment(state.comments, action.commentId),
      };

    case "RESET_ERROR":
      return {
        ...state,
        error: {
          fetch: null,
          add: null,
          reply: null,
          edit: null,
          delete: null,
        },
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
      dispatch({ type: "FETCH_START" });
      try {
        const response = await axios.get(`${getApiBaseUrl()}/api/comment`);
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
        `${getApiBaseUrl()}/api/comment`,
        newComment
      );
      dispatch({ type: "ADD_COMMENT_SUCCESS" });
      dispatch({ type: "ADD_COMMENT", payload: response.data });
    } catch (error) {
      console.error("Failed to add comment:", error);
      const errorMsg = error.response?.data?.error ?? "Failed to add comment";
      dispatch({ type: "ADD_COMMENT_ERROR", payload: errorMsg });
    }
  };

  const handleReplyAdded = async (parentId, newReply) => {
    dispatch({ type: "ADD_REPLY_START" });

    try {
      const response = await axios.post(
        `${getApiBaseUrl()}/api/comment`,
        newReply
      );
      dispatch({ type: "ADD_REPLY_SUCCESS" });
      dispatch({ type: "ADD_REPLY", parentId, payload: response.data });
    } catch (error) {
      console.error("Failed to add reply:", error);
      dispatch({
        type: "ADD_REPLY_ERROR",
        payload: error.response?.data?.error ?? "Failed to add reply",
      });
    }
  };

  const handleEditSuccess = async (commentId, newText, newVotes = null) => {
    dispatch({ type: "EDIT_COMMENT_START" });

    try {
      const response = await axios.put(
        `${getApiBaseUrl()}/api/comment/${commentId}`,
        { text: newText }
      );

      dispatch({ type: "EDIT_COMMENT_SUCCESS" });

      const updatedComment = response.data;
      dispatch({
        type: "EDIT_COMMENT",
        commentId,
        newText: updatedComment.text,
        newVotes: newVotes ?? updatedComment.votes,
      });

      return true;
    } catch (error) {
      console.error("Failed to edit comment:", error);
      const errorMsg = error.response?.data?.error ?? "Failed to edit comment";
      dispatch({
        type: "EDIT_COMMENT_ERROR",
        payload: errorMsg,
      });
      return false;
    }
  };

  const handleDeleteSuccess = async (commentId) => {
    dispatch({ type: "DELETE_COMMENT_START" });

    try {
      await axios.delete(`${getApiBaseUrl()}/api/comment/${commentId}`);
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
