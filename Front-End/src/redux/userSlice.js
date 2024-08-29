import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  suggestUser: null,
  selectedUser: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setuserdetail: (state, action) => {
      state.user = action.payload;
    },
    setSuggestuser: (state, action) => {
      state.suggestUser = action.payload;
    },
    setSelecteduser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setuserdetail, setSuggestuser, setSelecteduser } =
  userSlice.actions;

export default userSlice.reducer;
