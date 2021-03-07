// A promise is an object that represents a future action and its result.
// This is in contrast to callbacks which are just conventions around how we use functions.


const fs = require('fs').promises

const filename = '07-read-file-promises.js'

fs.readFile(filename)
  .then(data => console.log(`${filename}: ${data.length}`))
  .catch(err => console.error(err))
