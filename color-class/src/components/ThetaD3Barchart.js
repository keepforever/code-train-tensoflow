import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";
import BarChart from "./BarChart";
import { range as d3Range } from "d3";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

class ThetaD3Barchart extends React.Component {
  state = {
    data: d3Range(34).map(Math.random),
    currentIndex: null
  };

  addData = () =>
    this.setState({
      data: [...this.state.data, Math.random()]
    });

  setCurrentIndex = currentIndex =>
    this.setState({
      currentIndex
    });

  render() {
    const { data, currentIndex } = this.state;
    const { tensorData } = this.props

    //console.log('data \n', data)

    const smile = (<span role="image"> 🧐 </span>)

    return (
      <MuiThemeProvider>
        <div style={styles}>
          <p>Click the button <span role="image"> 👇 </span></p>
          <h1>D3 charts in React 16.3 {"\u2728"}</h1>
          <RaisedButton
            label={"The Button"}
            secondary={true}
            onClick={this.addData}
          />
          <p>
            {tensorData.length} datapoints
            <br />
            <small>{currentIndex !== null ? tensorData[currentIndex] : smile}</small>
          </p>
          <svg width="100%" height="500">
            <BarChart
              data={tensorData}
              width={700}
              height={500}
              x={0}
              y={0}
              highlightBar={this.setCurrentIndex}
              highlightedBar={currentIndex}
            />
          </svg>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default ThetaD3Barchart
