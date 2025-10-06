import { initializePermissions } from "../../../utils/permissions";
import {
  CHECK_LOGIN,
  LOGIN_USER_SUCCESSFUL,
  API_ERROR,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  REFRESH_PERMISSIONS,
  UPDATE_PERMISSIONS,
} from "./actionTypes";

const initialState = {
  loginError: null,
  message: null,
  loading: false,
  user: null,
  token: null,
  permissions: initializePermissions(),
  permissionVersion: 0,
  role: null,
  isAuthenticated: false,
  lastPermissionUpdate: null,
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
        permissions: action.payload.permissions || [],
        isAuthenticated: true,
        loginError: null,
        lastPermissionUpdate: Date.now(),
      };

    case REFRESH_PERMISSIONS:
      return {
        ...state,
        permissions: action.payload.permissions,
        lastPermissionUpdate: Date.now(),
      };

    case UPDATE_PERMISSIONS:
      return {
        ...state,
        permissions: action.payload,
        permissionVersion: state.permissionVersion + 1,
      };

    case LOGOUT_USER:
    case LOGOUT_USER_SUCCESS:
      return {
        ...initialState,
      };

    case "UPDATE_USER_SUCCESS":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
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
