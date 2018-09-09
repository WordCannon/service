const promBundle = require("express-prom-bundle");
const express = require('express');
const delay = require('delay');
const words = Object.keys(require("./words.json"));
var weighted = require('weighted')

const metricsMiddleware = promBundle(
  { 
    includeMethod: true, 
    customLabels: {"version":"8"},
    buckets: [0.050, 0.100, 0.150, 0.200, 0.250, 0.300, 0.350, 0.400, 0.450, 0.500] 
  }
);

var increasing = true;

var maxLatency = 600;
var jitter = 0;
var baseLatency = (maxLatency / 2) * .75;

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();

app.use(metricsMiddleware);

// base + (base * )

app.get('/word', async (req, res) => {

  var bellFactor = 3;
  var bellcurveRandom = 0;
  for (var i = 0; i < bellFactor; i++) {
      bellcurveRandom += Math.random() * (maxLatency / bellFactor);
  }    
  bellcurveRandom += jitter;

  const latency = Math.floor(bellcurveRandom);

  await delay(latency);

  const randIndex = Math.floor(words.length * Math.random());
  var word = words[randIndex];

  console.log(`/word [${latency} ms] ${word} `)
  res.send(`${word}\n`);
});

app.listen(PORT, HOST);
console.log(`Firing cannon on http://${HOST}:${PORT}`);

setInterval(() => {

  const DIE_SIDES = 3;
  const roll = Math.ceil(Math.random() * DIE_SIDES); 
  if (roll < 3) {
    if (increasing && jitter < 52) {
      jitter += 10;
      console.log(`++++++++++++ ${jitter}`);
    } else if (!increasing && jitter > -52) {
      jitter -= 10;
      console.log(`--------------- ${jitter}`);
    }  
  } 
}, 10000)

setInterval(() => {
  const DIE_SIDES = 30;
  const roll = Math.ceil(Math.random() * DIE_SIDES); 
  if (roll === 1) {
    increasing = !increasing;   
    console.log(`>>>>>>>>>>>>>>> SWITCH <<<<<<<<<<<<<<<< increasing :" to ${increasing}`);
  } 
}, 60000)