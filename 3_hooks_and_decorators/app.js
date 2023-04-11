import fastify from 'fastify'

export async function build (opts = {}) {
  const app = fastify(opts)

  app.addHook('onRoute', function (routeOptions) {
    if (routeOptions.config?.logMe) {
      if (!Array.isArray(routeOptions.onRequest)) {
        if (routeOptions.onRequest) {
          routeOptions.onRequest = [routeOptions.onRequest]
        } else {
          routeOptions.onRequest = []
        }
      }
      routeOptions.onRequest.push(logMeHook)
    }
  })

  async function logMeHook (request, reply) {
    request.log.info({ route: request.routerPath }, 'logMe hook')
  }

  // should log
  app.get('/', { config: { logMe: true } }, async (request, reply) => {
    return { hello: 'world' }
  })

  // should not log
  app.get('/error', async (request, reply) => {
    throw new Error('kaboom')
  })

  app.get('/logMe', {
    onRequest: logMeHook
  }, async (request, reply) => {
    return { hello: 'world' }
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
