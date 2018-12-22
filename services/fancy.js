console.log("WordCannon fancy server starting up...");

const express = require('express');
const latency = require('../src/latency')
const fetch = require("node-fetch");

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();

function fancify(word) {
    word.replace(/e/g, "è");
    word.replace(/s/g, "§");
    word.replace(/l/g, "£");
    word.replace(/u/g, "µ");
    word.replace(/p/g, "¶");
    word.replace(/e/g, "è");
    word.replace(/c/g, "Ç");
    word.replace(/d/g, "Ð");
    word.replace(/a/g, "å");
    word.replace(/n/g, "ñ");
    word.replace(/e/g, "è");
    return word;
}

app.get('/fancy/:word', async (req, res) => {

    var startTime = new Date().getTime();

    const randIndex = Math.floor(5 * Math.random());
    var responseWord;
    var code = 200;
    const inputWord = req.params.word;

    if (randIndex > 0) {
        await latency.randomDelay(0.25);
        responseWord = inputWord;
    } else {
        await latency.randomDelay(2);
        responseWord = fancify(inputWord);
    }

    var endTime = new Date().getTime();
    var execTime = endTime - startTime;

    res.status(code).send(`${responseWord}\n`);
    console.log(`/fancy ${code} [${execTime} ms] ${responseWord}`)
});

app.get('/healthz', function (req, res) {
    res.send('I am happy and healthy\n');
});

const server = app.listen(PORT, HOST);

// quit on ctrl-c when running docker in terminal
process.on('SIGINT', function onSigint() {
    console.info('Got SIGINT (aka ctrl-c in docker). Graceful shutdown ', new Date().toISOString());
    shutdown();
});

// quit properly on docker stop
process.on('SIGTERM', function onSigterm() {
    console.info('Got SIGTERM (docker container stop). Graceful shutdown ', new Date().toISOString());
    shutdown();
});

// shut down server
function shutdown() {
    server.close(function onServerClosed(err) {
        if (err) {
            console.error(err);
            process.exitCode = 1;
        }
        process.exit();
    })
}

console.log(`Firing punctuation cannon on http://${HOST}:${PORT}`);

