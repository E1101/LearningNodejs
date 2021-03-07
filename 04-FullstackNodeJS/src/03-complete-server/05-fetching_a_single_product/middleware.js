module.exports = {
  cors,
  notFound,
  handleError
}

function cors (req, res, next) {
  const origin = req.headers.origin

  res.setHeader('Access-Control-Allow-Origin', origin || '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, PUT, DELETE, OPTIONS, XMODIFY'
  )
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Max-Age', '86400')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
  )

  // This is a function that is provided to all request handlers; this includes both
  // route handlers and middleware functions. The purpose of next() is to allow our
  // functions to pass control of the request and response objects to other handlers in a series.
  next()
}

//  We can create an error handler middleware function by defining it with an extra
//  first argument to receive the error. Once we do that, any time that next() is called
//  with an argument (e.g. next(err)), the next available error handler middleware
//  function will be called.
function handleError (err, req, res, next) {
  console.error(err)
  // There are possible problematic interactions between the default
  // express error handler and custom error handlers.
  // the best practice is to only respond if res.headersSent is false
  // within a custom error handler.
  if (res.headersSent) return next(err)
  res.status(500).json({ error: 'Internal Error' })
}

// only want this to run after all routes have been checked. If no route handlers match
// the request's URL, this function should run. An example would be if /path-does-not-exist is accessed.
// Alternatively, if any route handler matches, but calls next() (with no argument),
// this function should also run. An example of this would be /products/an-id-that-does-not-exist
// since this is a valid route pattern, and that handler wouldn't be able to find the product.
function notFound (req, res) {
  res.status(404).json({ error: 'Not Found' })
}
