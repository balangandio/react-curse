import React, { Fragment, useContext } from 'react';
import Person from '../Person/Person';
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';
import AuthContext from '../../context/AuthContext';

const persons = (props) => {
    const authContext = useContext(AuthContext);

    return (
        <Fragment>
            {
                authContext.loggedIn
                    ? null
                    : <button onClick={authContext.login}>Login</button>
            }

            {props.list.map((p, i) => (
                <ErrorBoundary key={i}>
                    <Person name={p.name} age={p.age} year={p.year} />
                </ErrorBoundary>
            ))}
        </Fragment>
    );
};

export default React.memo(persons);