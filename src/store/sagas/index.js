import { takeEvery } from 'redux-saga/effects';

import * as actionTypes from '../actions/actionsTypes';
import {
    logoutSaga,
    checkoutAuthTimeoutSaga,
    authUserSaga,
    authCheckStateSaga } from './auth';
import {
    initIngredientsSaga } from './burgerBuilder';
import {
    purchaseBurgerSaga,
    fetchOrdersSaga } from './order';


export function* watchAuth() {
    yield takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga);
    yield takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, checkoutAuthTimeoutSaga);
    yield takeEvery(actionTypes.AUTH_USER, authUserSaga);
    yield takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckStateSaga);
}

export function* watchBurger() {
    yield takeEvery(actionTypes.INIT_INGREDIENTS, initIngredientsSaga);
}
export function* watchOrder() {
    yield takeEvery(actionTypes.PURCHASE_BURGER, purchaseBurgerSaga);
    yield takeEvery(actionTypes.FETCH_ORDERS, fetchOrdersSaga);
}