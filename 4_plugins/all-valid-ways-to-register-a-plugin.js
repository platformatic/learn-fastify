import fastify from 'fastify'
import myPlugin from './plugin.js'

const app = fastify({ logger: true })

app.register(import('./plugin.js')) // root
app.register(myPlugin, { prefix: '/my-plugin' })
app.register(async function anotherPlugin (app) {
  app.get('/inline-plugin', async (request, reply) => {
    return { hello: 'world' }
  })
})

await app.listen({ port: 3000 })
