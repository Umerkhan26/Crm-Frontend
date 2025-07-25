// // import {
// //   CHECK_LOGIN,
// //   LOGIN_USER_SUCCESSFUL,
// //   API_ERROR,
// //   LOGOUT_USER,
// //   LOGOUT_USER_SUCCESS,
// // } from "./actionTypes";

// // const initialState = {
// //   loginError: "aaa",
// //   message: null,
// //   loading: false,
// // };

// // const login = (state = initialState, action) => {
// //   switch (action.type) {
// //     case CHECK_LOGIN:
// //       state = {
// //         ...state,
// //         loading: true,
// //       };
// //       break;
// //     case LOGIN_USER_SUCCESSFUL:
// //       state = {
// //         ...state,
// //         loading: false,
// //       };
// //       break;

// //     case LOGOUT_USER:
// //       state = { ...state };
// //       break;

// //     case LOGOUT_USER_SUCCESS:
// //       state = { ...state };
// //       break;

// //     case API_ERROR:
// //       state = {
// //         ...state,
// //         loading: false,
// //         loginError: action.payload,
// //       };
// //       break;

// //     default:
// //       state = { ...state };
// //       break;
// //   }
// //   return state;
// // };

// // export default login;

// import { CHECK_LOGIN, LOGIN_USER_SUCCESSFUL, API_ERROR, LOGOUT_USER, LOGOUT_USER_SUCCESS } from "./actionTypes";

// const initialState = {
//   loginError: null,
//   message: null,
//   loading: false,
//   user: null,
//   permissions: [],
// };

// const login = (state = initialState, action) => {
//   switch (action.type) {
//     case CHECK_LOGIN:
//       return {
//         ...state,
//         loading: true,
//         loginError: null,
//       };
//     case LOGIN_USER_SUCCESSFUL:
//       console.log("Login Successful - User:", action.payload.user);
//       console.log("Login Successful - Permissions:", action.payload.user?.role?.Permissions || []);
//       return {
//         ...state,
//         loading: false,
//         user: action.payload.user,
//         permissions: action.payload.user?.role?.Permissions || [],
//         loginError: null,
//       };
//     case LOGOUT_USER:
//       return {
//         ...state,
//         user: null,
//         permissions: [],
//       };
//     case LOGOUT_USER_SUCCESS:
//       return {
//         ...state,
//         user: null,
//         permissions: [],
//       };
//     case API_ERROR:
//       return {
//         ...state,
//         loading: false,
//         loginError: action.payload,
//       };
//     default:
//       return state;
//   }
// };

// export default login;
import {
  CHECK_LOGIN,
  LOGIN_USER_SUCCESSFUL,
  API_ERROR,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
} from "./actionTypes";

const initialState = {
  loginError: null,
  message: null,
  loading: false,
  user: null,
  token: null,
  permissions: [],
  role: null,
  isAuthenticated: false,
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case CHECK_LOGIN:
      return {
        ...state,
        loading: true,
        loginError: null,
      };

    case LOGIN_USER_SUCCESSFUL:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        role: action.payload.user.role,
        permissions: action.payload.permissions || [], // Ensure permissions are always an array
        isAuthenticated: true,
        loginError: null,
      };

    case LOGOUT_USER:
    case LOGOUT_USER_SUCCESS:
      return {
        ...initialState,
      };

    case API_ERROR:
      return {
        ...state,
        loading: false,
        loginError: action.payload,
        isAuthenticated: false,
      };

    default:
      return state;
  }
};

export default login;
