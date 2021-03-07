const Products = require('./products')

module.exports = {
  listProducts
}

async function listProducts (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  // We create two variables offset and limit from the req.query object that express provides.
  // We also make sure that they have default values if one or both are not set
  // --
  // It's important to notice that we make sure to coerce the limit and offset values into numbers.
  // Query parameter values are always strings.
  const { offset = 0, limit = 25 } = req.query

  try {
    res.json(await Products.list({
      offset: Number(offset),
      limit: Number(limit)
    }))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
