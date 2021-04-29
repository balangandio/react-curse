import * as actionTypes from './actionsTypes';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = ({token, userId}) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token,
        userId
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error
    };
};

export const logout = () => {
    return {
        type: actionTypes.AUTH_INITIATE_LOGOUT
    };
};

export const logoutSucceed = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeout = (expirationTimeMilli) => {
    return {
        type: actionTypes.AUTH_CHECK_TIMEOUT,
        expirationTimeMilli
    };
};

export const auth = (email, pass, isSignup) => {
    return {
        type: actionTypes.AUTH_USER,
        email,
        pass,
        isSignup
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.AUTH_SET_PATH,
        path
    };
};

export const authCheckState = () => {
    return {
        type: actionTypes.AUTH_CHECK_STATE
    };
};