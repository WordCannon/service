const promBundle = require("express-prom-bundle");
const express = require('express');
const delay = require('delay');
const words = Object.keys(require("./words.json"));
var weighted = require('weighted')

const metricsMiddleware = promBundle(
  { 
    includeMethod: true, 
    buckets: [0.001, 0.005, 0.010, 0.020, 0.030, 0.050, 0.100, 0.200, 0.500, 1.000] 
  }
);

const PORT = 8080;
const HOST = '0.0.0.0';

var options = [1,   5,    10,  20,  30,   50,   100,  200,  500,  1000]
  , weights = [.30, .23, .16, .10, .06,  .05,   .04,  .03,  .02,  .01 ]

const getWord = async () => {
  var latency = Math.floor(weighted.select(options, weights) * ((Math.random() * (1.5 - 0.5) + 0.5).toFixed(2)));
  console.log(`Waiting ${latency} ms`);
  await delay(latency);
  const randIndex = Math.floor(words.length * Math.random());
  return words[randIndex];
}

const app = express();

app.use(metricsMiddleware);

app.get('/word', async (req, res) => {
  const word = await getWord();
  res.send(`${word}\n`);
});

app.listen(PORT, HOST);
console.log(`Firing cannon on http://${HOST}:${PORT}`);
