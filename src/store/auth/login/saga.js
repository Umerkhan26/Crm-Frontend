// import { takeEvery, fork, put, all, call } from "redux-saga/effects";

// // Login Redux States
// import { CHECK_LOGIN, LOGOUT_USER } from "./actionTypes";
// import { apiError, loginUserSuccessful, logoutUserSuccess } from "./actions";

// // AUTH related methods
// import { postLogin } from "../../../helpers/fackBackend_Helper";
// import { getFirebaseBackend } from "../../../helpers/firebase_helper";

// //Initilize firebase
// const fireBaseBackend = getFirebaseBackend();

// //If user is login then dispatch redux action's are directly from here.
// function* loginUser({ payload: { user, history } }) {
//   try {
//     if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
//       const response = yield call(
//         fireBaseBackend.loginUser,
//         user.username,
//         user.password
//       );
//       yield put(loginUserSuccessful(response));
//     } else {
//       const response = yield call(postLogin, "/post-login", {
//         username: user.username,
//         password: user.password,
//       });
//       localStorage.setItem("authUser", JSON.stringify(response));
//       yield put(loginUserSuccessful(response));
//     }
//     history("/dashboard");
//   } catch (error) {
//     yield put(apiError(error));
//   }
// }

// function* logoutUser({ payload: { history } }) {
//   try {
//     localStorage.removeItem("authUser");

//     if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
//       const response = yield call(fireBaseBackend.logout);
//       yield put(logoutUserSuccess(response));
//     }

//     history("/login");
//   } catch (error) {
//     yield put(apiError(error));
//   }
// }

// export function* watchUserLogin() {
//   yield takeEvery(CHECK_LOGIN, loginUser);
// }

// export function* watchUserLogout() {
//   yield takeEvery(LOGOUT_USER, logoutUser);
// }

// function* loginSaga() {
//   yield all([fork(watchUserLogin), fork(watchUserLogout)]);
// }

// export default loginSaga;
import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import { CHECK_LOGIN, LOGOUT_USER } from "./actionTypes";
import { loginUserSuccessful, apiError, logoutUserSuccess } from "./actions";
import { postLogin } from "../../../helpers/fackBackend_Helper";

function* loginUser({ payload: { user, history } }) {
  try {
    const response = yield call(postLogin, "/login", {
      email: user.email,
      password: user.password,
    });
    console.log("Full API Response:", response);

    if (!response || !response.user || !response.token) {
      throw new Error("Invalid login response");
    }

    const permissions = response.user.role?.Permissions || [];
    console.log("Extracted Permissions:", permissions);

    // Clear localStorage before setting new values
    localStorage.removeItem("authUser");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("rolePermissions");

    // Set new values
    localStorage.setItem("authUser", JSON.stringify(response.user));
    localStorage.setItem("token", response.token);
    localStorage.setItem("userId", response.user.id);
    localStorage.setItem("rolePermissions", JSON.stringify(permissions));

    yield put(
      loginUserSuccessful({
        user: response.user,
        token: response.token,
        permissions: permissions,
      })
    );

    history("/dashboard");
  } catch (error) {
    console.error("Login Error:", error);
    yield put(apiError(error.message || "Login failed"));
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("rolePermissions");
    yield put(logoutUserSuccess());
    history("/login");
  } catch (error) {
    yield put(apiError(error.message));
  }
}

export function* watchUserLogin() {
  yield takeEvery(CHECK_LOGIN, loginUser);
}

export function* watchUserLogout() {
  yield takeEvery(LOGOUT_USER, logoutUser);
}

function* loginSaga() {
  yield all([fork(watchUserLogin), fork(watchUserLogout)]);
}

export default loginSaga;
