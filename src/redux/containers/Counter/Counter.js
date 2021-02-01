import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/index';
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
        onIncrementCounter: () => dispatch(actions.increment()),
        onDecrementCounter: () => dispatch(actions.decrement()),
        onAddCounter: (val) => dispatch(actions.add(val)),
        onSubtractCounter: (val) => dispatch(actions.subtract(val)),
        onStoreResult: (val) => dispatch(actions.storeResult(val)),
        onDeleteResult: (index) => dispatch(actions.deleteResult(index))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);