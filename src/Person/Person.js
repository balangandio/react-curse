import React, { useState } from 'react';

const person = (props) => {
    const [state, setState] = useState({ age: props.age });

    return (
        <div>
            Name: {props.name} of {props.year} - Age: {state.age} - <button onClick={() => setState({ age: state.age - 1 })}>-</button>
        </div>
    );
};

export default person;