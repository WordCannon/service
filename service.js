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

console.log(`Firing cannon on http://${HOST}:${PORT}`);

