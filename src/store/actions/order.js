import * as actionTypes from './actionsTypes';
import axios from '../../axios-orders';

export const purchaseBurguerSuccess = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_BURGUER_SUCCESS,
        orderId: id,
        orderData
    };
};

export const purchaseBurguerFail = (error) => {
    return {
        type: actionTypes.PURCHASE_BURGUER_FAIL,
        error
    };
};

export const purchaseBurguerStart = () => {
    return {
        type: actionTypes.PURCHASE_BURGUER_START
    };
};

export const purchaseBurguer = (orderData) => {
    return dispatch => {
        dispatch(purchaseBurguerStart());

        setTimeout(() => {
            axios.get('/posts')
                .then(resp => 'gretg5654hrh3gerg34fefreger')
                .then(orderId => dispatch(purchaseBurguerSuccess(orderId, orderData)))
                .catch(error => dispatch(purchaseBurguerFail(error)));
        }, 2000);
    };
};

export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT
    };
};

export const fetchOrdersSuccess = (orders) => {
    return {
        type: actionTypes.FETCH_ORDERS_SUCCESS,
        orders
    };
};

export const fetchOrdersFail = (error) => {
    return {
        type: actionTypes.FETCH_ORDERS_FAIL,
        error
    };
};

export const fetchOrdersStart = () => {
    return {
        type: actionTypes.FETCH_ORDERS_START
    };
};

export const fetchOrders = () => {
    return dispatch => {
        dispatch(fetchOrdersStart());
        
        setTimeout(() => {
            axios.get('/posts')
                .then(resp => {
                    return [
                        { id: 1, price: 23, ingredients: {bacon: 6, cheese: 2, meat: 0, salad: 2}, deliveryMethod: 'fastest' },
                        { id: 2, price: 42, ingredients: {bacon: 0, cheese: 2, meat: 0, salad: 2}, deliveryMethod: 'fastest' },
                        { id: 3, price: 1.42, ingredients: {bacon: 1, cheese: 4, meat: 0, salad: 2}, deliveryMethod: 'fastest' }
                    ];
                }).then(orders => dispatch(fetchOrdersSuccess(orders)))
                .catch(error => dispatch(fetchOrdersFail(error)));
        }, 2000);
    };
};