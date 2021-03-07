#!/usr/bin/env node

// yargs, a fantastic module that helps "build interactive command line tools,
// by parsing arguments and generating an elegant user interface."

const yargs = require('yargs')
const Table = require('cli-table')
const ApiClient = require('./api-client')

yargs
  // this allows us to set global options that will affect all commands
  .option('endpoint', {
    alias: 'e',
    default: 'http://localhost:1337',
    describe: 'The endpoint of the API'
  })
  // listen for a particular command, e.g. "list products", define the
  // particular options available for that command, and specify the
  // function that should run and receive the options as an argument.
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
  // build the help screens for our app, make them available with --help
  .help()
  // show the user an error if they call the CLI without a command
  .demandCommand(1, 'You need at least one command before moving on')
  // this method needs to be run after all the others to actually
  // have yargs do its thing
  .parse()

async function listProducts (opts) {
  // Here's how we can use those options
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
