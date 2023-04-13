'use strict'
/** @param {import('fastify').FastifyInstance} fastify */
module.exports = async function (fastify, opts) {
  fastify.setNotFoundHandler(async (request, reply) => {
    reply.code(404)
    return "I'm sorry, I couldn't find what you were looking for."
  })
}
module.exports[Symbol.for('skip-override')] = true
