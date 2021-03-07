const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, '../products.json')

module.exports = {
  list
}

async function list (opts = {}) {
  const { offset = 0, limit = 25, tag } = opts

  const data = await fs.readFile(productsFile)
  return JSON.parse(data)
    // By adding a filter() before our slice() we restrict the response to a single tag.
    .filter((p, i) => !tag || p.tags.indexOf(tag) >= 0)
    .slice(offset, offset + limit)
}