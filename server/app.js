const fs = require('fs');
const path = require('path');
const fastifyCors = require('fastify-cors');

const logDir = path.join(__dirname, 'logs');
if(!fs.existsSync(logDir)){
    fs.mkdirSync(logDir);
}
const logFilePath = path.join(logDir, 'app.log');
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

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
        dateFormat: () => new Date().toUTCString(),
    },
});

const port = process.env.PRODUCTION_PORT || 3001;

fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error("Some Internal Error Occured in the Server\n"+ error);

    reply.status(500).send({
        error: "Internal Server Error",
        message: "Something went wrong"
    });
});

//To disable cors
fastify.register(fastifyCors);

// fastify.register(require('./plugins/db'));
fastify.register(require('./routes'));

fastify.listen({
    port: port,
    host: 'localhost'
}).then((address) => {
    fastify.log.info("Server is Started in "+ port +" Address:"+ address);
    console.log("Server is started");
}).catch((err) => {
    if(err){
        fastify.log.error("Server is not Started, Somthing have Error\n"+ err);

        process.exit(1);
    }
});