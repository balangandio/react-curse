import React from 'react';

const authContext = React.createContext({
    loggedIn: false,
    login: () => {}
});

export default authContext;