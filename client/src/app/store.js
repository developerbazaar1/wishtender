import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/authSlice";
import followedSlice from "../features/fetchFollowedSlice";
import storage from "redux-persist/lib/storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import cartSlice from "../features/cartSlice";

const persistConfig = {
  key: "wishtender",
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice,
  followed: followedSlice,
  cart: cartSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
