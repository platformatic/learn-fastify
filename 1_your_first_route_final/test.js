import test from 'node:test'
import assert from 'node:assert'
import { build } from './app.js'

test('basic server', async (t) => {
  const app = await build()
  t.after(async () => {
    await app.close()
  })

  const response = await app.inject({
    method: 'GET',
    url: '/'
  })

  assert.strictEqual(response.statusCode, 200)
  assert.deepEqual(response.json(), { hello: 'world' })
})

test('handles errors', async (t) => {
  const app = await build()
  t.after(async () => {
    await app.close()
  })

  const response = await app.inject({
    method: 'GET',
    url: '/error'
  })

  assert.strictEqual(response.statusCode, 500)
  assert.deepEqual(response.body, "I'm sorry, there was an error processing your request.")
})

test('handles notfound', async (t) => {
  const app = await build()
  t.after(async () => {
    await app.close()
  })

  const response = await app.inject({
    method: 'GET',
    url: '/notfound'
  })

  assert.strictEqual(response.statusCode, 404)
  assert.deepEqual(response.body, "I'm sorry, I couldn't find what you were looking for.")
})
