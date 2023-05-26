/*
    Including all the paths, when the request where to landed and possible to perform all the operations
*/

const userRoutes = require('./user');

async function loadAllRoutes(fastify, options) {
  fastify.register(userRoutes);
}

module.exports = loadAllRoutes;