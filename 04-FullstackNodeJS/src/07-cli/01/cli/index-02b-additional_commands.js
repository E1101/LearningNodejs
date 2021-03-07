#!/usr/bin/env node
const yargs = require('yargs')
const Table = require('cli-table')
const ApiClient = require('./api-client')

yargs
  .option('endpoint', {
    alias: 'e',
    default: 'http://localhost:1337',
    describe: 'The endpoint of the API'
  })
  .command(
    'list products',
    'Get a list of products',
    {
      tag: {
        alias: 't',
        describe: 'Filter results by tag'
      },
      limit: {
        alias: 'l',
        type: 'number',
        default: 25,
        describe: 'Limit the number of results'
      },
      offset: {
        alias: 'o',
        type: 'number',
        default: 0,
        describe: 'Skip number of results'
      }
    },
    listProducts
  )
   // (this_file.js) view product cjv32mizj000kc9gl2r2lgj1r
   // ---
   // we define a positional argument. By defining it as `view product <id>`,
   // we are telling yargs that this command must be invoked with an id argument.
  .command('view product <id>', 'View a product', {}, viewProduct)
  .help()
  .demandCommand(1, 'You need at least one command before moving on')
  .parse()

async function listProducts (opts) {
  const { tag, offset, limit, endpoint } = opts
  const api = ApiClient({ endpoint })
  const products = await api.listProducts({ tag, offset, limit })

  const cols = process.stdout.columns - 10
  const colsId = 30
  const colsProp = Math.floor((cols - colsId) / 3)
  const table = new Table({
    head: ['ID', 'Description', 'Tags', 'User'],
    colWidths: [colsId, colsProp, colsProp, colsProp]
  })

  products.forEach(p =>
    table.push([
      p._id,
      p.description.replace(/\n|\r/g, ' '),
      p.userName,
      p.tags.slice(0, 3).join(', ')
    ])
  )

  console.log(table.toString())
}

async function viewProduct (opts) {
  // our positional option, id, is available as a property of the opts argument.
  const { id, endpoint } = opts
  const api = ApiClient({ endpoint })
  const product = await api.getProduct(id)

  const cols = process.stdout.columns - 3
  const table = new Table({
    colWidths: [15, cols - 15]
  })
  Object.keys(product).forEach(k =>
    table.push({ [k]: JSON.stringify(product[k]) })
  )

  console.log(table.toString())
}
