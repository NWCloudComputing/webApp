const express = require('express');
const cors = require('cors');

// const statsD = require('node-statsd');

const routes = require('./routes/index');
// const logger = require('./logging');

const app = express();
// const metricCounter = new statsD();

app.use(cors());
app.use(express.json());


// app.get('/healthz', (req, res) => {
//     logger.info('Health Check Get Call');
//     metricCounter.increment('Get/healthz');
//     res.status(200).json();
// });

// app.get('/webhealthz', (req, res) => {
//     res.status(200).json();
// });

routes(app);
module.exports = app;