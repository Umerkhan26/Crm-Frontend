// sagas/settingsSaga.js
import { put, takeLatest, call } from "redux-saga/effects";
import * as api from "../api/settingsApi";
import * as actions from "../actions/settingsActions";

function* fetchSettings() {
  try {
    yield put(actions.fetchSettingsRequest());
    const settings = yield call(api.fetchSettings);
    yield put(actions.fetchSettingsSuccess(settings));
  } catch (error) {
    yield put(actions.fetchSettingsFailure(error.message));
  }
}

function* saveSettings(action) {
  try {
    yield put(actions.fetchSettingsRequest());
    const savedSettings = yield call(api.saveSettings, action.payload);
    yield put(actions.fetchSettingsSuccess(savedSettings));
  } catch (error) {
    yield put(actions.fetchSettingsFailure(error.message));
  }
}

export function* watchSettings() {
  yield takeLatest("FETCH_SETTINGS", fetchSettings);
  yield takeLatest("SAVE_SETTINGS", saveSettings);
}
