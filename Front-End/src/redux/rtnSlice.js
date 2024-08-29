import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  likenotification: [],
};

export const rtnSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setLikeNotification: (state, action) => {
      if (action.payload.type === "like") {
        state.likenotification.push(action.payload);
        console.log(action.payload);
      } else if (action.payload.type === "dislike") {
        state.likenotification = state.likenotification.filter(
          (item) => item.userId !== action.payload.userId
        );
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLikeNotification } = rtnSlice.actions;

export default rtnSlice.reducer;
