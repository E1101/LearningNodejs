const cuid = require('cuid')
// To check whether or not a URL is valid we're going to
// use a new module, validator. After installing it with `npm install validator`
const { isURL } = require('validator')

const db = require('./db')

// To make a field required, all we need to do is to
// specify that when creating the schema.
const Product = db.model('Product', {
  _id: { type: String, default: cuid },
  description: { type: String, required: true },
  imgThumb: urlSchema({ required: true }),
  img: urlSchema({ required: true }),
  link: urlSchema(),
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userLink: urlSchema(),
  tags: { type: [String], index: true }
})

module.exports = {
  get,
  list,
  create,
  edit,
  remove,
  model: Product
}

async function list (opts = {}) {
  const { offset = 0, limit = 25, tag } = opts

  const query = tag ? { tags: tag } : {}
  const products = await Product.find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit)

  return products
}

async function get (_id) {
  const product = await Product.findById(_id)
  return product
}

async function create (fields) {
  const product = await new Product(fields).save()
  return product
}

async function edit (_id, change) {
  const product = await get(_id)
  Object.keys(change).forEach(function (key) {
    product[key] = change[key]
  })
  await product.save()
  return product
}

async function remove (_id) {
  await Product.deleteOne({ _id })
}

function urlSchema (opts = {}) {
  const { required } = opts
  return {
    type: String,
    required: !!required,
    validate: {
      validator: isURL,
      message: props => `${props.value} is not a valid URL`
    }
  }
}
