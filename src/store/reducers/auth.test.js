import reducer from './auth';

describe('auth reducer', () => {
    it('deve retornar o estado inicial', () => {
        expect(reducer(undefined, {})).toEqual({
            token: null,
            userId: null,
            error: null,
            loading: false,
            authRedirectPath: '/'
        });
    });
});