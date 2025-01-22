import { configureStore } from "@reduxjs/toolkit";
import emailSlice from "./emailSlice.js";
import userSlice from "./userSlice.js";

const Store = configureStore({
  reducer: {
    email: emailSlice,
    user: userSlice,
  },
});

export default Store;
