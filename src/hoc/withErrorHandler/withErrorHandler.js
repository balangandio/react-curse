import React, { useState, useEffect } from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from "../Auxiliar/Auxiliar";

const withErrorHandler = (WrappedComponent, axios) => {

    const interceptors = {
        _fnSetError: () => {},
        reqId: null,
        request(req) {
            this._fnSetError(null);
            return req;
        },
        resId: null,
        response(err) {
            this._fnSetError(err);
            return Promise.reject(err);
        }
    };

    interceptors.reqId = axios.interceptors.request.use(req => {
        return interceptors.request(req);
    });
    interceptors.resId = axios.interceptors.response.use(res => res, err => {
        return interceptors.response(err);
    });

    return props => {
        const [error, setError] = useState(null);
        interceptors._fnSetError = setError;

        const cleanUpCallback = () => {
            axios.interceptors.request.eject(interceptors.reqId);
            axios.interceptors.response.eject(interceptors.resId);
        };

        useEffect(() => cleanUpCallback, []);

        return (
            <Aux>
                <Modal show={error} modalClosed={() => setError(null)}>
                    {error ? error.message : null}
                </Modal>
                <WrappedComponent {...props} />
            </Aux>
        );
    }
};

export default withErrorHandler;