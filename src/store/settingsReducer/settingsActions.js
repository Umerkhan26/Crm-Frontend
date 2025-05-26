// store/actions/settingsActions.js

// Action types
export const FETCH_SETTINGS_REQUEST = "FETCH_SETTINGS_REQUEST";
export const FETCH_SETTINGS_SUCCESS = "FETCH_SETTINGS_SUCCESS";
export const FETCH_SETTINGS_FAILURE = "FETCH_SETTINGS_FAILURE";
export const UPDATE_SETTINGS = "UPDATE_SETTINGS";
export const RESET_SETTINGS = "RESET_SETTINGS";

// Action creators
export const fetchSettingsRequest = () => ({ type: FETCH_SETTINGS_REQUEST });

export const fetchSettingsSuccess = (settings) => ({
  type: FETCH_SETTINGS_SUCCESS,
  payload: settings,
});

export const fetchSettingsFailure = (error) => ({
  type: FETCH_SETTINGS_FAILURE,
  payload: error,
});

export const updateSettings = (settings) => ({
  type: UPDATE_SETTINGS,
  payload: settings,
});

export const resetSettings = () => ({ type: RESET_SETTINGS });

// Simulated save action
export const saveSettings = (formData) => {
  return async (dispatch) => {
    dispatch(fetchSettingsRequest());
    try {
      // Extract values manually since we're simulating the backend
      const simulatedSettings = {
        companyName: formData.get("companyName"),
        aboutCompany: formData.get("aboutCompany"),
        logo: formData.get("logo")
          ? URL.createObjectURL(formData.get("logo"))
          : null,
        logoDark: formData.get("logoDark")
          ? URL.createObjectURL(formData.get("logoDark"))
          : null,
        logoLight: formData.get("logoLight")
          ? URL.createObjectURL(formData.get("logoLight"))
          : null,
        logoDimensions: {
          height: parseInt(formData.get("logoHeight")) || 60,
          width: parseInt(formData.get("logoWidth")) || 206,
        },
        loginBgColor: formData.get("loginBgColor"),
        navbarBgColor: formData.get("navbarBgColor"),
        navbarTextColor: formData.get("navbarTextColor"),
        contactEmail: formData.get("contactEmail"),
      };

      dispatch(fetchSettingsSuccess(simulatedSettings));
    } catch (error) {
      dispatch(fetchSettingsFailure(error.message));
    }
  };
};

// Simulated load action
export const loadSettings = () => {
  return async (dispatch) => {
    dispatch(fetchSettingsRequest());
    try {
      const defaultSettings = {
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
      };

      dispatch(fetchSettingsSuccess(defaultSettings));
    } catch (error) {
      dispatch(fetchSettingsFailure(error.message));
    }
  };
};
