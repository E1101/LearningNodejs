const cuid = require('cuid')
const bcrypt = require('bcrypt')
const { isEmail, isAlphanumeric } = require('validator')

const db = require('../db')

const SALT_ROUNDS = 10

const User = db.model('User', {
  _id: { type: String, default: cuid },
  username: usernameSchema(),
  password: { type: String, maxLength: 120, required: true },
  email: emailSchema({ required: true })
})

module.exports = {
  get,
  list,
  create,
  edit,
  remove,
  model: User
}

async function get (username) {
  return await User.findOne({username})
}

async function list (opts = {}) {
  const { offset = 0, limit = 25 } = opts

  return await User.find()
      .sort({_id: 1})
      .skip(offset)
      .limit(limit)
}

async function remove (username) {
  await User.deleteOne({ username })
}

async function create (fields) {
  // we need to hash the password so that
  // we do not save it in plain-text.
  const user = new User(fields)
  await hashPassword(user)
  await user.save()
  return user
}

async function edit (username, change) {
  const user = await get(username)
  Object.keys(change).forEach(key => { user[key] = change[key] })
  // we only want to hash the password if it's been changed.
  // We do not want to hash a password twice.
  if (change.password) await hashPassword(user)
  await user.save()
  return user
}

async function isUnique (doc, username) {
  const existing = await get(username)
  return !existing || doc._id === existing._id
}

function usernameSchema () {
  // we are enforcing uniqueness, length limits, and which characters can be used.
  return {
    type: String,
    required: true,
    // unique: true does enforce uniqueness, but this happens
    // because it creates a unique index in MongoDB.
    // ---
    // If we were to rely solely on unique: true and we attempt
    // to save a duplicate username, it's MongoDB not mongoose
    // that will throw an error. While this would still prevent
    // the document from being saved, the type and message of
    // the error will be different from our other validation errors.
    // To fix this, we create a custom validator so that mongoose
    // throws a validation error before MongoDB has a chance to save
    // the document and trigger an index error
    unique: true,
    lowercase: true,
    minLength: 3,
    maxLength: 16,
    validate: [
      {
        validator: isAlphanumeric,
        message: props => `${props.value} contains special characters`
      },
      {
        validator: str => !str.match(/^admin$/i),
        message: props => 'Invalid username'
      },
      {
        validator: function (username) { return isUnique(this, username) },
        message: props => 'Username is taken'
      }
    ]
  }
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

// We can't do this on the model schema itself because these are rules
// that we want to enforce on the plain-text values -- not the hashed value.
// For example, we want to make sure that the plain-text value is
// at least 12 characters. If we placed this validator on the schema,
// it would run after we hash the plain-text.
async function hashPassword (user) {
  if (!user.password) throw user.invalidate('password', 'password is required')
  if (user.password.length < 12) throw user.invalidate('password', 'password must be at least 12 characters')

  user.password = await bcrypt.hash(user.password, SALT_ROUNDS)
}
