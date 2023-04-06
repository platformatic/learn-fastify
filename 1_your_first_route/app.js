import fastify from 'fastify'

export async function build (opts = {}) {
  const app = fastify(opts)

  app.get('/', async (request, reply) => {
    return { hello: 'world' }
  })
  return app
}
