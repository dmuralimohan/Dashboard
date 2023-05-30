const fastifyCors = require('fastify-cors');
const fastifyJs = require('./plugins/fastify');
const fastify = fastifyJs.fastify;
const logger = fastifyJs.logger;

// const logDir = path.join(__dirname, 'logs');
// if(!fs.existsSync(logDir)){
//     fs.mkdirSync(logDir);
// }
// const logFilePath = path.join(logDir, 'app.log');
// const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// const fastify = require('fastify')({
//     logger: {
//         level: 'info',
//         stream: logStream,
//         serializers: {
//             res(reply) {
//                 return {
//                     status: reply.status,
//                     statusCode: reply.statusCode
//                 }
//             },
//             req(request) {
//                 return {
//                     method: request.method,
//                     url: request.url,
//                     path: request.routerPath,
//                     parameters: request.parameters,
//                     headers: request.headers
//                 };
//             },
//         },
//         dateFormat: () => new Date().toUTCString(),
//     },
// });

const port = process.env.PRODUCTION_PORT || 3001;

fastify.setErrorHandler((error, request, reply) => {
   logger.trace("Some Internal Error Occured in the Server\n"+ error);

    reply.status(500).send({
        error: "Internal Server Error",
        message: "Something went wrong"
    });
});

fastify.addHook('onSend', (request, reply, payload, done) => {
    logger.info("Request is processed "+ request.url);
    done();
});

fastify.addHook("onClose", (instance, done) => {
    logger.info("Server is now closed....");
    done();
});

//To disable cors
fastify.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: '*'
});

// fastify.register(require('./plugins/db'));
fastify.register(require('./routes'));

fastify.listen({
    port: port,
    host: 'localhost'
}).then((address) => {
    logger.info("Server is Started in "+ port +" Address:"+ address);
}).catch((err) => {
    if(err){
        logger.trace("Server is not Started, Somthing have Error\n"+ err);

        process.exit(1);
    }
});