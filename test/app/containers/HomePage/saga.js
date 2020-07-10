import { takeLatest, call, put } from 'redux-saga/effects'
import { DATA_LOADING } from './constants'
import { dataLoadingSuccess, dataError } from './actions';
import { Data } from "../../../docs/data";

function request() {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(Data)
      reject(new Error())
    }, 3000)
  })

  return promise.then((response) => response)
}

export function* addData() {
  try {
    const dataList = yield call(request);
    yield put(dataLoadingSuccess(dataList));
  } catch (error) {
    yield put(dataError(error));
  }
}

export default function* homePageSaga() {
  yield takeLatest(DATA_LOADING, addData);
}
