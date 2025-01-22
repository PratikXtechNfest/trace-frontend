import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Start with null to differentiate between no user and initial loading
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload; // Store the full user object
    },
    removeUser: (state) => {
      state.user = null; // Set back to null on logout
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
