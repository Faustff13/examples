/**
 * Login
 */

import { call, put, select, takeLatest } from 'redux-saga/effects';

import request from 'utils/request';

import {
  LOGIN,
  SESSION_BEGIN_SUCCESS,
  CHALLENGE_RESPOND,
  CHALLENGE_RESPOND_SUCCESS,
  SESSION_NOOP,
} from './constants';
import {
  sessionBeginSuccess,
  sessionBeginFailure,
  challengeSuccess,
  challengeFailure,
  challengeRespondFailure,
  challengeRespondSuccess,
  strongAuthenticationSuccess,
  strongAuthenticationFailure,
  sessionNoOpSuccess,
  sessionNoOpFailure,
} from './actions';
import {
  makeSelectChallengeId,
  makeSelectCode,
  makeSelectEmail,
  makeSelectPassword,
} from './selectors';

const requestURL = ``;

export function* checkSession() {
  try {
    yield call(request, requestURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      credentials: 'include',
      observe: 'response',
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'Session.NoOp',
      }),
    });

    yield put(sessionNoOpSuccess());
  } catch (err) {
    yield put(sessionNoOpFailure());
  }
}

/**
 * Login request/response handler
 */
function* login() {
  // Select form fields from store
  const email = yield select(makeSelectEmail());
  const password = yield select(makeSelectPassword());

  try {
    // Call our request helper (see 'utils/request')
    const Login = yield call(request, requestURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      credentials: 'include',
      observe: 'response',
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'Session.Begin',
        params: { email, password },
      }),
    });
    if (Login !== null && Login.error) {
      yield put(sessionBeginFailure(Login.error.message));
    } else {
      yield put(sessionBeginSuccess());
    }
  } catch (err) {
    yield put(sessionBeginFailure());
  }
}

function* challengeCreate() {
  try {
    const challenge = yield call(request, requestURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      credentials: 'include',
      observe: 'response',
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'Challenge.Create',
      }),
    });
    if (challenge.error) {
      yield put(challengeFailure(challenge.error.message));
    } else {
      yield put(challengeSuccess(challenge.result));
    }
  } catch (err) {
    yield put(challengeFailure(err));
  }
}

function* challengeRespond() {
  const challengeId = yield select(makeSelectChallengeId());
  const secret = yield select(makeSelectCode());

  try {
    const respond = yield call(request, requestURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      credentials: 'include',
      observe: 'response',
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'Challenge.Respond',
        params: {
          challenge_id: challengeId,
          secret,
        },
      }),
    });
    if (respond.error) {
      yield put(challengeRespondFailure(respond.error.message));
    } else {
      yield put(challengeRespondSuccess(respond.result));
    }
  } catch (err) {
    yield put(challengeRespondFailure(err));
  }
}

function* strongAuthentication() {
  const challengeId = yield select(makeSelectChallengeId());

  try {
    const authentication = yield call(request, requestURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      credentials: 'include',
      observe: 'response',
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'Session.StrongAuthenticationPassed',
        params: {
          challenge_id: challengeId,
        },
      }),
    });
    if (authentication.error) {
      yield put(strongAuthenticationFailure(authentication.error.message));
    } else {
      yield put(strongAuthenticationSuccess());
    }
  } catch (err) {
    yield put(strongAuthenticationFailure());
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* loginData() {
  // Watches for LOGIN actions and calls login when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(SESSION_NOOP, checkSession);
  yield takeLatest(LOGIN, login);
  yield takeLatest(SESSION_BEGIN_SUCCESS, challengeCreate);
  yield takeLatest(CHALLENGE_RESPOND, challengeRespond);
  yield takeLatest(CHALLENGE_RESPOND_SUCCESS, strongAuthentication);
}
