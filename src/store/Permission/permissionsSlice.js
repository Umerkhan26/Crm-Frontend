import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  permissions: [],
  lastUpdated: null,
};

const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    setPermissions: (state, action) => {
      // Ensure permissions is an array to prevent invalid data
      state.permissions = Array.isArray(action.payload) ? action.payload : [];
      state.lastUpdated = Date.now();
    },
    clearPermissions: (state) => {
      state.permissions = [];
      state.lastUpdated = null;
    },
  },
});

export const { setPermissions, clearPermissions } = permissionsSlice.actions;
export default permissionsSlice.reducer;
