const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, 'logs');
if(!fs.exitsSync(logDir)){
    fs.mkdirSync(logDir);
}

const fastify = require('fastify')({
    logger: {
        level: 'info',
        stream: fs.createWriteStream(path.join(logDir, 'app.log', {flags: 'a'})),
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
                }
            }
        }
    }
});

const port = process.env.PRODUCTION_PORT || 3001;

fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error("Some Internal Error Occured in the Server\n"+ error);

    reply.status(500).send({
        error: "Internal Server Error",
        message: "Something went wrong"
    });
});

fastify.register(require('./plugin/db'));
fastify.register(require('./routes'));


fastify.listen(port, (err) => {
    if(err){
        fastify.log.error("Server is not Started, Somthing have Error\n"+ err);

        process.exit(1);
    }

    fastify.log.info("Server is Started in "+ port);
})