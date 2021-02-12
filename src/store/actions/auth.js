import * as actionTypes from './actionsTypes';
import axios from '../../axios-orders';

const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

const authSuccess = ({token, userId}) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token,
        userId
    };
};

const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error
    };
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');

    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

const checkAuthTimeout = (expirationTimeMilli) => {
    return dispatch => {
        setTimeout(() => dispatch(logout()), expirationTimeMilli);
    };
};

export const auth = (email, pass, isSignup) => {
    return dispatch => {
        dispatch(authStart());

        setTimeout(() => {
            axios.get('/posts')
                .then(resp => ({ userId: email, token: '123asd', expirationTime: 3600 }))
                .then(authData => {
                    const expirationDate = new Date(new Date().getTime() + authData.expirationTime * 1000);
                    localStorage.setItem('token', authData.token);
                    localStorage.setItem('expirationDate', expirationDate);
                    localStorage.setItem('userId', authData.userId);

                    dispatch(authSuccess(authData));
                    dispatch(checkAuthTimeout(authData.expirationTime * 1000));
                })
                .catch(error => dispatch(authFail(error)));
        }, 2000);
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.AUTH_SET_PATH,
        path
    };
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');

        if (!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));

            if (expirationDate > new Date()) {
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId));
                dispatch(checkAuthTimeout(expirationDate.getTime() - new Date().getTime()));
            } else {
                dispatch(logout());
            }
        }
    };
};