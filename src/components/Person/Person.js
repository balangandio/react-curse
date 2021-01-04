import React, { useState, useContext, Fragment } from 'react';
import AuthContext from '../../context/AuthContext';

const person = (props) => {
    const [state, setState] = useState({ age: props.age });

    const authContext = useContext(AuthContext);

    return (
        <Fragment>
            <div>
                Name: {props.name} of {props.year} - Age: {state.age}
                {
                    authContext.loggedIn
                        ? (<button disabled={!authContext.loggedIn} onClick={() => setState({ age: state.age - 1 })}>-</button>)
                        : null
                }
            </div>
        </Fragment>
    );
};

export default person;