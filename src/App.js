import React, { Component } from 'react';
import Person from './Person/Person';
import './App.css';

class App extends Component {
  state = {
    persons: [{ name: 'human', age: 42, year: 6354 }, 
      { name: 'unknown', age: 23, year: 734 },
      { name: 'loading', age: 462, year: 4332 }],
    visibility: true
  };

  toggleHandler = () => {
    this.setState({ visibility: !this.state.visibility });
  }

  render() {
    const persons = this.state.visibility 
      ? this.state.persons.map((p, i) => (<Person key={i} name={p.name} age={p.age} year={p.year} />))
      : null;

    return (
      <div className="App">
        <h1>Hello there!</h1>
        <button onClick={this.toggleHandler}>Toggle</button>
        <p></p>
        { persons }
      </div>
    );
  }
}

export default App;
