export const organizeComments = (comments) => {
  const commentMap = {};
  const rootComments = [];

  comments.forEach((comment) => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });

  comments.forEach((comment) => {
    if (comment.parentId) {
      let topLevelParent = commentMap[comment.parentId];

      while (topLevelParent?.parentId) {
        topLevelParent = commentMap[topLevelParent.parentId];
      }

      if (topLevelParent) {
        topLevelParent.replies.push(commentMap[comment.id]);
      }
    } else {
      rootComments.push(commentMap[comment.id]);
    }
  });

  return rootComments;
};

export const findParentComment = (comments, parentId) => {
  for (const comment of comments) {
    if (comment.id === parentId) {
      return comment;
    }

    if (comment.replies?.length > 0) {
      const found = findParentComment(comment.replies, parentId);
      if (found) return found;
    }
  }
  return null;
};

export const updateNestedComment = (comments, commentId, newText) => {
  return comments.map((comment) => {
    if (comment.id === commentId) {
      return { ...comment, text: newText };
    }

    if (comment.replies?.length > 0) {
      const updatedReplies = updateNestedComment(
        comment.replies,
        commentId,
        newText
      );
      return { ...comment, replies: updatedReplies };
    }

    return comment;
  });
};

export const addReplyToNestedComment = (comments, parentId, newReply) => {
  return comments.map((comment) => {
    if (
      comment.id === parentId ||
      comment.replies.some((r) => r.id === parentId)
    ) {
      return {
        ...comment,
        replies: [...comment.replies, newReply],
      };
    }

    if (comment.replies.length > 0) {
      return {
        ...comment,
        replies: addReplyToNestedComment(comment.replies, parentId, newReply),
      };
    }

    return comment;
  });
};

export const deleteNestedComment = (comments, commentId) => {
  return comments
    .map((comment) => {
      if (comment.id === commentId) return null;

      if (comment.replies?.length > 0) {
        const updatedReplies = deleteNestedComment(comment.replies, commentId);
        return { ...comment, replies: updatedReplies };
      }

      return comment;
    })
    .filter(Boolean);
};
