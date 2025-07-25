// reducers/permissions/reducer.js
const initialState = {
  data: [], // This will store the actual permissions array
  loading: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "SET_PERMISSIONS":
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null,
      };
    case "CLEAR_PERMISSIONS":
      return initialState;
    default:
      return state;
  }
};
