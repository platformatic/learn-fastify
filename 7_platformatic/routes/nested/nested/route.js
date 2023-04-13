'use strict'

/** @param {import('fastify').FastifyInstance} fastify */
module.exports = async function (app, opts) {
  app.get('/', async (request, reply) => {
    return { hello: 'nested' }
  })
}
