console.log("WordCannon server starting up...");

const { getWordsList } = require("most-common-words-by-language");
const express = require("express");
const metrics = require("./src/metrics");
const latency = require("./src/latency");

const LANGUAGE = process.env.LANGUAGE || "english";
const NUM_WORDS = process.env.NUM_WORDS || 10000;

const SHUTDOWN_GRACE_PERIOD =
  (process.env.SHUTDOWN_GRACE_PERIOD &&
    parseInt(process.env.SHUTDOWN_GRACE_PERIOD)) ||
  10;

const PORT = 8080;
const HOST = "0.0.0.0";

const app = express();
app.use(metrics);

var wrenchInGears = false;

const words = getWordsList(LANGUAGE, NUM_WORDS);

app.get("/word", async (req, res) => {
  var startTime = new Date().getTime();

  await latency.randomDelay();

  var word, code;
  if (process.env.FAILURE_RATE && process.env.FAILURE_RATE > Math.random()) {
    word = "Server error while retrieving word.";
    code = 500;
  } else {
    const randIndex = Math.floor(words.length * Math.random());
    var word = words[randIndex];
    var code = 200;
  }

  var endTime = new Date().getTime();
  var execTime = endTime - startTime;

  res.status(code).send(`${word}\n`);
  console.log(`/word ${code} [${execTime} ms] ${word}`);
});

function countVowels(str) {
  var m = str.match(/[aeiou]/gi);
  return m === null ? 0 : m.length;
}

app.get("/healthz", function(req, res) {
  res.send("I am happy and healthy\n");
});

const server = app.listen(PORT, HOST);

// quit on ctrl-c when running docker in terminal
process.on("SIGINT", function onSigint() {
  console.info(
    "Got SIGINT (aka ctrl-c in docker). Graceful shutdown ",
    new Date().toISOString()
  );
  shutdown();
});

// quit properly on docker stop
process.on("SIGTERM", function onSigterm() {
  console.info(
    "Got SIGTERM (docker container stop). Graceful shutdown ",
    new Date().toISOString()
  );
  shutdown();
});

let sockets = {},
  nextSocketId = 0;
server.on("connection", function(socket) {
  const socketId = nextSocketId++;
  sockets[socketId] = socket;
  const numSockets = Object.keys(sockets).length;
  // console.log(
  //   ">>> Creating socket: " + socketId + " | " + numSockets + " sockets total"
  // );

  socket.once("close", function() {
    delete sockets[socketId];
    const numSockets = Object.keys(sockets).length;
    // console.log(
    //   "<<< Deleting socket: " + socketId + " | " + numSockets + " sockets total"
    // );
  });
});

// shut down server
function shutdown() {
  waitForSocketsToClose(SHUTDOWN_GRACE_PERIOD);
  server.close(function onServerClosed(err) {
    console.log("+++ Got server close event");
    if (err) {
      console.error(err);
      process.exitCode = 1;
    }
    console.log("exiting in shutdown() with code " + process.exitCode);
    process.exit();
  });
}

function waitForSocketsToClose(counter) {
  if (counter > 0) {
    console.log(
      `Waiting ${counter} more ${
        counter === 1 ? "seconds" : "second"
      } for all connections to close...`
    );
    return setTimeout(waitForSocketsToClose, 1000, counter - 1);
  }

  console.log("Forcing all connections to close now");
  for (var socketId in sockets) {
    sockets[socketId].destroy();
    const numSockets = Object.keys(sockets).length;
    console.log("!!! Destroying socket: " + socketId);
  }
}

console.log(
  `Firing cannon on http://${HOST}:${PORT} (Failure threshold: ${process.env.FAILURE_RATE})`
);
