const express = require('express');
const words = Object.keys(require("./words.json"));
const metrics = require('./src/metrics');
const latency = require('./src/latency')

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();
app.use(metrics);

app.get('/word', async (req, res) => {

  var startTime = new Date().getTime();

  await latency.randomDelay();

  const randIndex = Math.floor(words.length * Math.random());
  var word = words[randIndex];

  var endTime = new Date().getTime();
  var execTime = endTime - startTime;

  console.log(`/word [${execTime} ms] ${word} `)
  res.send(`${word}\n`);
});

app.listen(PORT, HOST);
console.log(`Firing cannon on http://${HOST}:${PORT}`);

