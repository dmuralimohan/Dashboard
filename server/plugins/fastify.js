/*
    Configuring fastify credentials and logger writter
*/

const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
if(!fs.existsSync(logDir)){
    fs.mkdirSync(logDir);
}
const logFilePath = path.join(logDir, 'app.log');
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

const logTracer = (log) => {
    console.error(log);
    console.trace(log);
}

const fastify = require('fastify')({
    logger: {
        level: 'info',
        stream: logStream,
        serializers: {
            res(reply) {
                return {
                    status: reply.status,
                    statusCode: reply.statusCode
                }
            },
            req(request) {
                return {
                    method: request.method,
                    url: request.url,
                    path: request.routerPath,
                    parameters: request.parameters,
                    headers: request.headers
                };
            },
        },
        logTracer
    },
});

const logger = {
    info : (log) => {
        fastify.log.info(log);
    },
    error : (log) => {
        fastify.log.error(log);
    },
    trace : (log) => {
        fastify.log.trace(log);
    }
}

module.exports = {
    fastify,
    logger
}