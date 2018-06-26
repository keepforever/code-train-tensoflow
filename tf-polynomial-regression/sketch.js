// Use tensorflow.js to solve y = ax^2 + bx + c
// need loss function, optimizer from tf
// need a predict function that takes in xs
// then uses them to generate ys* to crunch loss function.
// "training" = minimize the loss function with the optimizer
// adjusting a,b,c.

// Initialize data holding arrays, not yet tensors
let x_vals = [];
let y_vals = [];

let a,b,c;

const learningRate = 0.05;
// we can swap out optimizers: adam, sgd, ect.
const optimizer = tf.train.adam(learningRate);

function setup() {
  createCanvas(400, 400);
  // Initialize m with random num betweeen 0 and 1
  // wrap in tf.variable because they must be able to
  // change over time.
  a = tf.variable(tf.scalar(random(-1, 1))); // random between -1 & 1
  b = tf.variable(tf.scalar(random(-1, 1))); // random between -1 & 1
  c = tf.variable(tf.scalar(random(-1, 1))); // random between -1 & 1
}

function loss(pred, labels) {
  return pred.sub(labels).square().mean();
}

function predict(x_array) {
  // x comes in as plain array, need to convert to a tensor
  const xs = tf.tensor1d(x_array);
  // y = mx + b;
  const ys = xs.square().mul(a).add(xs.mul(b)).add(c);
  return ys;
}

function mousePressed() {
  //normalize x & y to be betweeen zero and 1
  let x = map(mouseX, 0, width, -1, 1);
  let y = map(mouseY, 0, height, 1, -1);
  x_vals.push(x);
  y_vals.push(y);
}

function draw() {
  // optimizer must have tensors as input
  // minimize(f,returnCost?, varList?); here, we didn't provide
  // varList, only f (the arrow func), so it defaults to minimize
  // all trainable tensor vars declaired in the file.

  tf.tidy(() => {
    if (x_vals.length > 0) {
      const ys = tf.tensor1d(y_vals);
      optimizer.minimize(() => loss(predict(x_vals), ys));
    }
  });

  background(0);

  stroke(255);
  strokeWeight(8);
  for (let i = 0; i < x_vals.length; i++) {
    let px = map(x_vals[i], -1, 1, 0, width);
    let py = map(y_vals[i], -1, 1, height, 0);
    point(px, py);
  }

  // need two x values to put into predict(), which yeilds 2 y values
  // (x1,y1) and (x2,y2); (0, predict(0)) and (1, predict(1)).
  // with these two points, we can draw our fit line
  let curveX = [];
  // seed curveX with values between our bounds at 0.05 increments.
  for (let x = -1; x < 1.01; x+= 0.05) {
    curveX.push(x)
  }

  const ys = tf.tidy(() => predict(curveX));
  // dataSync() is not a best practice, data.then is probably better.
  // Ok for this very simple example tho cuz low compute power needed.
  let curveY = ys.dataSync();
  ys.dispose();
  // p5 stuff for drawing fitted curve
  beginShape();
  noFill();
  stroke(255)
  strokeWeight(3)
  for (let i = 0; i < curveX.length; i++) {
    let x = map(curveX[i], -1, 1, 0, width)
    let y = map(curveY[i], -1, 1, height, 0)
    vertex(x,y) // each angular point of a polygon
  }
  endShape()
  // log number of tensors in memory to console
  //console.log(tf.memory().numTensors);

  // noLoop shuts off p5 drawings.
  // noLoop();
}
