console.log("WordCannon server starting up...");

const express = require('express');
const fetch = require("node-fetch");

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();

function forwardTraceHeaders(req) {
	incoming_headers = [
		'x-request-id',
		'x-b3-traceid',
		'x-b3-spanid',
		'x-b3-parentspanid',
		'x-b3-sampled',
		'x-b3-flags',
		'x-ot-span-context',
		'x-dev-user',
		'fail'
	]
	const headers = {}
	for (let h of incoming_headers) {
		if (req.header(h))
			headers[h] = req.header(h)
    }

	return headers
}

app.get('/word', async (req, res) => {

  console.log("About to call dictionary...");

  const headers = forwardTraceHeaders(req);
  var response = await fetch("http://dictionary:8080/dictionary", {
    headers: headers
  });
  var word = await response.text();

  console.log("Got response: " + word);

  console.log("About to call fancy...");

  response = await fetch("http://fancy:8080/fancy/" + word, {
    headers: headers
  });
  word = await response.text();

  console.log("Got response: " + word);

  console.log("About to call punctuation...");

  response = await fetch("http://punctuation:8080/punctuation/" + word, {
    headers: headers
  });
  word = await response.text();

  console.log("Got response: " + word);

  console.log("About to send response...");

  res.status(200).send(`${word}\n`);
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

