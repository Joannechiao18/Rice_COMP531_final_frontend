import {
  configureStore,
  getDefaultMiddleware,
  combineReducers,
} from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postsReducer from "./reducer/postsReducer";
import followedUsersReducer from "./reducer/followedUsersReducer";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "posts", "followedUsers"],
};

export const rootReducer = combineReducers({
  auth: authReducer,
  posts: postsReducer,
  followedUsers: followedUsersReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware(),
});

export const persistor = persistStore(store);

export default store;
