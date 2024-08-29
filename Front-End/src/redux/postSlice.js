import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: null,
  selectedpost: {},
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setallpost: (state, action) => {
      state.posts = action.payload;
    },
    setselectedpost: (state, action) => {
      state.selectedpost = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setallpost, setselectedpost } = postSlice.actions;

export default postSlice.reducer;
