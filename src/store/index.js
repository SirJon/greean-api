import { configureStore } from '@reduxjs/toolkit';

import authReducer from "./auth/authSlice";
import messageReducer from "./message/messageSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    message: messageReducer,
  },
});