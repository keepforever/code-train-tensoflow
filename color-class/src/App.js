import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import AlphaTensorflow from "./components/AlphaTensorflow";
import ThetaD3Barchart from "./components/ThetaD3Barchart";

import RaisedButton from "material-ui/RaisedButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";


class App extends Component {
  state = {
    tensorData: [],
    shouldTrain: false
  };

  passDataUp = data => {
    console.log("data", data);

    const intData = data.map(d => {
      return parseFloat(d)
    })
    //to sum array of nums
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const denominator = intData.reduce(reducer)
    // newTensorData is normalized
    const newTensorData = intData.map(d => {
      return (d/denominator)
    })
    //console.log(newTensorData.reduce(reducer))
    this.setState({
      tensorData: newTensorData
    });
  };

  trainModelButtonHandler = () => {
    this.setState({
      shouldTrain: !this.state.shouldTrain
    });
    // so as to only train once.
    setTimeout(() => {
      console.log('timeout')
      this.stopTraining();
    }, 3000 )

  };
  // helper func to only train once
  stopTraining = () => {
    this.setState({
      shouldTrain: false
    });
  };

  render() {
    const { shouldTrain, tensorData } = this.state
    // console.log('APP.JS, shouldTrain', shouldTrain)
    // console.log('APP.JS, tensorData', tensorData)
    return (
      <MuiThemeProvider>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome To Tensoflow</h1>
          </header>
          <div>
            <RaisedButton
              label={"TRAIN CLASSIFIER"}
              style={{
                color: "blue",
                marginTop: 25,
                width: 300,
                height: 100
              }}
              secondary={false}
              onClick={this.trainModelButtonHandler}
            />
            <ThetaD3Barchart
              tensorData={tensorData} />
            {/* <DeeThree /> */}
            <AlphaTensorflow
               shouldTrain={shouldTrain}
               tensorData={this.passDataUp}
               data={this.state.tensorData}
             />
            {/* <Alpha_Tensorflow  tensorData={this.passDataUp}/> */}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
