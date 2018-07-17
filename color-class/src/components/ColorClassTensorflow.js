import React, { Component } from "react";
import { range as d3Range } from "d3";
import * as tf from "@tensorflow/tfjs";

import data from "../colorData.json";

class ColorClassTensorflow extends Component {

  render() {
    const updateData = data => {
      const { tensorData } = this.props;
      //console.log('updateData fired', data)
      tensorData(data);
    };

    const rgb = d3Range(3).map(v => {
      return (255 * Math.random()).toFixed(0)
    })

    console.log('rgb', rgb)

    const makePrediction = async (rgb) => {
      rgb.map(v => console.log('rgb', v))
      const novelInput = tf.tensor2d([
        [rgb[0], rgb[1], rgb[2]]
      ])

      let loadedModel = await tf.loadModel('localstorage://my-model-1');

      let results = loadedModel.predict(novelInput)
      console.log('results', results)
      results.print()

      let index = results.argMax(1)
      index.print()
      // index is a tensor, use .dataSync() to extract int
      let indexInt = await index.data()
      console.log(`
        Your Prediction is:
        ${labelList[indexInt]}

        `)

    };
    //console.log(this.props)
    //console.log(data)
    let model;
    let xs, ys;
    let lossP = [];
    let lossX = [];
    let lossY = [];
    let accY = [];


    let labelList = [
      "red-ish",
      "green-ish",
      "blue-ish",
      "orange-ish",
      "yellow-ish",
      "pink-ish",
      "purple-ish",
      "brown-ish",
      "grey-ish"
    ];

    let colors = [];
    let labels = [];
    for (let record of data.entries) {
      let col = [record.r / 255, record.g / 255, record.b / 255];
      colors.push(col);
      labels.push(labelList.indexOf(record.label));
    }

    xs = tf.tensor2d(colors);
    let labelsTensor = tf.tensor1d(labels, "int32");

    ys = tf.oneHot(labelsTensor, 9).cast("float32");
    labelsTensor.dispose();

    function buildModel() {
      let md = tf.sequential();
      const hidden = tf.layers.dense({
        units: 20,
        inputShape: [3],
        activation: "sigmoid"
      });

      const output = tf.layers.dense({
        units: 9,
        activation: "softmax"
      });
      md.add(hidden);
      md.add(output);

      const LEARNING_RATE = 0.25;
      const optimizer = tf.train.sgd(LEARNING_RATE);

      md.compile({
        optimizer: optimizer,
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"]
      });

      return md;
    }

    model = buildModel();

    async function train() {
      // This is leaking https://github.com/tensorflow/tfjs/issues/457
      await model.fit(xs, ys, {
        shuffle: true,
        validationSplit: 0.1,
        epochs: 10,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`${epoch} epoch ended`);
            // pass training data up component tree
            //updateData(logs.val_loss.toFixed(2));
            // console.log(logs.val_loss.toFixed(2))
            lossY.push(logs.val_loss.toFixed(2));
            accY.push(logs.val_acc.toFixed(2));
            lossX.push(epoch + 1);
            lossP.push("Loss: " + logs.loss.toFixed(5));
          },
          onBatchEnd: (batch, logs) => {
            return tf.nextFrame();
          },
          onTrainEnd: async () => {
            console.log("finished");
            updateData(lossY)
            const saveResult = await model.save('localstorage://my-model-1');
            console.log('saveResult', saveResult)
          }
        }
      });
    }

    const { shouldTrain, shouldPredict } = this.props
    if(shouldTrain) {
      console.log('training beginning...')
      train();
    }

    if(shouldPredict) {
      makePrediction([81,183,155])
    }

    return (

        <div >
          <h1>ColorClassTensorflow</h1>
          <div style={{
            height: 100,
            backgroundColor: `rgb(81,183,155 )`
          }}> <h2>green-ish</h2> </div>
          {/* <div style={{
            height: 100,
            backgroundColor: `rgb( ${rgb} )`
          }}>
            <h2>current color</h2>
          </div> */}
          {/* <div>
            {this.props.data.map((loss, index) => {
              return <h4 key={index}>lossY {index}: {loss}</h4>
            })}
          </div> */}
        </div>

    );
  }
}

export default ColorClassTensorflow;
