const express = require('express');
const words = Object.keys(require("./words.json"));

const PORT = 8080;
const HOST = '0.0.0.0';

const getWord = () => {
  const randIndex = Math.floor(words.length * Math.random());
  return words[randIndex];
}

const app = express();

app.get('/word', (req, res) => {
  res.send(`${getWord()}\n`);
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

