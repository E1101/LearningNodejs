// The core fs module has methods that allow us to interact with the filesystem.
// Most often we'll use this to read and write to files, get file information
// such as size and modified time, and see directory listings.
const fs = require('fs')

const filename = '03-health_check-session_sharing-persistence_with_JWTs-relationships-reading_query_parameters-read-file-callback.js'

// The error is the first argument because we are expected to check and handle the error first before moving on.
fs.readFile(filename, (err, fileData) => {
  if (err) return console.error(err)

  console.log(`${filename}: ${fileData.length}`)
})
