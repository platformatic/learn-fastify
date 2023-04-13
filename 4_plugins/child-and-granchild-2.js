import fastify from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'

const app = fastify({ logger: true })

app.register(swagger)
app.register(swaggerUI)

app.decorateRequest('answer', 42)

app.register(async function publicContext (app) {
  app.decorateRequest('foo')
  app.get('/one', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            answer: { type: 'number' },
            foo: { type: 'string' },
            bar: { type: 'string' }
          }
        }
      }
    }
  }, myRoute)
  app.addHook('onRequest', async (request) => {
    request.foo = 'foo'
  })
  app.register(grandChildContext)
  app.register(grandChildContext, {
    prefix: '/prefix'
  })
})

async function grandChildContext (app, opts) {
  app.decorateRequest('bar')
  app.addHook('onRequest', async (request) => {
    request.foo = 'foo1'
    request.bar = 'bar'
  })
  app.get('/two', myRoute)
}

async function myRoute (request, response) {
  return { answer: request.answer, foo: request.foo, bar: request.bar }
}

app.listen({ port: 3000 })
