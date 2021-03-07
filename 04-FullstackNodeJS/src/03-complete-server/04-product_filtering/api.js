const Products = require('./products')

module.exports = {
  listProducts
}

async function listProducts (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Because all query parameters come in as strings, and we expect tag to be a string,
  // we don't need to do any conversions here. We pass it straight through.
  const { offset = 0, limit = 25, tag } = req.query

  try {
    res.json(await Products.list({
      offset: Number(offset),
      limit: Number(limit),
      tag
    }))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
