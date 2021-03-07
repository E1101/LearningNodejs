const db = require('../db')
const Products = require('../models/products')

const products = require('../../products.json')

// All we're doing here is using the Products.create() method
// directly by iterating over all the products in the JSON file.
;(async function () {
  for (let i = 0; i < products.length; i++) {
    console.log(await Products.create(products[i]))
  }

  // The only trick is that we want to close the database connection
  // when we're finished so that Node.js will exit; Node.js won't terminate
  // while there is a connection open.
  db.disconnect()
})()
