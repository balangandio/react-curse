import React, { Component } from 'react';
import Person from './Person/Person';
import './App.css';

class App extends Component {
  state = { name: 'human', age: 42, year: 2012 };

  clickHandler = () => {
    this.setState({ year: this.state.year + 1 });
  }

  render() {
    return (
      <div className="App">
        <h1>Hello there!</h1>
        <Person name={this.state.name} age={this.state.age} year={this.state.year} />
        <p></p>
        <button onClick={this.clickHandler}>New Year</button>
      </div>
    );
  }
}

export default App;
