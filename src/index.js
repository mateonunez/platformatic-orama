'use strict'

const Fastify = require('fastify')
const mapper = require('@platformatic/sql-mapper')
const FastifyLyra = require('@mateonunez/fastify-lyra')
const resolveSchema = require('./lib/schema.js')

const connectionString = 'sqlite://./quotes.sqlite'

async function main () {
  const app = Fastify({
    logger: {
      level: 'info'
    }
  })

  const conn = await mapper.connect({ connectionString })

  app.ready(async () => {
    const quotes = await conn.entities.quote?.find()
    if (quotes?.length > 0) {
      for (const quote of quotes) {
        if (quote.id) delete quote.id
        await app.lyra.insert(quote)
      }
    }
    console.log('Quotes migrated to Lyra')
  })

  app.register(FastifyLyra, { schema: resolveSchema(conn.entities) })
  app.register(mapper.plugin, { connectionString })

  app.get('/quotes/lyra/:author', async function (req, reply) {
    const { author } = req.params
    const search = await app.lyra.search({
      term: author,
      exact: true,
      limit: 1000
    })
    return { count: search.hits.length, quotes: search.hits }
  })

  app.get('/quotes/mapper/:author', async function (req, reply) {
    const { author } = req.params
    const res = await app.platformatic.entities.quote.find({
      where: {
        author: {
          eq: author
        }
      }
    })
    return { count: res.length, quotes: res }
  })

  await app.listen({ port: 3333 })
}

main()
