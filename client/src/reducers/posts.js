import { FETCH_ALL, CREATE, UPDATE, DELETE, LIKE, FETCH_BY_SEARCH, START_LOADING, END_LOADING, FETCH_POST, CREATE_COMMENT, DELETE_COMMENT, UPDATE_COMMENT, LIKE_COMMENT } from '../constants/actionTypes';

export default (state = { isLoading: true, posts: [] }, action) => {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: true };
    case END_LOADING:
      return { ...state, isLoading: false };
    case FETCH_ALL:
      return {
        ...state,
        posts: action.payload.posts,
        currentPage: action.payload.currentPage,
        numberOfPages: action.payload.numberOfPages,
      }
    case FETCH_BY_SEARCH:
      return {
        ...state,
        posts: action.payload.posts,
      }
    case FETCH_POST:
      return {
        ...state,
        post: action.payload,
        comments: action.payload.comments,
      }
    case LIKE:
      return { ...state, posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post)) };
    case CREATE:
      return { ...state, posts: [...state.posts, action.payload] };
    case UPDATE:
      return { ...state, posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post)) };
    case DELETE:
      return { ...state, posts: state.posts.filter((post) => post._id !== action.payload) };
    case CREATE_COMMENT:
      return { 
        ...state, 
        post: action.payload,
        comments: action.payload.comments 
      };
    case DELETE_COMMENT:
      return {
        ...state,
        comments: state.comments.filter((c) => c._id !== action.payload),
      };
    case UPDATE_COMMENT:
      return {
        ...state,
        comments: state.comments.map((comment) => (comment._id === action.payload._id ? action.payload : comment)),
      };
    case LIKE_COMMENT:
      return { ...state, comments: state.comments.map((c) => (c._id === action.payload._id ? action.payload : c)) };
    default: 
      return state;
  }
};

