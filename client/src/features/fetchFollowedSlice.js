import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  followed: [],
};

const followedSlice = createSlice({
  name: "followed",
  initialState,
  reducers: {
    setFollowed: (state, action) => {
      state.followed = action.payload.followed;
    },
  },
});

export const { setFollowed } = followedSlice.actions;

export default followedSlice.reducer;
