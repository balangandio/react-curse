import { combineReducers } from 'redux';

import burgerBuilderReducer from './burgerBuilder';
import orderReducer from './order';
import authReducer from './auth';

export default combineReducers({
    burger: burgerBuilderReducer,
    order: orderReducer,
    auth: authReducer
});