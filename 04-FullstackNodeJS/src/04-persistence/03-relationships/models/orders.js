const cuid = require('cuid')
const { isEmail } = require('validator')

const db = require('../db')

const Order = db.model('Order', {
  _id: { type: String, default: cuid },
  // we ensure valid emails
  buyerEmail: emailSchema({ required: true }),
  products: [
    {
      type: String,
      // we use the ref option. This tells mongoose that each item in this
      // array is both a string and the _id of a product.
      ref: 'Product',
      index: true,
      required: true
    }
  ],
  // we've added a status field that can only be one of
  // CREATED, PENDING, or COMPLETED
  status: {
    type: String,
    index: true,
    default: 'CREATED',
    enum: ['CREATED', 'PENDING', 'COMPLETED']
  }
})

module.exports = {
  get,
  list,
  create,
  edit,
  remove,
  model: Order
}

async function list (opts = {}) {
  const { offset = 0, limit = 25, productId, status } = opts

  const query = {}
  if (productId) query.products = productId
  if (status) query.status = status

  // If we did not use populate() and exec(), the products field would be an array of product IDs
  const orders = await Order.find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit)
    .populate('products')
    .exec()

  return orders
}

async function get (_id) {
  // By using the ref feature, mongoose is able to automatically fetch associated products for us.
  // However, it won't do this by default. To take advantage of this feature we need to use the
  // populate() and exec() methods.
  const order = await Order.findById(_id)
    .populate('products')
    .exec()

  return order
}

async function create (fields) {
  // exec() is designed to be used with queries and is not
  // available for documents. Instead, we would use the
  // dedicated execPopulate() method.
  const order = await new Order(fields).save()
  await order.populate('products').execPopulate()

  return order
}

async function edit (_id, change) {
  const order = await get(_id)
  Object.keys(change).forEach(function (key) {
    order[key] = change[key]
  })
  await order.save()
  return order
}

async function remove (_id) {
  await Order.deleteOne({ _id })
}

function emailSchema (opts = {}) {
  const { required } = opts
  return {
    type: String,
    required: !!required,
    validate: {
      validator: isEmail,
      message: props => `${props.value} is not a valid email address`
    }
  }
}
