const http = require('http')
const querystring = require('querystring')

module.exports = function ({ endpoint }) {
  endpoint = endpoint || 'http://localhost:1337'

  return {
    getProduct,
    listProducts
  }

  function getProduct (id, cb) {
    const url = `${endpoint}/products/${id}`
    getJSON(url, cb)
  }

  function listProducts (opts, cb) {
    if (typeof opts === 'function') {
      cb = opts
      opts = {}
    }

    const { offset = 0, limit = 25, tag } = opts
    const url = `${endpoint}/products?${querystring.stringify({
      offset,
      limit,
      tag
    })}`
    getJSON(url, cb)
  }
}

function getJSON (url, cb) {
  http.get(url, onRes).on('error', err => cb(err))

  function onRes (res) {
    const { statusCode } = res
    const contentType = res.headers['content-type']

    let error
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`)
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error(
        'Invalid content-type.\n' +
          `Expected application/json but received ${contentType}`
      )
    }

    if (error) {
      res.resume()
      return cb(error)
    }

    res.setEncoding('utf8')
    let rawData = ''
    res
      .on('data', chunk => {
        rawData += chunk
      })
      .on('end', () => {
        try {
          const parsedData = JSON.parse(rawData)
          cb(null, parsedData)
        } catch (e) {
          console.error(e.message)
        }
      })
  }
}
