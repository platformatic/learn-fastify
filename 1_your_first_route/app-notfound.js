import fastify from 'fastify'

export async function build (opts = {}) {
  const app = fastify(opts)

  app.get('/', async (request, reply) => {
    return { hello: 'world' }
  })

  app.get('/error', async (request, reply) => {
    throw new Error('kaboom')
  })

  app.get('/notfound', async (request, reply) => {
    reply.callNotFound()
  })

  app.setErrorHandler(async (err, request, reply) => {
    request.log.error({ err })
    reply.code(err.statusCode || 500)

    return "I'm sorry, there was an error processing your request."
  })

  app.setNotFoundHandler(async (request, reply) => {
    reply.code(404)
    return "I'm sorry, I couldn't find what you were looking for."
  })

  return app
}
