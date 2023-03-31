const { createLogger, format, transports } = require("winston");

const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
};

const logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    levels: logLevels,
   // transports: [new transports.File({ filename: '/home/ec2-user/script/webapp.log' })],
   transports: [new transports.File({ filename: 'webapp.log' })],
});

module.exports = logger;
