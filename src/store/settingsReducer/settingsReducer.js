// reducers/settingsReducer.js

const initialState = {
  companyName: "Eraxon",
  aboutCompany: "",
  logo: null,
  logoDark: null,
  logoLight: null,
  logoDimensions: { height: 60, width: 206 },
  loginBgColor: "rgb(240, 232, 71)",
  navbarBgColor: "white",
  navbarTextColor: "#1573e8",
  contactEmail: "admin@timg.biz",
  loading: false,
  error: null,
};

export const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_SETTINGS_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_SETTINGS_SUCCESS":
      return { ...state, ...action.payload, loading: false };
    case "FETCH_SETTINGS_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_SETTINGS":
      return { ...state, ...action.payload };
    case "RESET_SETTINGS":
      return initialState;
    default:
      return state;
  }
};
