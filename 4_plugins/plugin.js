export default async function (app, opts) {
  app.get('/', async (request, reply) => {
    return { hello: 'world' }
  })
}
