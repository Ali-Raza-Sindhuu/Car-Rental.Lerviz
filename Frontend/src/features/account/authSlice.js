import { createSlice } from "@reduxjs/toolkit";
import { loadPersistedAuth } from "./authStorage";

const authSlice = createSlice({
  name: "auth",
  initialState: () => loadPersistedAuth() ?? { user: null, token: null },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
