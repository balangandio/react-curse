import { useState } from 'react';

export default httpClient => {
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

    interceptors.reqId = httpClient.interceptors.request.use(req => {
        return interceptors.request(req);
    });
    interceptors.resId = httpClient.interceptors.response.use(res => res, err => {
        return interceptors.response(err);
    });

    const [error, setError] = useState(null);
    interceptors._fnSetError = setError;

    const cleanUpCallback = () => {
        httpClient.interceptors.request.eject(interceptors.reqId);
        httpClient.interceptors.response.eject(interceptors.resId);
    };

    return {
        cleanUpCallback,
        error,
        setError
    };
}