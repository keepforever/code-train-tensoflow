import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Alpha from './components/Alpha';

import DeeThree from './components/D3/DeeThree'; // not working

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome To Tensoflow</h1>
        </header>
        <div>
          <DeeThree />
          {/* <Alpha  /> */}
        </div>
      </div>
    );
  }
}

export default App;
