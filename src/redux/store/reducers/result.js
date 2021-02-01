import * as actionTypes from '../actions/actionTypes';

const initialState = {
    results: []
};

const resultReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.STORE_RESULT:
            return { ...state, results: state.results.concat([action.val]) };
        case actionTypes.DELETE_RESULT:
            return { ...state, results: state.results.filter((r, i) => i !== action.index) }
        default:
            return state;
    }
};

export default resultReducer;