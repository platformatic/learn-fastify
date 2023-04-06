import fastify from 'fastify'

const opts = {
  logger: true
}

// We want to use pino-pretty only if there is a human watching this,
// otherwise we log as newline-delimited JSON.
if (process.stdout.isTTY) {
  opts.logger = { transport: { target: 'pino-pretty' } }
}

const app = fastify(opts)

app.get('/', async (request, reply) => {
  return { hello: 'world' }
})

app.listen({ port: 3000, host: '0.0.0.0' })
