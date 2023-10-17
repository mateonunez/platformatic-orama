'use strict'

const Fastify = require('fastify')
const mapper = require('@platformatic/sql-mapper')
const FastifyOrama = require('fastify-orama')
const resolveSchema = require('./lib/schema.js')

const connectionString = 'sqlite://./quotes.sqlite'

async function main () {
  const app = Fastify({
    logger: {
      level: 'info'
    }
  })

  const conn = await mapper.connect({ connectionString, log: app.log })

  async function migrateQuotes () {
    const quotes = await conn.entities.quote?.find()
    if (quotes?.length > 0) {
      for (const quote of quotes) {
        if (quote.id) delete quote.id
        await app.orama.insert(quote)
      }
    }
    console.log('Quotes migrated to Orama')
  }

  app.ready(() => {
    migrateQuotes().catch(error => {
      console.error('Error migrating quotes:', error)
    })
  })

  app.register(FastifyOrama, { schema: resolveSchema(conn.entities) })
  app.register(mapper.plugin, { connectionString })

  app.get('/quotes/orama/:author', async function (req, reply) {
    const { author } = req.params
    const search = await app.orama.search({
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
