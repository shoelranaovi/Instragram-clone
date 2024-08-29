import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onlineUser: null,
  messages: [],
};

export const chatSlice = createSlice({
  name: "onlineUser",
  initialState,
  reducers: {
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },
    setMessage: (state, action) => {
      state.messages = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setOnlineUser, setMessage } = chatSlice.actions;

export default chatSlice.reducer;
