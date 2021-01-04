import React, { Component } from 'react';
import Persons from '../components/Persons/Persons';
import ColoredTitle from '../components/ColoredTitle/ColoredTitle';
import AuthContext from '../context/AuthContext';
import './App.css';

class App extends Component {
  colors = ['black', 'blue', 'red', 'green'];

  state = {
    persons: [{ name: 'human', age: 42, year: 6354 }, 
      { name: 'unknown', age: 23, year: 734 },
      { name: 'loading', age: 462, year: 4332 }],
    visibility: true,
    loggedIn: false
  };

  loginHandler = () => {
    this.setState({ loggedIn: true });
  }

  toggleHandler = () => {
    this.setState({ visibility: !this.state.visibility });
  }

  changeTitleColorHandler = (event, color) => {
    this.setState({ color });
  }

  render() {
    return (
      <div className="App">
        <AuthContext.Provider value={{loggedIn: this.state.loggedIn, login: this.loginHandler}}>
          <ColoredTitle
            color={this.state.color}
            colors={this.colors}
            colorChange={(e, color) => this.setState({ color })}>Hello there!</ColoredTitle>
            
          <button onClick={this.toggleHandler}>Toggle</button>
          <p></p>
          { this.state.visibility ? (<Persons list={this.state.persons} />) : null }
        </AuthContext.Provider>
      </div>
    );
  }
}

export default App;
