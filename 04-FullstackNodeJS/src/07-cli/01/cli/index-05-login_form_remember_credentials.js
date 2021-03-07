#!/usr/bin/env node
const yargs = require('yargs')
const chalk = require('chalk')
// To read and write to a system's `.netrc` file we'll
// use the conveniently named netrc module.
const netrc = require('netrc')
const Table = require('cli-table')
const prompts = require('prompts')
const ApiClient = require('./api-client')

// Instead of forcing our users to enter their credentials every time they
// want to access a protected feature, we can change our app so that they
// only need to log in once. The only trick is that we'll need to store the
// user's authentication token so that it can be reused.

yargs
  .option('endpoint', {
    alias: 'e',
    default: 'http://localhost:1337',
    describe: 'The endpoint of the API'
  })
  // ask the user for their credentials, attempt to log in,
  // and if successful, it will store the user's username and
  // authentication token on the filesystem.
  .command('login', 'Log in to API', {}, login)
  // delete the stored user's credentials to reset back to the logged out state.
  .command('logout', 'Log out of API', {}, logout)
  // read the username of the logged in user from the filesystem and display it.
  .command('whoami', 'Check login status', {}, whoami)
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

async function login (opts) {
  const { endpoint } = opts

  const { username, password } = await prompts([
    {
      name: 'username',
      message: chalk.gray('What is your username?'),
      type: 'text'
    },
    {
      name: 'password',
      message: chalk.gray('What is your password?'),
      type: 'password'
    }
  ])

  const api = ApiClient({ username, password, endpoint })
  const authToken = await api.login()

  saveConfig({ endpoint, username, authToken })

  console.log(chalk.green(`Logged in as ${chalk.bold(username)}`))
}

function logout ({ endpoint }) {
  // If we want to log out, we can use the `saveConfig()`
  // function, but have username and authToken be undefined
  saveConfig({ endpoint })
  console.log('You are now logged out.')
}

// The `whoami` command will simply read our saved config and print the username
function whoami ({ endpoint }) {
  const { username } = loadConfig({ endpoint })

  const message = username
    ? `You are logged in as ${chalk.bold(username)}`
    : 'You are not currently logged in.'

  console.log(message)
}

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

  const { authToken } = loadConfig({ endpoint })

  const api = ApiClient({ endpoint, authToken })
  await api.editProduct(id, change)

  viewProduct({ id, endpoint })
}

// Unix systems established the convention of using a .netrc file that
// lives in a user's home directory. This was originally used to store
// usernames and passwords for remote FTP servers, but is commonly used
// by other command-line tools such as curl and heroku-cli
// (to name two command-line tools already used in this book).

function saveConfig ({ endpoint, username, authToken }) {
  // Our CLI expects the --endpoint option to contain the protocol (e.g. "https" or "http")
  // instead of just the host. For example, endpoint will be "https://example.com" instead
  // of "example.com". However, the convention for .netrc is to provide a login and password
  // for each host. This means we should omit the protocol when storing information in `.netrc`.
  const allConfig = netrc()
  const host = endpointToHost(endpoint)
  allConfig[host] = { login: username, password: authToken }

  netrc.save(allConfig)
}

function loadConfig ({ endpoint }) {
  // We use endpoint to determine which host to use when we pull our login
  // information out of the netrc config. If no config exists, we return
  // undefined for both the username and authToken
  const host = endpointToHost(endpoint)
  const config = netrc()[host] || {}
  return { username: config.login, authToken: config.password }
}

function endpointToHost (endpoint) {
  return endpoint.split('/')[2]
}
