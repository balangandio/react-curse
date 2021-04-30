import { useCallback, useReducer } from 'react';

const initialState = {
    error: null,
    loading: false,
    extra: null,
    identifier: null
};

const httpReducer = (current, action) => {
    switch(action.type) {
        case 'SEND':
            return { ...current, loading: true, error: null, data: null, extra: null, identifier: action.identifier };
        case 'RESPONSE':
            return { ...current, loading: false, data: action.responseData, extra: action.extra };
        case 'ERROR':
            return { ...current, loading: false, error: action.error };
        case 'CLEAR':
            return { ...initialState };
      default:
        throw new Error('Should not get threre!')
    }
};

const useHttp = () => {
    const [ loadState, dispatch ] = useReducer(httpReducer, initialState);

    const clear = useCallback(() => {
        dispatch({ type: 'CLEAR' });
    }, []);

    const sendRequest = useCallback(async (url, options={}) => {
        dispatch({ type: 'SEND', identifier: options.reqIdentifier });

        try {
            if (options.method === 'POST' || options.method === 'PUT') {
                options.headers = {
                    'Content-type': 'application/json',
                    ...options.headers
                };
            }
            const response = await fetch(url, options);

            let data = [];

            if (response.status !== 500) {
                data = await response.json();
            }
            
            dispatch({ type: 'RESPONSE', responseData: data, extra: options.reqExtra });
        } catch(err) {
            dispatch({ type: 'ERROR', error: err.message });
        }
    }, []);

    return {
        isLoading: loadState.loading,
        data: loadState.data, 
        error: loadState.error,
        sendRequest,
        extra: loadState.extra,
        identifier: loadState.identifier,
        clear
    };
};

export default useHttp;