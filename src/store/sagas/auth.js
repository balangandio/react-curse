import { put, delay } from 'redux-saga/effects';

import axios from '../../axios-orders';
import * as actions from '../actions';

export function* logoutSaga() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    yield put(actions.logoutSucceed());
}

export function* checkoutAuthTimeoutSaga(action) {
    yield delay(action.expirationTimeMilli);
    yield put(actions.logout());
}

export function* authUserSaga({ email, pass, isSignup }) {
    yield put(actions.authStart());
    yield delay(2000);

    try {
        yield axios.get('/posts');

        const authData = { userId: email, token: '123asd', expirationTime: 3600 };

        const expirationDate = new Date(new Date().getTime() + authData.expirationTime * 1000);

        localStorage.setItem('token', authData.token);
        localStorage.setItem('expirationDate', expirationDate);
        localStorage.setItem('userId', authData.userId);

        yield put(actions.authSuccess(authData));
        yield put(actions.checkAuthTimeout(authData.expirationTime * 1000));
    
    } catch(error) {
        yield put(actions.authFail(error));
    }
}

export function* authCheckStateSaga() {
    const token = localStorage.getItem('token');

    if (!token) {
        yield put(actions.logout());
    } else {
        const expirationDate = new Date(localStorage.getItem('expirationDate'));

        if (expirationDate > new Date()) {
            const userId = localStorage.getItem('userId');
            yield put(actions.authSuccess(token, userId));
            yield put(actions.checkAuthTimeout(expirationDate.getTime() - new Date().getTime()));
        } else {
            yield put(actions.logout());
        }
    }
}