// _id is an instance of ObjectId, a custom MongoDB class with particular methods -- not a string.
// Unfortunately, using a special object for our _id makes working with them more cumbersome.
// For example, we can't receive custom objects with methods in query strings or in JSON, and we would
// need to have extra logic to convert them. To avoid this issue we'll use cuid strings that have all of
// the benefits of ObjectId (collision-resistant, time-ordered, and time-stamped), but are just strings .
// ---
// we have to be sure to npm install cuid first
const cuid = require('cuid')

const db = require('./db')

// This command tells mongoose which collection in MongoDB to use,
// and it controls what kinds of properties documents in that collection should have.
// By default, mongoose will prevent us from persisting any properties absent from the schema object.
// ---
// If we try to save any additional properties, mongoose will ignore them.
const Product = db.model('Product', {
  // _id is special property that is always indexed and must be unique.
  // ---
  // By providing the default option, we are specifying the function we
  // want to call to create the default value for _id. In this case the
  // function we use is cuid()
  _id: { type: String, default: cuid },
  description: String,
  imgThumb: String,
  img: String,
  link: String,
  userId: String,
  userName: String,
  userLink: String,
  // We could even have it be an array of objects with a particular shape:
  // [{ tag: String, updatedAt: Date }].
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

  // We'll use skip() and limit() for paging functionality,
  // and find() to look for a specific tag (if provided).
  return await Product.find(query)
      // to make sure that we keep a stable sort order for paging
      // if we use this to sort, we'll return our products in the
      // order of their creation.
      .sort({_id: 1})
      .skip(offset)
      .limit(limit)
}

async function get (_id) {
  return await Product.findById(_id)
}

async function create (fields) {
  // To persist a new product to the database we first create one in memory using new Product()
  // and we pass it any fields we'd like it to have (description, img, etc...). Once it's created
  // in memory we call its async save() method which will persist it to the database.
  return await new Product(fields).save()
}

// To modify a product, we first fetch it using Products.get(),
// then we change each field with an update, and finally we save it.
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
