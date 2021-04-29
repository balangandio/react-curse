import { put } from 'redux-saga/effects';

import axios from '../../axios-orders';
import * as actions from '../actions';

export function* initIngredientsSaga() {
    try {
        yield axios.get('/posts');
        const ingredients =  { salad: 0, bacon: 0, cheese: 0, meat: 0 };

        yield put(actions.setIngredients(ingredients));
    } catch (error) {
        yield put(actions.fetchIngredientsFail());
    }
}