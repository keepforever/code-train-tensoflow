import React, { Component } from "react";


import * as tf from "@tensorflow/tfjs";

import data from "../colorData.json";

class AlphaTensorflow extends Component {

  render() {
    const updateData = data => {
      const { tensorData } = this.props;
      //console.log('updateData fired', data)
      tensorData(data);
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
    // put data into arrays to be
    //ultimatly made into tensors with tf

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

    //console.log(xs)

    function buildModel() {
      let md = tf.sequential();
      const hidden = tf.layers.dense({
        units: 15,
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
          onBatchEnd: async (batch, logs) => {
            await tf.nextFrame();
          },
          onTrainEnd: () => {
            console.log("finished");
            updateData(lossY)
          }
        }
      });
    }

    const { shouldTrain } = this.props
    if(shouldTrain) {
      console.log('training beginning...')
      train();
    }


    return (

        <div>
          <h1>AlphaTensorflow</h1>
          <div>
            {this.props.data.map((loss, index) => {
              return <h4 key={index}>lossY {index}: {loss}</h4>
            })}
          </div>
        </div>

    );
  }
}

export default AlphaTensorflow;
