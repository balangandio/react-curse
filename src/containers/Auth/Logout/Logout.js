import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../../store/actions/index';

const Logout = props => {

    useEffect(() => {
        props.onLogout();
    }, [props.onLogout]);

    return <Redirect to="/" />;
};

const dispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actions.logout())
    };
};

export default connect(undefined, dispatchToProps)(Logout);