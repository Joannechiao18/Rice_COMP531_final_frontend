// authReducer.js
import { createReducer } from "@reduxjs/toolkit";
import { login, register, logout } from "../actions/authActions";

const initialState = {
  currentUser: null,
  isLoggedIn: false,
  //avatar: null,
};

const authReducer = createReducer(initialState, {
  [login]: (state, action) => {
    state.currentUser = action.payload;
    state.isLoggedIn = true;
    //state.avatar = action.payload.avatar;
  },
  [register]: (state, action) => {
    state.currentUser = action.payload;
    state.isLoggedIn = true;
    //state.avatar = action.payload.avatar;
  },
  [logout]: (state) => {
    localStorage.removeItem("persist:root");
    localStorage.removeItem("user");
    localStorage.removeItem("userHeadline");
    state.currentUser = null;
    state.isLoggedIn = false;
  },
});

export default authReducer;

export const selectUser = (state) => state.auth.currentUser;
export const selectAvatar = (state) => state.auth.avatar;
