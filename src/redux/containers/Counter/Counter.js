import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actionTypes from '../../store/actions';
import CounterControl from '../../components/CounterControl/CounterControl';
import CounterOutput from '../../components/CounterOutput/CounterOutput';

class Counter extends Component {

    counterChangedHandler = ( action, value ) => {
        switch ( action ) {
            case 'inc':
                this.props.onIncrementCounter();
                break;
            case 'dec':
                this.props.onDecrementCounter();
                break;
            case 'add':
                this.props.onAddCounter(value);
                break;
            case 'sub':
                this.props.onSubtractCounter(value);
                break;
            default: 
                throw new Error('Invalid action');
        }
    }

    render () {
        return (
            <div>
                <CounterOutput value={this.props.counter} />
                <CounterControl label="Increment" clicked={() => this.counterChangedHandler( 'inc' )} />
                <CounterControl label="Decrement" clicked={() => this.counterChangedHandler( 'dec' )}  />
                <CounterControl label="Add 5" clicked={() => this.counterChangedHandler( 'add', 5 )}  />
                <CounterControl label="Subtract 5" clicked={() => this.counterChangedHandler( 'sub', 5 )}  />
                <hr/>
                <button onClick={() => this.props.onStoreResult(this.props.counter)}>Store Result</button>
                <ul>
                    {
                        this.props.storedResults.map((val, i) => (
                            <li key={i} onClick={() => this.props.onDeleteResult(i)}>{val}</li>
                        ))
                    }
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        counter: state.ctr.counter,
        storedResults: state.res.results
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onIncrementCounter: () => dispatch({ type: actionTypes.INCREMENT }),
        onDecrementCounter: () => dispatch({ type: actionTypes.DECREMENT }),
        onAddCounter: (val) => dispatch({ type: actionTypes.ADD, val }),
        onSubtractCounter: (val) => dispatch({ type: actionTypes.SUBTRACT, val }),
        onStoreResult: (val) => dispatch({ type: actionTypes.STORE_CURRENT, val }),
        onDeleteResult: (index) => dispatch({ type: actionTypes.DELETE, index })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);