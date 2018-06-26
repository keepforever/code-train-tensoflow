// Creates empty architecture.
const model = tf.sequential()


// config object for dense layers is REQUIRED.
const configHidden = {
  inputShape: [2],
  units: 4, //dimensionality of the output space; num nodes
  activation: 'sigmoid',
}
// create hidden layer
const hidden = tf.layers.dense(configHidden)
// add hidden layer
model.add(hidden)

// config object for dense layers is REQUIRED.
const configOutput = {
  units: 3, //dimensionality of the output space; num nodes
  // inputShape is inferred from previous layer
  activation: 'sigmoid',
}
// create output layer
const output = tf.layers.dense(configOutput)
// add output layer to model
model.add(output)

const optimizerLearningRate = 0.1
const sgdOpt = tf.train.sgd(optimizerLearningRate)

const compileConfig = {
  optimizer: sgdOpt, //alt, could specifiy a string
  loss: 'meanSquaredError' // alt, tf.losses.meanSquaredError
}

model.compile(compileConfig);

// manually hard code training data

const x_train = tf.tensor2d([
  [0.6,  0.72],
  [0.88, 0.69],
  [0.52, 0.31]
])

const y_train = tf.tensor2d([
  [0.11, 0.44, 0.56],
  [0.18, 0.66, 0.72],
  [0.09, 0.55, 0.67]
])
// history is an object that is returned with information on
// how the training is going. e.g. watch the loss decrease.
// could add a config object to be more specific like,
// model.fit(xs, ys, {epochs: 10, batchSize: 32, ...})
// model.fit() returns a Promise, thus we can call .then()
// const history = model.fit(x_train, y_train).then((res) => {
//   console.log(res.history)
// })

// If you want to wath the loss function over time in the console.
// however, you cannot just use 'await' all willy-nilly.  It's only
// valid on an async function. So, lets create that function.

async function train() {
  const numTrainings = 10
  // this for loop is excessive and I think that Tensorflow has
  // config options that can specify this behavior.
  for (let i = 0; i < numTrainings; i++) {
    // adding shuffle to config to help the fit be independ of order input
    const response = await model.fit(x_train, y_train, {
      shuffle: true,
      epochs: 10
    })
    console.log('HISTORY', response.history)
    // response.history.loss.forEach(loss => {
    //   console.log(loss)
    // })
    console.log(response.history.loss[0])
  }

}

// create some random inputs to run through the recently trained model.
// tensor2d corrisponds with inputShape: [2].
const xs = tf.tensor2d([
  [0.25, 0.92],
  [0.32, 0.21]
]) // values chosen arbitrairly

// Since train() is an async function, we can chain .then() to do something
// once it's done.
train().then(() => {
    console.log("Training Complete!")
    // call predict to see what output is...
    let ys = model.predict(xs)
    //print results
    ys.print()
});
