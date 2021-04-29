import { put } from "redux-saga/effects";

import axios from "../../axios-orders";
import * as actions from "../actions";

export function* purchaseBurgerSaga({ orderData, token }) {
    yield put(actions.purchaseBurguerStart());

    try {
        yield axios.get('/posts?token=' + token);

        const orderId = 'gretg5654hrh3gerg34fefreger';

        yield put(actions.purchaseBurguerSuccess(orderId, orderData));
    } catch (error) {
        yield put(actions.purchaseBurguerFail(error));
    }
}

export function* fetchOrdersSaga({ token, userId }) {
    yield put(actions.fetchOrdersStart());

    try {
        yield axios.get(`/posts?token=${token}&userId=${userId}`);

        const orders = [
            { id: 1, price: 23, ingredients: {bacon: 6, cheese: 2, meat: 0, salad: 2}, deliveryMethod: 'fastest' },
            { id: 2, price: 42, ingredients: {bacon: 0, cheese: 2, meat: 0, salad: 2}, deliveryMethod: 'fastest' },
            { id: 3, price: 1.42, ingredients: {bacon: 1, cheese: 4, meat: 0, salad: 2}, deliveryMethod: 'fastest' }
        ];

        yield put(actions.fetchOrdersSuccess(orders));
    } catch (error) {
        yield put(actions.fetchOrdersFail(error));
    }
}
