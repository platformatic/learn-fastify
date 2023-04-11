import fastify from 'fastify'

const app = fastify({ logger: true })

app.decorateRequest('answer', 42)

app.register(async function publicContext (app) {
  app.decorateRequest('foo')
  app.get('/one', myRoute)
  app.addHook('onRequest', async (request) => {
    request.foo = 'foo'
  })
  app.register(grandChildContext)
})

async function grandChildContext (app) {
  app.decorateRequest('bar')
  app.addHook('onRequest', async (request) => {
    request.foo = 'foo1'
    request.bar = 'bar'
  })
  app.get('/two', myRoute)
}

grandChildContext[Symbol.for('skip-override')] = true

async function myRoute (request, response) {
  return { answer: request.answer, foo: request.foo, bar: request.bar }
}

app.listen({ port: 3000 })
