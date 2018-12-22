console.log("WordCannon punctuation server starting up...");

const express = require('express');
const latency = require('../src/latency')
const fetch = require("node-fetch");

const punctuationOptions = [
  {before: "", after: "."},
  {before: "", after: "!"},
  {before: "", after: "?"},
  {before: "\"", after: "\""},
  {before: "'", after: "'"},
  {before: "¿", after: "?"},
  {before: "¡", after: "!"},
  {before: "", after: "..."},
]

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();

app.get('/punctuation/:word', async (req, res) => {

  var startTime = new Date().getTime();

  const randIndex = Math.floor(punctuationOptions.length * Math.random());
  var punctuation = punctuationOptions[randIndex];

  var factor = 1;
  if (punctuation.before) {
    factor = 3;
  }

  await latency.randomDelay(factor);

  var code = 200;

  var endTime = new Date().getTime();
  var execTime = endTime - startTime;

  const decoratedWord = `${punctuation.before}${req.params.word}${punctuation.after}`

  res.status(code).send(`${decoratedWord}\n`);
  console.log(`/punctuation ${code} [${execTime} ms] ${decoratedWord}`)
});

app.get('/healthz', function (req, res) {
  res.send('I am happy and healthy\n');
});

const server = app.listen(PORT, HOST);

// quit on ctrl-c when running docker in terminal
process.on('SIGINT', function onSigint () {
	console.info('Got SIGINT (aka ctrl-c in docker). Graceful shutdown ', new Date().toISOString());
  shutdown();
});

// quit properly on docker stop
process.on('SIGTERM', function onSigterm () {
  console.info('Got SIGTERM (docker container stop). Graceful shutdown ', new Date().toISOString());
  shutdown();
});

// shut down server
function shutdown() {
  server.close(function onServerClosed (err) {
    if (err) {
      console.error(err);
      process.exitCode = 1;
    }
		process.exit();
  })
}

console.log(`Firing punctuation cannon on http://${HOST}:${PORT}`);

