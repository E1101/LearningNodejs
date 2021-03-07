const fs = require('fs')
const path = require('path')

// process.argv is an globally available array of the command line arguments used
// to start Node.js. If you were to run a script with the command node file.js,
// process.argv would be equal to ['node', 'file.js']. In this case we allow our
// file to be run like node 06c-read-dir-callbacks-cli.js ../another-directory.
// In that case process.argv[2] will be ../another-directory.
const targetDirectory = process.argv[2] || './'

getFileLengths(targetDirectory, function (err, results) {
  if (err) return console.error(err)

  results.forEach(([file, length]) => console.log(`${file}: ${length}`))

  console.log('done!')
})

function getFileLengths (dir, cb) {
  // the first thing we do is use fs.readdir() to get the directory listing.
  // We also follow Node.js convention, and if there's an error, we'll return early,
  // and call the callback cb with the error.
  fs.readdir(dir, function (err, files) {
    if (err) return cb(err)

    // We use the built-in path module (require('path')) to combine our
    // specified directory with each file name to get an array of file paths.
    const filePaths = files.map(file => path.join(dir, file))

    mapAsync(filePaths, readFile, (err, results) => cb(err, results))
  })
}

// It's often useful to wrap an async function with your
// own to make small changes to expected inputs and/or outputs.
function readFile (file, cb) {
  fs.readFile(file, function (err, fileData) {
    if (err) {
      // we might be calling fs.readFile() on a directory.
      // If this happens, fs.readFile() will give us an error.
      // Instead of halting the whole process, we'll treat
      // directories as having a length of 0.
      if (err.code === 'EISDIR') return cb(null, [file, 0])

      return cb(err)
    }

    cb(null, [file, fileData.length])
  })
}

function mapAsync (arr, fn, onFinish) {
  let prevError
  let nRemaining = arr.length
  const results = []

  arr.forEach(function (item, i) {
    fn(item, function (err, data) {
      if (prevError) return

      if (err) {
        prevError = err
        return onFinish(err)
      }

      results[i] = data

      nRemaining--
      if (!nRemaining) onFinish(null, results)
    })
  })
}
