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

  app.get('/search', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          q: { type: 'string' }
        },
        required: ['q']
      }
    }
  }, async function (request, reply) {
    return { q: request.query.q } 
  })

app.addSchema({
  $id: 'https://platformatic.dev/schemas/movie',
  type: 'object',
  properties: {
    title: { type: 'string' },
    year: { type: 'number' }
  },
  required: ['title', 'year']
})

app.post('/movies', {
  schema: {
    body: {
      $ref: 'https://platformatic.dev/schemas/movie'
    },
    response: {
      200: {
        $ref: 'https://platformatic.dev/schemas/movie'
      }
    }
  }
}, async function (request, reply) {
  return { title: request.body.title, year: request.body.year, foo: 'bar' }
})

  app.setErrorHandler(async (err, request, reply) => {
    if (err.validation) {
      reply.code(403)
      return err.message
    }
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
