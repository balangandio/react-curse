import React, { Component } from 'react';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import counterReducer from './store/reducers/counter';
import resultReducer from './store/reducers/result';
import Counter from './containers/Counter/Counter';

const logger = store => {
  return next => {
    return action => {
      console.log(`--> dispatching [${action.type}]`);
      const result = next(action);
      console.log('--> next sore state: ', store.getState());
      return result;
    };
  };
};

const rootReducer = combineReducers({
  ctr: counterReducer,
  res: resultReducer
});

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(logger, thunk)));

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div style={{textAlign: 'center'}}>
        <Counter />
        </div>
      </Provider>
    );
  }
}

export default App;
