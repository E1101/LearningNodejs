#!/usr/bin/env node
const yargs = require('yargs')
// Require chalk (for colors) and prompts (for question prompts)
const chalk = require('chalk')
const Table = require('cli-table')
const prompts = require('prompts')
const ApiClient = require('./api-client')

// After the command is invoked, our CLI asks the user for their username and password.
// Once the CLI receives the credentials, they're used to make the authenticated request
// to edit the product. Because the user is providing the credentials directly to the
// application, they are not leaked to the process list or into a shell history file.

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
  .command(
    'edit product <id>',
    'Edit a product',
    {
      key: {
        alias: 'k',
        required: true,
        describe: 'Product key to edit'
      },
      value: {
        alias: 'v',
        required: true,
        describe: 'New value for product key'
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
  const { id, key, value, endpoint } = opts
  const change = { [key]: value }

  // prompts is an async function that accepts an array of question objects.
  // For our purposes, each object should have name, message, and type
  // properties. prompts will return with an object containing the
  // responses to each question.
  const { username, password } = await prompts([
    {
      name: 'username',
      message: chalk.gray('What is your username?'),
      type: 'text'
    },
    {
      name: 'password',
      message: chalk.gray('What is your password?'),
      // we set the type to password which will convert typed characters to `*`
      type: 'password'
    }
  ])

  const api = ApiClient({ username, password, endpoint })
  await api.editProduct(id, change)

  viewProduct({ id, endpoint })
}
