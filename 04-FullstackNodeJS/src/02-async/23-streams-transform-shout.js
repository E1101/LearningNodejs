const fs = require('fs')
const { Transform } = require('stream')

fs.createReadStream('23-streams-transform-shout.js')
  .pipe(shout())
  .pipe(fs.createWriteStream('loud-code.txt'))

function shout () {
  return new Transform({
    // The first is the chunk of data, and we're already familiar with this from our use of on('data').
    // The second is encoding, which is useful if the chunk is a string. However, because we have not
    // changed any default behaviors with or read stream, we expect this value to be "buffer" and we can ignore it.
    // The final argument is a callback to be called with the results of transforming the chunk. The value provided
    // to the callback will be emitted as data to anything that is reading from the transform stream.
    // The callback can also be used to emit an error.
    transform (chunk, encoding, callback) {
      callback(null, chunk.toString().toUpperCase())
    }
  })
}
