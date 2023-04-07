import fastify, { FastifyServerOptions } from 'fastify'
import { Type, TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { LoggerOptions } from 'pino'

export interface BuildOptions extends FastifyServerOptions {
  logger?: LoggerOptions
}

export async function build (opts: BuildOptions = {}) {
  const app = fastify(opts).withTypeProvider<TypeBoxTypeProvider>()

  app.get('/', async () => {
    return { hello: 'world' }
  })

  app.get('/error', async () => {
    throw new Error('kaboom')
  })

  app.get('/notfound', async (_, reply) => {
    reply.callNotFound()
  })

  app.get('/search', {
    schema: {
      querystring: Type.Object({
        q: Type.Required(Type.String({ minLength: 3 }))
      })
    }
  }, async function (request) {
    return { q: request.query.q } 
  })

  const movie = Type.Object({
    title: Type.Required(Type.String()),
    year: Type.Required(Type.Number())
  })

  app.post('/movies', {
    schema: {
      body: movie,
      response: {
        200: movie
      }
    }
  }, async function (request) {
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

  app.setNotFoundHandler(async (_, reply) => {
    reply.code(404)
    return "I'm sorry, I couldn't find what you were looking for."
  })

  return app
}
