#!/usr/bin/env node
// This is a Unix convention called a Shebang that
// tells the OS how to run this file if we open it directly.

const Table = require('cli-table')
const ApiClient = require('./api-client')

cli()

async function cli () {
  // Grab the user's tag with process.argv (it's ok if the user doesn't provide one).
  //
  const [ tag ] = process.argv.slice(2)

  // Fetch the product list using the API Client.
  //
  const api = ApiClient()
  const products = await api.listProducts({ tag })

  // Print the table of products using cli-table.
  //
  const headers = ['ID', 'Description', 'Tags', 'User']

  const margin = headers.length
  const width = process.stdout.columns - margin
  const widthId = 30
  const widthOther = Math.floor((width - widthId) / (headers.length - 1))

  const table = new Table({
    head: headers,
    colWidths: [widthId, widthOther, widthOther, widthOther]
  })

  products.forEach(p => table.push([
    p._id,
    p.description.replace(/\n|\r/g, ' '),
    p.userName,
    p.tags.slice(0, 3).join(', ')
  ]))

  console.log(table.toString())
}
