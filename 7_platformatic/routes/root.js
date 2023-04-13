'use strict'
/** @param {import('fastify').FastifyInstance} fastify */
module.exports = async function (app, opts) {
  app.get('/', async (request, reply) => {
    return { hello: 'world' }
  })

  app.get('/error', async (request, reply) => {
    throw new Error('kaboom')
  })

  app.get('/notfound', async (request, reply) => {
    reply.callNotFound()
  })
}
