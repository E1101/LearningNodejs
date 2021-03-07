const fs = require('fs').promises

fs.readdir('./')
  .then(fileList =>
    // To be able to perform multiple async actions concurrently, we'll need to use Promise.all().
    // Promise.all() is globally available in Node.js, and it execute an array of promises at the same time.
    // It's conceptually similar to the mapAsync() function we built. After all promises have been completed,
    // it will return with an array of results.
    Promise.all(
      // One thing to notice about our transformation is that we are not only
      // transforming each file name into a fs.readFile() promise, but we are
      // also customizing the result.
      fileList.map(file => fs.readFile(file).then(data => [file, data.length]))
    )
  )
  .then(results => {
    results.forEach(([file, length]) => console.log(`${file}: ${length}`))
    console.log('done!')
  })
  .catch(err => console.error(err))
