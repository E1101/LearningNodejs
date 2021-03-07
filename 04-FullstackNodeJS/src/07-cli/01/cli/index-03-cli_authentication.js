#!/usr/bin/env node
const yargs = require('yargs')
const Table = require('cli-table')
const ApiClient = require('./api-client')

// This works just fine, but unfortunately it's bad practice to force users to
// specify credentials on the command line. There are few reasons for this,
// but the two main security issues are that:
//
// While this command is running, the credentials will be visible in the process
// list (e.g. with ps -aux or similar command) on the user's machine.
//
// These credentials will be written to the user's shell history file
// (e.g. ~/.bash_history or similar) in plaintext.

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
  .command('view product <id>', 'View a product', {}, viewProduct)
  // we use <id> as a positional option. We do this so that it can be used
  // `like edit product cjv32mizj000oc9gl65ehcoj7`, where `cjv32mizj000oc9gl65ehcoj7`
  // is the id of the product we want to edit.
  .command(
    'edit product <id>',
    'Edit a product',
    {
      // key and value are required to specify how we'll actually change the product
      key: {
        alias: 'k',
        required: true,
        describe: 'Product key to edit'
      },
      value: {
        alias: 'v',
        required: true,
        describe: 'New value for product key'
      },
      // username and password are required because this is a protected route
      username: {
        alias: 'u',
        required: true,
        describe: 'Login username'
      },
      password: {
        alias: 'p',
        required: true,
        describe: 'Login password'
      }
    },
    editProduct
  )
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
  const { id, endpoint } = opts
  const api = ApiClient({ endpoint })
  const product = await api.getProduct(id)

  const cols = process.stdout.columns - 10
  const table = new Table({
    colWidths: [15, cols - 15]
  })
  Object.keys(product).forEach(k =>
    table.push({ [k]: JSON.stringify(product[k]) })
  )

  console.log(table.toString())
}

async function editProduct (opts) {
  const { id, key, value, endpoint, username, password } = opts
  const change = { [key]: value }

  const api = ApiClient({ username, password, endpoint })
  await api.editProduct(id, change)

  // In fact, because the options required for editProduct() are a
  // superset of viewProduct(), after the product is edited, we can
  // run viewProduct() directly to take advantage of the output we've
  // already created.
  viewProduct({ id, endpoint })
}
