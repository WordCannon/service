const delay = require("delay");
var weighted = require("weighted");

var increasing = true;

const minLatency =
  (process.env.MIN_LATENCY && parseInt(process.env.MIN_LATENCY)) || 100;

const maxLatency =
  (process.env.MAX_LATENCY && parseInt(process.env.MAX_LATENCY)) || 200;

const skew = (process.env.SKEW && parseInt(process.env.SKEW)) || 1;

var jitter = 0;
var baseLatency = (maxLatency / 2) * 0.75;

// https://stackoverflow.com/a/49434653/424187
function randomFromDistribution(min, max, skew) {
  var u = 0,
    v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
  num = Math.pow(num, skew); // Skew
  num *= max - min; // Stretch to fill range
  num += min; // offset to min
  return num;
}

const getLatency = function() {
  return randomFromDistribution(minLatency, maxLatency, skew);
};

const randomDelay = async function() {
  return await delay(getLatency());
};

// adjust jitter frequently
setInterval(() => {
  const DIE_SIDES = 3;
  const roll = Math.ceil(Math.random() * DIE_SIDES);
  if (roll < 3) {
    if (increasing && jitter < 52) {
      jitter += 10;
    } else if (!increasing && jitter > -52) {
      jitter -= 10;
    }
  }
}, 10000);

// change increasing/decreasing direction infrequently
setInterval(() => {
  const DIE_SIDES = 30;
  const roll = Math.ceil(Math.random() * DIE_SIDES);
  if (roll === 1) {
    increasing = !increasing;
  }
}, 10000);

module.exports = {
  randomDelay: randomDelay
};
