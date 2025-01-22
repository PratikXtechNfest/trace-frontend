import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: null,
};

const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    addEmail: (state, action) => {
      state.email = action.payload;
    },

    removeEmail: (state) => {
      state.email = null;
    },
  },
});

export const { addEmail, removeEmail } = emailSlice.actions;

export default emailSlice.reducer;
