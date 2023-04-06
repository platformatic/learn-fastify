import { build } from './app.js'

const opts = {
  logger: {
    level: 'info'
  }
}

// We want to use pino-pretty only if there is a human watching this,
// otherwise we log as newline-delimited JSON.
if (process.stdout.isTTY) {
  opts.logger.transport = { target: 'pino-pretty' }
}

const app = await build(opts)
await app.listen({ port: 3000, host: '0.0.0.0' })
