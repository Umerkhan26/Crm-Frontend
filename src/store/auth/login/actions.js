// // // import {
// // //   CHECK_LOGIN,
// // //   LOGIN_USER_SUCCESSFUL,
// // //   API_ERROR,
// // //   LOGOUT_USER,
// // //   LOGOUT_USER_SUCCESS,
// // // } from "./actionTypes";

// // // export const checkLogin = (user, history) => {
// // //   return {
// // //     type: CHECK_LOGIN,
// // //     payload: { user, history },
// // //   };
// // // };

// // // export const loginUserSuccessful = (user) => {
// // //   return {
// // //     type: LOGIN_USER_SUCCESSFUL,
// // //     payload: user,
// // //   };
// // // };

// // // export const apiError = (error) => {
// // //   return {
// // //     type: API_ERROR,
// // //     payload: error,
// // //   };
// // // };

// // // export const logoutUser = (history) => {
// // //   return {
// // //     type: LOGOUT_USER,
// // //     payload: { history },
// // //   };
// // // };

// // // export const logoutUserSuccess = () => {
// // //   return {
// // //     type: LOGOUT_USER_SUCCESS,
// // //     payload: {},
// // //   };
// // // };

// // import {
// //   CHECK_LOGIN,
// //   LOGIN_USER_SUCCESSFUL,
// //   API_ERROR,
// //   LOGOUT_USER,
// //   LOGOUT_USER_SUCCESS,
// // } from "./actionTypes";

// // export const checkLogin = (user, history) => ({
// //   type: CHECK_LOGIN,
// //   payload: { user, history },
// // });

// // export const loginUserSuccessful = (userData) => ({
// //   type: LOGIN_USER_SUCCESSFUL,
// //   payload: userData,
// // });

// // export const apiError = (error) => ({
// //   type: API_ERROR,
// //   payload: error,
// // });

// // export const logoutUser = (history) => ({
// //   type: LOGOUT_USER,
// //   payload: { history },
// // });

// // export const logoutUserSuccess = () => ({
// //   type: LOGOUT_USER_SUCCESS,
// // });

// import {
//   CHECK_LOGIN,
//   LOGIN_USER_SUCCESSFUL,
//   API_ERROR,
//   LOGOUT_USER,
//   LOGOUT_USER_SUCCESS,
// } from "./actionTypes";

// export const checkLogin = (user, history) => ({
//   type: CHECK_LOGIN,
//   payload: { user, history },
// });

// export const loginUserSuccessful = (userData) => ({
//   type: LOGIN_USER_SUCCESSFUL,
//   payload: userData,
// });

// export const apiError = (error) => ({
//   type: API_ERROR,
//   payload: error,
// });

// export const logoutUser = (history) => ({
//   type: LOGOUT_USER,
//   payload: { history },
// });

// export const logoutUserSuccess = () => ({
//   type: LOGOUT_USER_SUCCESS,
// });

import {
  CHECK_LOGIN,
  LOGIN_USER_SUCCESSFUL,
  API_ERROR,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
} from "./actionTypes";

export const checkLogin = (user, history) => ({
  type: CHECK_LOGIN,
  payload: { user, history },
});

export const loginUserSuccessful = (payload) => ({
  type: LOGIN_USER_SUCCESSFUL,
  payload: {
    user: payload.user,
    token: payload.token,
    role: payload.user.role,
    permissions: payload.permissions,
  },
});

export const apiError = (error) => ({
  type: API_ERROR,
  payload: error,
});

export const logoutUser = (history) => ({
  type: LOGOUT_USER,
  payload: { history },
});

export const logoutUserSuccess = () => ({
  type: LOGOUT_USER_SUCCESS,
});
