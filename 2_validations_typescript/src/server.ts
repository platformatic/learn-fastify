import { build, BuildOptions } from './app.js'
import closeWithGrace from 'close-with-grace'
import dotenv from 'dotenv'

dotenv.config()

const opts: BuildOptions = {
  logger: {
    level: 'info'
  }
}

// We want to use pino-pretty only if there is a human watching this,
// otherwise we log as newline-delimited JSON.
if (process.stdout.isTTY && typeof opts.logger === 'object') {
  opts.logger.transport = { target: 'pino-pretty' }
}

const port = Number(process.env.PORT || 3000)
const host = process.env.HOST || '127.0.0.1'

const app = await build(opts)
await app.listen({ port, host })

closeWithGrace(async ({ err }) => {
  if (err) {
    app.log.error({ err }, 'server closing due to error')
  } else {
    app.log.info('shutting down gracefully')
  }
  await app.close()
})
