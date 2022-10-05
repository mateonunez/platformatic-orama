'use strict'

const quotes = [
  // generate 100 random quotes
  ...Array.from({ length: 1000 }, () => ({
    quote: Math.random().toString(36).substring(7),
    author: "mateonunez",
  }))
]

module.exports = async function ({ entities, db, sql }) {
  for (const values of quotes) {
    const quotes = await entities.quote.save({ input: { quote: values.quote, author: values.author } })
    console.log('Created quotes:', quotes)
  }
}
