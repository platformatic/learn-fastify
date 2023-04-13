'use strict'
/** @param {import('fastify').FastifyInstance} fastify */
module.exports = async function (fastify, opts) {
  fastify.setErrorHandler(async (err, request, reply) => {
    request.log.error({ err })
    reply.code(err.statusCode || 500)

    return "I'm sorry, there was an error processing your request."
  })
}
module.exports[Symbol.for('skip-override')] = true
