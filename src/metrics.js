const promBundle = require("express-prom-bundle");

const metricsMiddleware = promBundle(
    {
        includeMethod: true,
        includePath: true,
        buckets: [0.050, 0.100, 0.150, 0.200, 0.250, 0.300, 0.350, 0.400, 0.450, 0.500]
    }
);


module.exports = metricsMiddleware;