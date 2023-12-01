// postsReducer.js or in your slice

import {
  ADD_POST,
  SET_POSTS,
  UPDATE_POST,
  ADD_COMMENT,
  SET_COMMENTS,
  RESET_COMMENTS,
} from "../actions/postsActions";

const initialState = {
  posts: [],
  comments: {},
};

const postsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      };
    case SET_POSTS:
      return {
        ...state,
        posts: action.payload,
      };

    case UPDATE_POST:
      const updatedPosts = state.posts.map((post) =>
        post.customId === action.payload.customId ? action.payload : post
      );
      return {
        ...state,
        posts: updatedPosts,
      };

    case SET_COMMENTS:
      const { articleId: idForSet, comments: updatedComments } = action.payload;

      const updatedComment = state.comments[idForSet].map((comment) =>
        comment.customId === updatedComments.comments.customId
          ? updatedComments.comments
          : comment
      );

      return {
        ...state,
        comments: {
          ...state.comments,
          [idForSet]: updatedComments.comments,
        },
      };

    case ADD_COMMENT:
      const { articleId: idForAddComment, comment: newComment } =
        action.payload;
      const existingCommentsForAdd = Array.isArray(
        state.comments[idForAddComment]
      )
        ? state.comments[idForAddComment]
        : [];
      return {
        ...state,
        comments: {
          ...state.comments,
          [idForAddComment]: [...existingCommentsForAdd, newComment],
        },
      };

    case RESET_COMMENTS:
      return {
        ...state,
        comments: [], // Reset comments to an empty array
      };
    default:
      return state;
  }
};

//export const selectPosts = (state) => state.posts.posts;
export const selectPosts = (state) => state.posts.posts;
export const selectComments = (state, articleId) => {
  const commentsByArticle = state.posts.comments[articleId];
  return commentsByArticle || []; // Return an empty array if no comments are found
};
//export const selectComments = (state) => state.posts.comments;
export default postsReducer;
