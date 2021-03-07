const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

// it is an improvement that they can leverage our middleware.handleError() function
// to log the error and send the appropriate JSON response to the client, it would be
// nicer if that behavior was automatic. To do this we'll create a helper function that
// will wrap our route handlers so that any error will automatically be caught and passed to next().
module.exports = autoCatch({
  getProduct,
  listProducts
})

// we're accepting a new argument next() in our handler function,
// which we use in the case that our product is not found
async function getProduct (req, res, next) {
  // get the desired product ID from the request.
  const { id } = req.params

  const product = await Products.get(id)
  if (!product) return next()

  res.json(product)
}

async function listProducts (req, res) {
  const { offset = 0, limit = 25, tag } = req.query

  const products = await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  })

  res.json(products)
}
