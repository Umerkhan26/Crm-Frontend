// // store/permissionSlice.js
// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   permissions: [],
//   loading: false,
//   error: null,
// };

// const permissionSlice = createSlice({
//   name: "permissions",
//   initialState,
//   reducers: {
//     setPermissions: (state, action) => {
//       state.permissions = action.payload;
//     },
//     setLoading: (state, action) => {
//       state.loading = action.payload;
//     },
//     setError: (state, action) => {
//       state.error = action.payload;
//     },
//     clearPermissions: (state) => {
//       state.permissions = [];
//     },
//   },
// });

// export const { setPermissions, setLoading, setError, clearPermissions } =
//   permissionSlice.actions;
// export default permissionSlice.reducer;
