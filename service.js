console.log("WordCannon server starting up...");

const { getWordsList } = require('most-common-words-by-language');
const express = require('express');
const metrics = require('./src/metrics');
const latency = require('./src/latency')

const VOWEL_TRIGGER_COUNT = parseInt(process.env.VOWEL_TRIGGER_COUNT) || 10;
const LANGUAGE = process.env.LANGUAGE || "english";
const NUM_WORDS = process.env.NUM_WORDS || 10000;

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();
app.use(metrics);

var wrenchInGears = false;

const words = getWordsList(LANGUAGE, NUM_WORDS); 

app.get('/word', async (req, res) => {

  var startTime = new Date().getTime();

  await latency.randomDelay();

  var word, code;
  if (wrenchInGears) {
    word = "???";
    code = 500;
  } else {
    const randIndex = Math.floor(words.length * Math.random());
    var word = words[randIndex];
    var code = 200;  
  }

  var endTime = new Date().getTime();
  var execTime = endTime - startTime;

  const vowels = countVowels(word);
  if (vowels === VOWEL_TRIGGER_COUNT) {
    wrenchInGears = true;
  }

  res.status(code).send(`${word}\n`);
  console.log(`/word ${code} [${execTime} ms] ${word} (${vowels} vowels)`)
});

function countVowels(str) {
  var m = str.match(/[aeiou]/gi);
  return m === null ? 0 : m.length;
}

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

console.log(`Firing cannon on http://${HOST}:${PORT} (Vowel trigger count ${VOWEL_TRIGGER_COUNT})`);

