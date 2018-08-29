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

app.listen(PORT, HOST);
console.log(`Firing cannon on http://${HOST}:${PORT}`);
